# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations specific to Metax API v2"""

import requests
from flask import current_app

from etsin_finder.log import log
from etsin_finder.app_config import get_metax_api_config
from etsin_finder.utils.utils import FlaskService, format_url
from etsin_finder.utils.request_utils import make_request


class MetaxAPIService(FlaskService):
    """Metax API Service"""

    def __init__(self, app):
        """Init Metax API Service."""
        super().__init__(app)

        metax_api_config = get_metax_api_config(app)

        if metax_api_config:
            # HTTPS as a default protocol for Metax URLs...
            if metax_api_config.get('VERIFY_SSL') is True:
                self.METAX_GET_CATALOG_RECORD_URL = 'https://{0}/rest/v2/datasets'.format(metax_api_config.get('HOST')) + \
                '/{0}?expand_relation=data_catalog'
            # ... but use HTTP if Metax is running in Docker
            if metax_api_config.get('VERIFY_SSL') is False:
                self.METAX_GET_CATALOG_RECORD_URL = 'http://{0}/rest/v2/datasets'.format(metax_api_config.get('HOST')) + \
                '/{0}?expand_relation=data_catalog'

            self.METAX_GET_REMOVED_CATALOG_RECORD_URL = self.METAX_GET_CATALOG_RECORD_URL + '&removed=true'

            self.user = metax_api_config.get('USER')
            self.pw = metax_api_config.get('PASSWORD')
            self.verify_ssl = metax_api_config.get('VERIFY_SSL', True)
            self.proxies = None
            if metax_api_config.get('HTTPS_PROXY'):
                self.proxies = dict(https=metax_api_config.get('HTTPS_PROXY'))
        elif not self.is_testing:
            log.error("Unable to initialize MetaxAPIService due to missing config")

    def get_catalog_record(self, identifier):
        """Get a catalog record with a given identifier from MetaX API v2.

        Args:
            identifier (str): Catalog record identifier.

        Returns:
            dict: Return the responce from Metax as dict, else None.

        """
        url = format_url(self.METAX_GET_CATALOG_RECORD_URL, identifier)
        resp, _, success = make_request(requests.get,
                                        url,
                                        headers={'Accept': 'application/json'},
                                        auth=(self.user, self.pw),
                                        verify=self.verify_ssl,
                                        proxies=self.proxies,
                                        timeout=3)
        if not success:
            log.warning("Failed to get catalog record {0} from Metax API".format(identifier))
            return None
        return resp

    def get_removed_catalog_record(self, identifier):
        """Get a catalog record with a given identifier from MetaX API

        Should return only datasets that are removed.

        Args:
            identifier (str): Catalog record identifier.

        Returns:
            dict: Return the responsce from Metax as dict, else None.

        """
        url = format_url(self.METAX_GET_REMOVED_CATALOG_RECORD_URL, identifier)
        resp, _, success = make_request(requests.get,
                                        url,
                                        headers={'Accept': 'application/json'},
                                        auth=(self.user, self.pw),
                                        verify=self.verify_ssl,
                                        proxies=self.proxies,
                                        timeout=3)
        if not success:
            log.warning("Failed to get removed catalog record {0} from Metax API".format(identifier))
            return None
        return resp

def get_catalog_record(cr_id, check_removed_if_not_exist, refresh_cache=False):
    """Get single catalog record from Metax API v2.

    If it does not exist, try checking/fetching from deleted catalog records.

    Args:
        cr_id (str): Catalog record identifier.
        check_removed_if_not_exist (bool): Checck if catalog record has been removed if it does not exist.
        refresh_cache (bool, optional): Should the cache be refreshed. Defaults to False.

    Returns:
        dict: The wanted catalog record.

    """
    cache_key = "v2_{}".format(cr_id)
    if refresh_cache:
        return current_app.cr_cache.update_cache(cache_key, _get_cr_from_metax(cr_id, check_removed_if_not_exist))

    cr = current_app.cr_cache.get_from_cache(cache_key)
    if cr is None:
        cr = _get_cr_from_metax(cr_id, check_removed_if_not_exist)
        return current_app.cr_cache.update_cache(cr_id, cr)
    else:
        return cr


def _get_cr_from_metax(cr_id, check_removed_if_not_exist):
    """Get removed catalog record from Metax

    Args:
        cr_id (str): Catalog record identifier.
        check_removed_if_not_exist (bool): -

    Returns:
        dict: Return the responce from Metax as dict, else None.

    """
    _metax_api = MetaxAPIService(current_app)
    cr = _metax_api.get_catalog_record(cr_id)
    if not cr and check_removed_if_not_exist:
        cr = _metax_api.get_removed_catalog_record(cr_id)
    return cr
