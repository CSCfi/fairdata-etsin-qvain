# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Etsin Finder cache related functionalities"""

from pymemcache import serde
from pymemcache.client import base

from etsin_finder.app_config import get_memcached_config
from etsin_finder.utils.utils import FlaskService


class BaseCache(FlaskService):
    """Base class for various caches used in the app"""

    def __init__(self, app):
        """Setup cache"""
        super().__init__(app)

        memcached_config = get_memcached_config(app)

        if memcached_config:
            self.cache = base.Client((memcached_config.get('HOST'), memcached_config.get('PORT')),
                                     serializer=serde.python_memcache_serializer,
                                     deserializer=serde.python_memcache_deserializer, connect_timeout=1, timeout=1)
        elif not self.is_testing:
            app.logger.error("Unable to initialize Cache due to missing config")

    def do_update(self, key, value, ttl):
        """Update cache

        Update cache with new key and specific time-to-live.

        Args:
            key (str): The key to update.
            value (str): The value to update the key with.
            ttl (int): Number of seconds until the item is expired from the cache.

        Returns:
            str: The value.

        """
        try:
            self.cache.set(key, value, expire=ttl)
        except Exception as e:
            from etsin_finder.log import log
            log.warning("Insert to cache failed")
            log.warning(e)
        return value

    def do_get(self, key):
        """Try to fetch entry from cache

        Args:
            key (str): The key to fetch.

        Returns:
            str: The value for the key, or default if the key wasn’t found.

        """
        if self.is_testing:
            return None

        try:
            return self.cache.get(key, None)
        except Exception as e:
            from etsin_finder.log import log
            log.debug("Get from cache failed")
            log.debug(e)
        return None


class CatalogRecordCache(BaseCache):
    """Catalog record related cache"""

    CACHE_ITEM_TTL = 1200

    def update_cache(self, cr_id, cr_json):
        """Update catalog record cache with catalog record json

        Args:
            cr_id (str): Catalog record identifier.
            cr_json (json): Catalog record JSON.

        Returns:
            json: Updated catalog record JSON

        """
        if cr_id and cr_json:
            return self.do_update(self._get_cache_key(cr_id), cr_json, self.CACHE_ITEM_TTL)
        return cr_json

    def get_from_cache(self, cr_id):
        """Get catalog record json from catalog record cache.

        Args:
            cr_id (str): Catalog record identifier.

        Returns:
            json: Catalog record JSON

        """
        return self.do_get(self._get_cache_key(cr_id))

    @staticmethod
    def _get_cache_key(cr_id):
        return cr_id


class RemsCache(BaseCache):
    """Rems entitlements related cache"""

    CACHE_ITEM_TTL = 300

    def update_cache(self, cr_id, user_id, permission=False):
        """Update cache with user entitlement for a specific catalog record.

        Args:
            cr_id (str): Catalog record identifier.
            user_id (str): User identifier.
            permission (bool, optional): Does the user have permission. Defaults to False.

        Returns:
            bool: Return the permission of updated cache.

        """
        if cr_id and user_id:
            return self.do_update(self._get_cache_key(cr_id, user_id), permission, self.CACHE_ITEM_TTL)
        return permission

    def get_from_cache(self, cr_id, user_id):
        """Get entitlement for a user related to a specific catalog record from cache

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
