# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Etsin Finder cache related functionalities."""

from pymemcache import serde
from pymemcache.client import base

from etsin_finder.app_config import get_memcached_config
from etsin_finder.utils.utils import FlaskService
from etsin_finder.log import log


class BaseCache(FlaskService):
    """Base class for various caches used in the app."""

    def __init__(self, app):
        """Init cache."""
        super().__init__(app)

        self.app = app
        memcached_config = get_memcached_config(app)

        if memcached_config:
            self.cache = base.Client(
                (memcached_config.get("HOST"), memcached_config.get("PORT")),
                serializer=serde.python_memcache_serializer,
                deserializer=serde.python_memcache_deserializer,
                connect_timeout=1,
                timeout=1,
            )
        elif not self.is_testing:
            app.logger.error("Unable to initialize Cache due to missing config")

    def do_add(self, key, value, ttl, noreply=None):
        """Update cache.

        Update cache with new key and specific time-to-live.

        Args:
            key (str): The key to update.
            value (str): The value to update the key with.
            ttl (int): Number of seconds until the item is expired from the cache.
            noreply (bool): Set True or False to override default noreply value for request.

        Returns:
            bool: True if successful, otherwise False

        """
        success = False
        try:
            success = bool(self.cache.add(key, value, expire=ttl, noreply=noreply))
        except Exception as e:
            self.app.logger.warning("Add to cache failed")
            self.app.logger.warning(e)
        return success

    def do_update(self, key, value, ttl, noreply=None):
        """Update cache.

        Update cache with new key and specific time-to-live.

        Args:
            key (str): The key to update.
            value (str): The value to update the key with.
            ttl (int): Number of seconds until the item is expired from the cache.
            noreply (bool): Set True or False to override default noreply value for request.

        Returns:
            bool: True if successful, otherwise False

        """
        success = False
        try:
            success = self.cache.set(key, value, expire=ttl, noreply=noreply)
        except Exception as e:
            self.app.logger.warning("Insert to cache failed")
            self.app.logger.warning(e)
        return success

    def do_get(self, key):
        """Try to fetch entry from cache.

        Args:
            key (str): The key to fetch.

        Returns:
            str: The value for the key, or default if the key wasn’t found.

        """
        try:
            return self.cache.get(key, None)
        except Exception as e:
            self.app.logger.debug("Get from cache failed")
            self.app.logger.debug(e)
        return None

    def do_delete(self, key, noreply=None):
        """Try to delete entry from cache.

        Args:
            key (str): The key to fetch.
            noreply (bool): Set True or False to override default noreply value for request.

        Returns:
            bool: True if successful, otherwise False

        """
        success = False
        try:
            success = bool(self.cache.delete(key, noreply=noreply))
        except Exception as e:
            self.app.logger.debug("Delete from cache failed")
            self.app.logger.debug(e)
        return success

    def do_gets(self, key):
        """Try to fetch entry from cache for Check-And-Set.

        Args:
            key (str): The key to fetch.

        Returns tuple:
            str: The value for the key, or default if the key wasn’t found.
            token: CAS token

        """
        try:
            return self.cache.gets(key)
        except Exception as e:
            self.app.logger.debug("Gets from cache failed")
            self.app.logger.debug(e)
        return None, None

    def do_cas(self, key, value, token, ttl, noreply=None):
        """Update cache only if it has not changed after gets

        Update cache with new key and specific time-to-live.

        Args:
            key (str): The key to update.
            value (str): The value to update the key with.
            token (str): Token from do_gets.
            ttl (int): Number of seconds until the item is expired from the cache.
            noreply (bool): Set True or False to override default noreply value for request.

        Returns:
            bool: True if successful, otherwise False

        """
        success = False
        try:
            success = bool(
                self.cache.cas(key, value, token, expire=ttl, noreply=noreply)
            )
        except Exception as e:
            self.app.logger.warning("Insert to cache failed")
            self.app.logger.warning(e)
        return success


class CatalogRecordCache(BaseCache):
    """Cache that stores data related to a specific catalog record."""

    def __init__(self, app, ttl=1200, noreply=None, prefix="cr_"):
        """Init cache.

        Args:
            app: App instance
            ttl: How long to store value, in seconds
            prefix: Cache key prefix, should be unique for each cache
            noreply: Set noreply for all cache requests, None for defaults
        """
        super().__init__(app)
        self.CACHE_ITEM_TTL = ttl
        self.CACHE_KEY_PREFIX = prefix
        self.CACHE_NO_REPLY = noreply

    def update(self, cr_id, data):
        """Update catalog record cache with catalog record json.

        Args:
            cr_id (str): Catalog record identifier.
            data: Data to save.

        Returns:
            success (bool)

        """
        if cr_id and data:
            return self.do_update(
                self._get_cache_key(cr_id),
                data,
                self.CACHE_ITEM_TTL,
                noreply=self.CACHE_NO_REPLY,
            )
        return data

    def get(self, cr_id):
        """Get data from catalog record cache.

        Args:
            cr_id (str): Catalog record identifier.

        """
        return self.do_get(self._get_cache_key(cr_id))

    def delete(self, cr_id):
        """Delete data from catalog record cache.

        Args:
            cr_id (str): Catalog record identifier.

        Returns:
            success (bool)

        """
        return self.do_delete(self._get_cache_key(cr_id), noreply=self.CACHE_NO_REPLY)

    def gets(self, cr_id):
        """Get value from cache.

        Args:
            cr_id (str): Catalog record identifier.
            data: Data to save.

        Returns:
            data: Value from cache.
            token: CAS token.

        """
        if cr_id:
            return self.do_gets(self._get_cache_key(cr_id))
        return (None, None)

    def add(self, cr_id, data):
        """Add value to cache.

        Args:
            cr_id (str): Catalog record identifier.
            data: Data to save.

        Returns:
            success (bool)

        """
        if cr_id:
            return self.do_add(
                self._get_cache_key(cr_id),
                data,
                self.CACHE_ITEM_TTL,
                noreply=self.CACHE_NO_REPLY,
            )
        return False

    def cas(self, cr_id, data, token):
        """Update catalog record cache with catalog record json.

        Args:
            cr_id (str): Catalog record identifier.
            data: Data to save.

        Returns:
            success (bool)

        """
        return self.do_cas(
            self._get_cache_key(cr_id),
            data,
            token,
            self.CACHE_ITEM_TTL,
            noreply=self.CACHE_NO_REPLY,
        )

    def _get_cache_key(self, cr_id):
        if not cr_id:
            log.warning("missing cr_id: {cr_id}")
        return f"{self.CACHE_KEY_PREFIX}{cr_id}"


class RemsCache(BaseCache):
    """Rems entitlements related cache."""

    CACHE_ITEM_TTL = 300

    def update(self, cr_id, user_id, permission=False):
        """Update cache with user entitlement for a specific catalog record.

        Args:
            cr_id (str): Catalog record identifier.
            user_id (str): User identifier.
            permission (bool, optional): Does the user have permission. Defaults to False.

        Returns:
            bool: Return the permission of updated cache.

        """
        if cr_id and user_id:
            return self.do_update(
                self._get_cache_key(cr_id, user_id), permission, self.CACHE_ITEM_TTL
            )
        return permission

    def get(self, cr_id, user_id):
        """Get entitlement for a user related to a specific catalog record from cache.

        Args:
            cr_id (str): Catalog record identifier.
            user_id (str): User identifier.

        Returns:
            str: The value for the user

        """
        return self.do_get(self._get_cache_key(cr_id, user_id))

    @staticmethod
    def _get_cache_key(cr_id, user_id):
        return cr_id + user_id
