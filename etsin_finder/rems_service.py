# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Fairdata Rems"""

from requests import request, HTTPError

from etsin_finder.cr_service import get_catalog_record_preferred_identifier, get_catalog_record, is_rems_catalog_record
from etsin_finder.app_config import get_fairdata_rems_api_config
from etsin_finder.utils import json_or_empty, FlaskService
from etsin_finder.finder import app

log = app.logger
class RemsAPIService(FlaskService):
    """Rems Service"""

    def __init__(self, app, user):
        """Setup Rems API Service"""
        super().__init__(app)

        rems_api_config = get_fairdata_rems_api_config(app.testing)

        if rems_api_config:
            self.USER_ID = user
            self.API_KEY = str(rems_api_config['API_KEY'])
            self.HOST = rems_api_config['HOST']
            self.HEADERS = {
                'Accept': 'application/json',
                'x-rems-api-key': self.API_KEY,
                'x-rems-user-id': 'RDowner@funet.fi'
            }
            self.REMS_URL = 'https://{0}'.format(self.HOST) + '/api/entitlements?resource={0}'
            self.REMS_ENTITLEMENTS = 'https://{0}'.format(self.HOST) + '/api/entitlements'
            self.REMS_CREATE_USER = 'https://{0}'.format(self.HOST) + '/api/users/create'
            self.REMS_GET_APPLICATIONS = 'https://{0}'.format(self.HOST) + '/api/applications/{0}'
            self.REMS_CATALOGUE_ITEMS = 'https://{0}'.format(self.HOST) + '/api/catalogue-items?resource={0}'
            self.REMS_CREATE_APPLICATION = 'https://{0}'.format(self.HOST) + '/api/applications/create'
        elif not self.is_testing:
            log.error("Unable to initialize RemsAPIService due to missing config")

    def rems_request(self, method, url, err_message, json=None):
        assert method in ['GET', 'POST'], 'Method attribute must be one of [GET, POST].'
        log.info('Sending {0} request to {1}'.format(method, url))
        try:
            if json:
                rems_api_response = request(method=method, headers=self.HEADERS, url=url, json=json, verify=False, timeout=3)
            else:
                rems_api_response = request(method=method, headers=self.HEADERS, url=url, verify=False, timeout=3)
            rems_api_response.raise_for_status()
        except Exception as e:
            log.warning(err_message)
            if isinstance(e, HTTPError):
                log.warning('Response status code: {0}\nResponse text: {1}'.format(rems_api_response.status_code, json_or_empty(rems_api_response)))
                return 'HTTPError', rems_api_response.status_code
            else:
                log.error('Error in request\n{0}'.format(e))
                return 'Error in request', 500
        log.info('rems_api_response: {0}'.format(rems_api_response.json()))
        return rems_api_response.json()

    def get_user_applications(self, application_id):
        """
        Get all applications which the current user can see
        :param application_id:
        :return:
        """
        log.info('Get all applications for current user')
        method = 'GET'
        url = self.REMS_GET_APPLICATIONS.format(application_id)
        err_message = 'Failed to get catalogue item data from Fairdata REMS for user_id: {0}'.format(self.USER_ID)
        return self.rems_request(method, url, err_message)

    def create_application(self, id):
        """
        Creates application in REMS

        :param id = id fetched from get_catalogue_item_id()
        """
        log.info('Create REMS application for catalogue item with id: {0}'.format(id))
        method = 'POST'
        url = self.REMS_CREATE_APPLICATION
        err_message = 'Failed to create application'
        json = {'catalogue-item-ids': [id]}
        return self.rems_request(method, url, err_message, json)

    def get_catalogue_item_id(self, resource):
        """
        return catalogue item id from REMS
        """
        log.info('Get catalog item id for resource: {0}'.format(resource))
        method = 'GET'
        url = self.REMS_CATALOGUE_ITEMS.format(resource)
        err_message = 'Failed to get catalogue item data from Fairdata REMS for resource: {0}'.format(resource)
        return self.rems_request(method, url, err_message)

    def create_user(self, userdata):
        """
        Create user in REMS
        """
        log.info('Create user in REMS')
        method = 'POST'
        url = self.REMS_CREATE_USER
        err_message = 'Failed to create user to REMS'
        json = userdata
        return self.rems_request(method, url, err_message, json)

    def entitlements(self):
        """
        Get all approved catalog records.
        :param user_id:
        :return:
        """
        log.info('Get all approved catalog records')
        method = 'GET'
        url = self.REMS_ENTITLEMENTS
        err_message = 'Failed to get entitlement data from Fairdata REMS for user_id: {0}'.format(self.USER_ID)
        return self.rems_request(method, url, err_message)

    def get_rems_permission(self, rems_resource):
        """
        Get user entitlement for a rems resource.

        :param rems_resource:
        :return:
        """
        assert rems_resource, 'rems_resource should be string, rems_resource: {0}'.format(rems_resource)

        log.info('Get entitlements for resource: {0}'.format(rems_resource))
        method = 'GET'
        url = self.REMS_URL.format(rems_resource)
        err_message = 'Failed to get entitlement data from Fairdata REMS for user_id: {0}, resource: {1}'.format(self.USER_ID, rems_resource)
        return len(self.rems_request(method, url, err_message)) > 0

def create_new_application(api, resource):
    """
    Get catalogue item id and feed it into creating new application
    :return:
    """

    catalogue_item_id = api.get_catalogue_item_id(resource)
    new_application = api.create_application(catalogue_item_id[0]["id"])

    return new_application

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
        _rems_api = RemsAPIService(app, user_id)
        return _rems_api.get_rems_permission(pref_id)
    log.warning('Invalid catalog record or not a REMS catalog record. cr_id: {0}'.format(cr_id))
    return False
