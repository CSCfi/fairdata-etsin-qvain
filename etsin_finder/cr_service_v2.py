# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations specific to Metax API v2"""

import requests

from etsin_finder.finder import app
from etsin_finder.app_config import get_metax_api_config
from etsin_finder.utils import json_or_empty, FlaskService
from etsin_finder.constants import ACCESS_TYPES

log = app.logger


class MetaxAPIService(FlaskService):
    """Metax API Service"""

    def __init__(self, app):
        """Init Metax API Service."""
        super().__init__(app)

        metax_api_config = get_metax_api_config(app.testing)

        if metax_api_config:
            self.METAX_GET_CATALOG_RECORD_URL = 'https://{0}/rest/v2/datasets'.format(metax_api_config.get('HOST')) + \
                '/{0}?expand_relation=data_catalog'

            self.METAX_GET_REMOVED_CATALOG_RECORD_URL = self.METAX_GET_CATALOG_RECORD_URL + '&removed=true'

            self.user = metax_api_config.get('USER')
            self.pw = metax_api_config.get('PASSWORD')
            self.verify_ssl = metax_api_config.get('VERIFY_SSL', True)
        elif not self.is_testing:
            log.error("Unable to initialize MetaxAPIService due to missing config")

    def get_catalog_record(self, identifier):
        """Get a catalog record with a given identifier from MetaX API v2.

        Args:
            identifier (str): Catalog record identifier.

        Returns:
            dict: Return the responce from Metax as dict, else None.

        """
        try:
            metax_api_response = requests.get(self.METAX_GET_CATALOG_RECORD_URL.format(identifier),
                                              headers={'Accept': 'application/json'},
                                              auth=(self.user, self.pw),
                                              verify=self.verify_ssl,
                                              timeout=3)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to get catalog record {0} from Metax API\n\
                    Response status code: {1}\n\
                    Response text: {2}"
                    .format(
                        identifier,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text)
                )
            else:
                log.error("Failed to get catalog record {0} from Metax API\n{1}".format(identifier, e))
            return None
        print(self.METAX_GET_CATALOG_RECORD_URL.format(identifier))
        print(metax_api_response.json().get('draft_of', 'NOT EXISTING'))
        return metax_api_response.json()

    def get_removed_catalog_record(self, identifier):
        """Get a catalog record with a given identifier from MetaX API

        Should return only datasets that are removed.

        Args:
            identifier (str): Catalog record identifier.

        Returns:
            dict: Return the responsce from Metax as dict, else None.

        """
        try:
            metax_api_response = requests.get(self.METAX_GET_REMOVED_CATALOG_RECORD_URL.format(identifier),
                                              headers={'Accept': 'application/json'},
                                              auth=(self.user, self.pw),
                                              verify=self.verify_ssl,
                                              timeout=3)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to get removed catalog record {0} from Metax API\n\
                    Response status code: {1}\n\
                    Response text: {2}".format(
                        identifier,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
            else:
                log.error("Failed to get removed catalog record {0} from Metax API\n{1}".format(identifier, e))
            return None

        return metax_api_response.json()


_metax_api = MetaxAPIService(app)


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
        return app.cr_cache.update_cache(cache_key, _get_cr_from_metax(cr_id, check_removed_if_not_exist))

    cr = app.cr_cache.get_from_cache(cache_key)
    if cr is None:
        cr = _get_cr_from_metax(cr_id, check_removed_if_not_exist)
        return app.cr_cache.update_cache(cr_id, cr)
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
    cr = _metax_api.get_catalog_record(cr_id)
    if not cr and check_removed_if_not_exist:
        cr = _metax_api.get_removed_catalog_record(cr_id)
    return cr
