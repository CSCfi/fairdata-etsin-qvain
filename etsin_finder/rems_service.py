# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Fairdata Rems"""

import requests

from etsin_finder.cr_service import get_catalog_record_preferred_identifier, get_catalog_record, is_rems_catalog_record
from etsin_finder.finder import app
from etsin_finder.app_config import get_fairdata_rems_api_config
from etsin_finder.utils import json_or_empty

log = app.logger


class RemsAPIService:
    """Rems Service"""

    def __init__(self, rems_api_config):
        """Setup Rems API Service"""
        if rems_api_config:
            self.REMS_URL = 'https://{0}'.format(rems_api_config['HOST']) + '/api/entitlements?resource={0}'
            self.API_KEY = rems_api_config['API_KEY']
        else:
            log.error("Unable to initialize RemsAPIService due to missing config")

    def get_rems_permission(self, user_id, rems_resource):
        """
        Get user entitlement for a rems resource.

        :param user_id:
        :param rems_resource:
        :return:
        """
        if not user_id or not rems_resource:
            return False
        try:
            rems_api_response = requests.get(self.REMS_URL.format(rems_resource),
                                             headers={
                                                 'Accept': 'application/json',
                                                 'x-rems-api-key': self.API_KEY,
                                                 'x-rems-user-id': user_id},
                                             verify=False,
                                             timeout=3)
            rems_api_response.raise_for_status()
        except Exception as e:
            log.error('Failed to get entitlement data from Fairdata REMS for user_id: {0}, resource: {1}'.
                      format(user_id, rems_resource))
            if isinstance(e, requests.HTTPError):
                log.warning('Response status code: {0}'.format(rems_api_response.status_code))
                log.warning('Response text: {0}'.format(json_or_empty(rems_api_response)))
            else:
                log.error(e)
            return False

        return len(rems_api_response.json()) > 0


_rems_api = RemsAPIService(get_fairdata_rems_api_config())


def get_user_rems_permission_for_catalog_record(cr_id, user_id):
    """
    Get info about whether user is entitled for a catalog record.

    :param cr_id:
    :param user_id:
    :return:
    """
    if not user_id or not cr_id:
        return False

    cr = get_catalog_record(cr_id, False, False)
    if cr and is_rems_catalog_record(cr):
        pref_id = get_catalog_record_preferred_identifier(cr)
        if not pref_id:
            return False

        return _rems_api.get_rems_permission(user_id, pref_id)

    return False
