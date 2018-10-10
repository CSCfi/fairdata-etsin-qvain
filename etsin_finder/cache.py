# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from cachetools import TTLCache

from etsin_finder.finder import app

_log = app.logger


class CatalogRecordCache(TTLCache):

    def update_cache(self, cr):
        if cr and 'identifier' in cr:
            _log.debug("Updating cache with identifier {0}".format(cr['identifier']))
            self[cr['identifier']] = cr
        return cr

    def get_from_cache(self, cr_id):
        _log.debug("Trying to get {0} from cache and it exists in the cache: {1}".format(cr_id, str(
            self.get(cr_id) is not None)))
        return self.get(cr_id)


class RemsCache(TTLCache):

    def update_cache(self, cr_id, user_id, is_entitled=False):
        if cr_id and user_id:
            _log.debug("Updating cache with identifier {0} and user {1}".format(cr_id, user_id))
            self[self._get_key(cr_id, user_id)] = is_entitled
        return is_entitled

    def get_from_cache(self, cr_id, user_id):
        _log.debug("Trying to get entitlement for cr {0} and user {1} from cache and it exists in the cache: {2}"
                   .format(cr_id, user_id, str(self.get(self._get_key(cr_id, user_id)) is not None)))
        return self.get(self._get_key(cr_id, user_id), False)

    @staticmethod
    def _get_key(cr_id, user_id):
        return cr_id + user_id
