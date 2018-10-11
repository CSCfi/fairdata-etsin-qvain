# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from pymemcache.client import base
from pymemcache import serde


class BaseCache:

    def __init__(self, memcached_config):
        if memcached_config:
            self.cache = base.Client((memcached_config['HOST'], memcached_config['PORT']),
                                     serializer=serde.python_memcache_serializer,
                                     deserializer=serde.python_memcache_deserializer, connect_timeout=1, timeout=1)

    def do_update(self, key, value, ttl):
        try:
            self.cache.set(key, value, expire=ttl)
        except Exception as e:
            from etsin_finder.finder import app
            app.logger.debug("Insert to cache failed")
            app.logger.debug(e)
        return value

    def do_get(self, key):
        try:
            return self.cache.get(key, None)
        except Exception as e:
            from etsin_finder.finder import app
            app.logger.debug("Get from cache failed")
            app.logger.debug(e)
        return None


class CatalogRecordCache(BaseCache):

    CACHE_ITEM_TTL = 30

    def update_cache(self, cr_id, cr_json):
        if cr_id and cr_json:
            return self.do_update(self._get_cache_key(cr_id), cr_json, self.CACHE_ITEM_TTL)
        return cr_json

    def get_from_cache(self, cr_id):
        return self.do_get(self._get_cache_key(cr_id))

    @staticmethod
    def _get_cache_key(cr_id):
        return cr_id


class RemsCache(BaseCache):
    CACHE_ITEM_TTL = 30

    def update_cache(self, cr_id, user_id, permission=False):
        if cr_id and user_id:
            return self.do_update(self._get_cache_key(cr_id, user_id), permission, self.CACHE_ITEM_TTL)
        return permission

    def get_from_cache(self, cr_id, user_id):
        self.do_get(self._get_cache_key(cr_id, user_id))

    @staticmethod
    def _get_cache_key(cr_id, user_id):
        return cr_id + user_id
