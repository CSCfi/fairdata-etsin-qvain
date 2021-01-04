# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Fairdata Rems"""

from requests import request, HTTPError
from flask import session, current_app
from datetime import datetime

from etsin_finder.services.cr_service import (
    get_catalog_record_preferred_identifier,
    get_catalog_record,
    is_rems_catalog_record
)
from etsin_finder.app_config import get_fairdata_rems_api_config
from etsin_finder.utils.utils import json_or_empty, FlaskService, format_url
from etsin_finder.log import log


class RemsAPIService(FlaskService):
    """Rems Service"""

    def __init__(self, app, user):
        """Setup Rems API Service"""
        super().__init__(app)

        rems_api_config = get_fairdata_rems_api_config(app)

        if rems_api_config:
            self.ENABLED = rems_api_config.get('ENABLED', False)
            self.USER_ID = user
            self.API_KEY = str(rems_api_config.get('API_KEY'))
            self.HOST = rems_api_config.get('HOST')
            self.HEADERS = {
                'Accept': 'application/json',
                'x-rems-api-key': self.API_KEY,
                'x-rems-user-id': 'RDowner@funet.fi'
            }
            self.REMS_URL = 'https://{0}'.format(self.HOST) + '/api/entitlements?resource={0}'
            self.REMS_ENTITLEMENTS = 'https://{0}'.format(self.HOST) + '/api/entitlements'
            self.REMS_CREATE_USER = 'https://{0}'.format(self.HOST) + '/api/users/create'
            self.REMS_GET_MY_APPLICATIONS = 'https://{0}'.format(self.HOST) + '/api/my-applications/'
            self.REMS_CATALOGUE_ITEMS = 'https://{0}'.format(self.HOST) + '/api/catalogue-items?resource={0}'
            self.REMS_CREATE_APPLICATION = 'https://{0}'.format(self.HOST) + '/api/applications/create'
            self.proxies = None
            if rems_api_config.get('HTTPS_PROXY'):
                self.proxies = dict(https=rems_api_config.get('HTTPS_PROXY'))
        elif self.is_testing:
            self.ENABLED = False
        else:
            self.ENABLED = False

    def rems_request(self, method, url, err_message, json=None, user_id='RDowner@funet.fi'):
        """Genaral method for sending requests to REMS

        Arguments:
            method (str): The http verb, GET or POST
            url (str): The url for the request
            err_message (str): An error message to log if something goes wrong

        Keyword Arguments:
            json (dict): Data to be sent in a POST requests body (default: {None})
            user_id (str): The user id if needed (default: {'RDowner@funet.fi'})

        Returns:
            tuple: Message for the response as first argument, and status code as second.

        """
        if not self.ENABLED:
            return False

        self.HEADERS['x-rems-user-id'] = user_id
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

    def get_user_applications(self):
        """Get all applications which the current user can see

        Returns:
            list: List of application dicts

        """
        if not self.ENABLED:
            return False

        log.info('Get all applications for current user')
        method = 'GET'
        url = self.REMS_GET_MY_APPLICATIONS
        err_message = 'Failed to get applications from Fairdata REMS'
        return self.rems_request(method, url, err_message, user_id=self.USER_ID)

    def create_application(self, id):
        """Creates application in REMS

        Arguments:
            id (int): Catalogue item id

        Returns:
            dict: Dict with info if the operation was successful

        """
        if not self.ENABLED:
            return False

        assert isinstance(id, int), 'id should be integer, id: {0}'.format(id)

        log.info('Create REMS application for catalogue item with id: {0}'.format(id))
        method = 'POST'
        url = self.REMS_CREATE_APPLICATION
        err_message = 'Failed to create application'
        json = {'catalogue-item-ids': [id]}
        return self.rems_request(method, url, err_message, json=json, user_id=self.USER_ID)

    def get_catalogue_item_for_resource(self, resource):
        """Get catalogue item for resource from REMS

        Arguments:
            resource (str): The preferred identifier of the resource

        Returns:
            list: List containing dict of catalogue item

        """
        if not self.ENABLED:
            return False

        assert isinstance(resource, str), 'resource should be string, resource: {0}'.format(resource)

        log.info('Get catalog item for resource: {0}'.format(resource))
        method = 'GET'
        url = format_url(self.REMS_CATALOGUE_ITEMS, resource)
        err_message = 'Failed to get catalogue item data from Fairdata REMS for resource: {0}'.format(resource)
        return self.rems_request(method, url, err_message)

    def create_user(self, userdata):
        """Create user in REMS

        Arguments:
            userdata (dict): Dict with name, user_id and email.

        Returns:
            dict: Information if the creation succeeded.

        """
        if not self.ENABLED:
            return False

        assert isinstance(userdata, dict) and userdata.keys() >= {'userid', 'name', 'email'}, \
            'usedata should be a dict containing userid, name and email.'
        log.info('Create user in REMS')
        method = 'POST'
        url = self.REMS_CREATE_USER
        err_message = 'Failed to create user to REMS'
        json = userdata
        return self.rems_request(method, url, err_message, json=json)

    def entitlements(self):
        """Get all approved catalog records.

        Returns:
            (list): List of dicts with entitlements.

        """
        if not self.ENABLED:
            return False

        log.info('Get all approved catalog records')
        method = 'GET'
        url = self.REMS_ENTITLEMENTS
        err_message = 'Failed to get entitlement data from Fairdata REMS for user_id: {0}'.format(self.USER_ID)
        return self.rems_request(method, url, err_message)

    def get_rems_permission(self, rems_resource):
        """Check if user is entitled for a REMS resource.

        Arguments:
            rems_resource (str): The resource

        Returns:
            bool: True/False if user is entitled.

        """
        if not self.ENABLED:
            return False

        assert rems_resource, 'rems_resource should be string, rems_resource: {0}'.format(rems_resource)

        log.info('Get entitlements for resource: {0}'.format(rems_resource))
        method = 'GET'
        url = format_url(self.REMS_URL, rems_resource)
        err_message = 'Failed to get entitlement data from Fairdata REMS for user_id: {0}, resource: {1}'.format(self.USER_ID, rems_resource)
        return len(self.rems_request(method, url, err_message)) > 0


def get_application_state_for_resource(cr, user_id):
    """Get the state of the users applications for resource.

    Arguments:
        cr (dict): Catalog record
        user_id (str): The user id

    Returns:
        str: The application state or False.

    """
    _rems_api = RemsAPIService(current_app, user_id)
    if _rems_api.ENABLED:
        state = 'apply'
    else:
        return 'disabled'
    if not user_id or not cr:
        log.error('Failed to get user application state')
        return False

    pref_id = get_catalog_record_preferred_identifier(cr)
    if not pref_id:
        log.error('Could not get preferred identifier.')
        return False

    user_applications = _rems_api.get_user_applications()
    if not isinstance(user_applications, list) or not user_applications:
        log.warning('Could not get any applications belonging to user.')
        return False
    log.info('Got {0} applications for the user.'.format(len(user_applications)))

    # Sort applications to get the newest first
    user_applications.sort(reverse=True, key=lambda x: datetime.strptime(x.get('application/last-activity'), '%Y-%m-%dT%H:%M:%S.%fZ'))

    for application in user_applications:
        resources = application.get('application/resources')
        for resource in resources:
            if resource.get('resource/ext-id') == pref_id:
                state = application.get('application/state').split('/')[1]
                # Set the application id to the session so it can be used directly
                # by REMSApplyForPermission if the users has already created applications
                session['REMS_application_id'] = application.get('application/id')
                return state
    # Set the value to None if no application for the resource is found
    session['REMS_application_id'] = None
    return state


def get_user_rems_permission_for_catalog_record(cr_id, user_id):
    """Get info about whether user is entitled for a catalog record.

    Arguments:
        cr_id (str): The catalog record identifier.
        user_id (str): The user id.

    Returns:
        bool: Returns True/False if user is entitled.

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
        _rems_api = RemsAPIService(current_app, user_id)
        return _rems_api.get_rems_permission(pref_id)
    log.warning('Invalid catalog record or not a REMS catalog record. cr_id: {0}'.format(cr_id))
    return False
