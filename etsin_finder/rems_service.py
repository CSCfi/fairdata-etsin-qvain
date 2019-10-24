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
from etsin_finder.utils import json_or_empty, FlaskService

log = app.logger


class RemsAPIService(FlaskService):
    """Rems Service"""

    def __init__(self, app):
        """Setup Rems API Service"""
        super().__init__(app)

        rems_api_config = get_fairdata_rems_api_config(app.testing)

        if rems_api_config:
            self.REMS_URL = 'https://{0}'.format(rems_api_config['HOST']) + '/api/entitlements?resource={0}'
            self.API_KEY = rems_api_config['API_KEY']
        elif not self.is_testing:
            log.error("Unable to initialize RemsAPIService due to missing config")

    def get_rems_permission(self, user_id, rems_resource):
        """
        Get user entitlement for a rems resource.

        :param user_id:
        :param rems_resource:
        :return:
        """
        if not user_id or not rems_resource:
            log.error('Failed to get REMS permission, user_id: {0} or rems_resource: {1} not valid.'. format(user_id, rems_resource))
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
                log.warning('Response status code: {0}\nResponse text: {1}'.format(rems_api_response.status_code, json_or_empty(rems_api_response)))
            else:
                log.error('Error in rems_api_response\n{0}'.format(e))
            return False

        return len(rems_api_response.json()) > 0


_rems_api = RemsAPIService(app)


def get_user_rems_permission_for_catalog_record(cr_id, user_id):
    """
    Get info about whether user is entitled for a catalog record.

    :param cr_id:
    :param user_id:
    :return:
    """
    if not user_id or not cr_id:
        log.error('Failed to get rems permission for catalog record. user_id: {0} or cr_id: {1} is invalid'.format(user_id, cr_id))
        return False

    cr = get_catalog_record(cr_id, False, False)
    if cr and is_rems_catalog_record(cr):
        pref_id = get_catalog_record_preferred_identifier(cr)
        if not pref_id:
            log.error('Could not get cr_id: {0} preferred identifier.'.format(cr_id))
            return False

        return _rems_api.get_rems_permission(user_id, pref_id)
    log.warning('Invalid catalog record or not a REMS catalog record. cr_id: {0}'.format(cr_id))
    return False
