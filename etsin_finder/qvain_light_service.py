# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Qvain Light"""

import requests
from flask import jsonify

from etsin_finder.finder import app
from etsin_finder.app_config import get_metax_qvain_api_config
from etsin_finder.utils import json_or_empty, FlaskService
import json

log = app.logger

class MetaxQvainLightAPIService(FlaskService):
    """Metax API Service"""

    def __init__(self, app):
        """Init Metax API Service."""
        super().__init__(app)

        metax_qvain_api_config = get_metax_qvain_api_config(app.testing)

        if metax_qvain_api_config:

            self.METAX_GET_DIRECTORY_FOR_PROJECT_URL = 'https://{0}/rest/directories'.format(metax_qvain_api_config.get('HOST')) + \
                                                       '/files?project={0}&path=%2F'
            self.METAX_GET_DIRECTORY = 'https://{0}/rest/directories'.format(metax_qvain_api_config.get('HOST')) + \
                                       '/{0}/files'
            self.METAX_GET_FILE = 'https://{0}/rest/files'.format(metax_qvain_api_config.get('HOST')) + \
                                  '/{0}'
            self.METAX_GET_DATASET = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                                     '/{0}?file_details'
            self.METAX_GET_DATASETS_FOR_USER = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST')) + \
                                               '?metadata_provider_user={0}&file_details&ordering=-date_created'
            self.METAX_GET_ALL_DATASETS_FOR_USER = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST')) + \
                '?metadata_provider_user={0}&file_details&ordering=-date_created&no_pagination=true'
            self.METAX_CREATE_DATASET = 'https://{0}/rest/datasets?file_details'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_PATCH_DATASET = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                                       '/{0}?file_details'
            self.METAX_DELETE_DATASET = 'https://{0}/rest/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                                        '/{0}'
            self.METAX_CHANGE_CUMULATIVE_STATE = 'https://{0}/rpc/datasets/change_cumulative_state'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_REFRESH_DIRECTORY_CONTENT = 'https://{0}/rpc/datasets/refresh_directory_content'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_FIX_DEPRECATED = 'https://{0}/rpc/datasets/fix_deprecated'.format(metax_qvain_api_config.get('HOST'))
            self.user = metax_qvain_api_config.get('USER')
            self.pw = metax_qvain_api_config.get('PASSWORD')
            self.verify_ssl = metax_qvain_api_config.get('VERIFY_SSL', True)
        elif not self.is_testing:
            log.error("Unable to initialize MetaxAPIService due to missing config")

    def get_directory_for_project(self, project_identifier, params=None):
        """Get directory contents for a specific project

        Args:
            project_identifier (str): Project identifier.

        Returns:
            Metax response

        """
        req_url = self.METAX_GET_DIRECTORY_FOR_PROJECT_URL.format(project_identifier)

        try:
            metax_qvain_api_response = requests.get(req_url,
                                                    headers={'Accept': 'application/json'},
                                                    params=params,
                                                    auth=(self.user, self.pw),
                                                    verify=self.verify_ssl,
                                                    timeout=10)
            metax_qvain_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to get data for project \"{0}\" from Metax API\nResponse status code: {1}\nResponse text: {2}".format(
                        project_identifier,
                        metax_qvain_api_response.status_code,
                        json_or_empty(metax_qvain_api_response) or metax_qvain_api_response.text
                    ))
            else:
                log.error("Failed to get data for project \"{0}\" from Metax API\n{1}".
                          format(project_identifier, e))
            return None

        return metax_qvain_api_response.json()

    def get_directory(self, dir_identifier, params=None):
        """Get a specific directory with directory's id

        Args:
            dir_identifier (str): Directory identifier.
            params (dict, optional): Query parameters. Defaults to None.

        Returns:
            Metax response

        """
        req_url = self.METAX_GET_DIRECTORY.format(dir_identifier)

        try:
            metax_qvain_api_response = requests.get(req_url,
                                                    params=params,
                                                    headers={'Accept': 'application/json'},
                                                    auth=(self.user, self.pw),
                                                    verify=self.verify_ssl,
                                                    timeout=10)
            metax_qvain_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to get data for directory \"{0}\" from Metax API\nResponse status code: {1}\nResponse text: {2}".format(
                        dir_identifier,
                        metax_qvain_api_response.status_code,
                        json_or_empty(metax_qvain_api_response) or metax_qvain_api_response.text
                    ))
            else:
                log.error("Failed to get data for directory \"{0}\" from Metax API\n{1}".
                          format(dir_identifier, e))
            return None

        return metax_qvain_api_response.json()

    def get_file(self, file_identifier):
        """Get a specific file with file's id

        Args:
            file_identifier (str): File identifier.

        Returns:
            Metax response

        """
        req_url = self.METAX_GET_FILE.format(file_identifier)

        try:
            metax_qvain_api_response = requests.get(req_url,
                                                    headers={'Accept': 'application/json'},
                                                    auth=(self.user, self.pw),
                                                    verify=self.verify_ssl,
                                                    timeout=10)
            metax_qvain_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to get data for file \"{0}\" from Metax API\nResponse status code: {1}\nResponse text: {2}".format(
                        file_identifier,
                        metax_qvain_api_response.status_code,
                        json_or_empty(metax_qvain_api_response) or metax_qvain_api_response.text
                    ))
            else:
                log.error("Failed to get data for file \"{0}\" from Metax API\n{1}".
                          format(file_identifier, e))
            return None

        return metax_qvain_api_response.json()

    def patch_file(self, file_identifier, data):
        """Patch metadata for a file with given data.

        Useful for updating file_characteristics. Can be also used to change other fields
        such as identifier, so be careful when passing user input to avoid data corruption.

        Arguments:
            file_identifier (str): The identifier of the file.
            data (dict): Dictionary of fields that will be replaced in file metadata, other fields directly under the file will be
                preserved. For example, data = { 'file_characteristics': { 'csv_has_header': True } } would enable
                file_characteristics.csv_has_header and remove any other fields nested under file_characteristics.

        Returns:
            The response from Metax.

        """
        req_url = self.METAX_GET_FILE.format(file_identifier)

        try:
            metax_qvain_api_response = requests.patch(req_url,
                                                      headers={'Accept': 'application/json', 'Content-Type': 'application/json'},
                                                      data=json.dumps(data),
                                                      auth=(self.user, self.pw),
                                                      verify=self.verify_ssl,
                                                      timeout=10)
            metax_qvain_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to patch file \"{0}\" from Metax API\nResponse status code: {1}\nResponse text: {2}".format(
                        file_identifier,
                        metax_qvain_api_response.status_code,
                        json_or_empty(metax_qvain_api_response) or metax_qvain_api_response.text
                    ))
            else:
                log.error("Failed to patch file \"{0}\" from Metax API\n{1}".
                          format(file_identifier, e))
            return (json_or_empty(metax_qvain_api_response) or metax_qvain_api_response.text), metax_qvain_api_response.status_code

        return metax_qvain_api_response.json()

    def get_datasets_for_user(self, user_id, limit, offset, no_pagination):
        """Get datasets created by the specified user.

        Uses pagination, so offset and limit are used as well.

        Args:
            user_id (str): User identifier.
            limit (list): The limit of returned datasets.
            offset (list): The offset for pagination.
            no_pagination (bool): To use pagination or not.

        Returns:
            Metax response.

        """
        req_url = self.METAX_GET_DATASETS_FOR_USER.format(user_id)
        if (no_pagination):
            req_url = self.METAX_GET_ALL_DATASETS_FOR_USER.format(user_id)

        if (limit):
            req_url = req_url + "&limit={0}".format(limit[0])
        if (offset):
            req_url = req_url + "&offset={}".format(offset[0])

        try:
            metax_api_response = requests.get(req_url,
                                              headers={'Accept': 'application/json'},
                                              auth=(self.user, self.pw),
                                              verify=self.verify_ssl,
                                              timeout=10)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to get datasets for user \"{0}\" from Metax API\nResponse status code: {1}\nResponse text: {2}".format(
                        user_id,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
            else:
                log.error("Failed to get datasets for user \"{0}\" from Metax API \n{1}".
                          format(user_id, e))
            return None

        if (len(metax_api_response.json()) == 0):
            log.info('No datasets found.')
            return 'no datasets'

        return metax_api_response.json()

    def create_dataset(self, data, params=None, use_doi=False):
        """Send the data from the frontend to Metax.

        Arguments:
            data (object): Object with the dataset data that has been validated and converted to comply with the Metax schema.
            params (dict): Dictionary of key-value pairs of query parameters.

        Returns:
            The response from Metax.

        """
        req_url = self.METAX_CREATE_DATASET
        if use_doi is True:
            req_url += '&pid_type=doi'
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.post(req_url,
                                               params=params,
                                               json=data,
                                               headers=headers,
                                               auth=(self.user, self.pw),
                                               verify=self.verify_ssl,
                                               timeout=30)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to create dataset.\nResponse status code: {0}\nResponse text: {1}".format(
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
                return metax_api_response.json(), metax_api_response.status_code
            else:
                log.error("Error creating dataset\n{0}".format(e))
            return {'Error_message': 'Error trying to send data to metax.'}, metax_api_response.status_code

        log.info('Created dataset with identifier: {}'.format(json.loads(metax_api_response.text).get('identifier', 'COULD-NOT-GET-IDENTIFIER')))
        return metax_api_response.json(), metax_api_response.status_code

    def update_dataset(self, data, cr_id, last_modified, params):
        """Update a dataset with the data that the user has entered in Qvain-light.

        Arguments:
            data (object): Object with the dataset data that has been validated and converted to comply with the Metax schema.
            cr_id (str): The identifier of the dataset.
            last_modified (str): HTTP datetime string (RFC2616)
            params (dict): Dictionary of key-value pairs of query parameters.

        Returns:
            The response from Metax.

        """
        req_url = self.METAX_PATCH_DATASET.format(cr_id)
        headers = {'Accept': 'application/json', 'If-Unmodified-Since': last_modified}
        log.debug('Request URL: {0}\nHeaders: {1}\nData: {2}'.format(req_url, headers, data))
        try:
            metax_api_response = requests.patch(req_url,
                                                params=params,
                                                json=data,
                                                headers=headers,
                                                auth=(self.user, self.pw),
                                                verify=self.verify_ssl,
                                                timeout=30)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to update dataset {0}.\nResponse status code: {1}\nResponse text: {2}".format(
                        cr_id,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
                return metax_api_response.json(), metax_api_response.status_code
            else:
                log.error("Error updating dataset {0}\n{1}"
                          .format(cr_id, e))
            return 'Error trying to send data to metax.', 500

        log.info('Updated dataset with identifier: {}'.format(cr_id))
        if metax_api_response.status_code == 412:
            return 'Resource has been modified since last publish', 412

        return metax_api_response.json(), metax_api_response.status_code

    def get_dataset(self, cr_id):
        """Get dataset.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = self.METAX_GET_DATASET.format(cr_id)
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.get(req_url,
                                              headers=headers,
                                              auth=(self.user, self.pw),
                                              verify=self.verify_ssl,
                                              timeout=10)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to get dataset {0}\nResponse status code: {1}\nResponse text: {2}".format(
                        cr_id,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
            else:
                log.error("Error getting dataset {0}\n{1}".format(cr_id, e))
            return {'Error_message': 'Error getting data from Metax.'}, metax_api_response.status_code
        return json_or_empty(metax_api_response), metax_api_response.status_code

    def delete_dataset(self, cr_id):
        """Delete dataset from Metax.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = self.METAX_DELETE_DATASET.format(cr_id)
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.delete(req_url,
                                                 headers=headers,
                                                 auth=(self.user, self.pw),
                                                 verify=self.verify_ssl,
                                                 timeout=10)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to delete dataset {0}\nResponse status code: {1}\nResponse text: {2}".format(
                        cr_id,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
            else:
                log.error("Error deleting dataset {0}\n{1}".format(cr_id, e))
            return {'Error_message': 'Error trying to send data to metax.'}, metax_api_response.status_code
        log.info('Deleted dataset with identifier: {}'.format(cr_id))
        return json_or_empty(metax_api_response), metax_api_response.status_code

    def change_cumulative_state(self, cr_id, cumulative_state):
        """Call Metax change_cumulative_state RPC.

        Arguments:
            cr_id (str): The identifier of the dataset.
            cumulative_state (int): New cumulative state.

        Returns:
            Metax response.

        """
        req_url = self.METAX_CHANGE_CUMULATIVE_STATE
        params = {
            "identifier": cr_id,
            "cumulative_state": cumulative_state
        }
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.post( req_url,
                                                headers=headers,
                                                auth=(self.user, self.pw),
                                                verify=self.verify_ssl,
                                                params=params,
                                                timeout=10)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to change cumulative state of dataset {0}\nResponse status code: {1}\nResponse text: {2}".format(
                        cr_id,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
            else:
                log.error("Error changing cumulative state of dataset {0}\n{1}".format(cr_id, e))
            return {'detail': 'Error trying to send data to metax.'}, 500
        log.info('Changed cumulative state of dataset {} to {}'.format(cr_id, cumulative_state))
        return (json_or_empty(metax_api_response) or metax_api_response.text), metax_api_response.status_code

    def refresh_directory_content(self, cr_identifier, dir_identifier):
        """Call Metax refresh_directory_content RPC.

        Arguments:
            cr_identifier (str): The identifier of the dataset.
            dir_identifier (int): The identifier of the directory.

        Returns:
            Metax response.

        """
        req_url = self.METAX_REFRESH_DIRECTORY_CONTENT
        params = {
            "cr_identifier": cr_identifier,
            "dir_identifier": dir_identifier
        }
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.post( req_url,
                                                headers=headers,
                                                auth=(self.user, self.pw),
                                                verify=self.verify_ssl,
                                                params=params,
                                                timeout=10)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to refresh dataset {0} directory {1}\nResponse status code: {2}\nResponse text: {3}".format(
                        cr_identifier,
                        dir_identifier,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
                return json_or_empty(metax_api_response) or metax_api_response.text, metax_api_response.status_code
            else:
                log.error("Error refreshing dataset {0} directory {1}\n{2}".format(cr_identifier, dir_identifier, e))
            return {'detail': 'Error trying to send data to metax.'}, 500
        log.info('Refreshed dataset {} directory {}'.format(cr_identifier, dir_identifier))
        return (json_or_empty(metax_api_response) or metax_api_response.text), metax_api_response.status_code

    def fix_deprecated_dataset(self, cr_identifier):
        """Call Metax fix_deprecated RPC.

        Arguments:
            cr_identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = self.METAX_FIX_DEPRECATED
        params = {
            "identifier": cr_identifier,
        }
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.post( req_url,
                                                headers=headers,
                                                auth=(self.user, self.pw),
                                                verify=self.verify_ssl,
                                                params=params,
                                                timeout=10)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.warning(
                    "Failed to fix deprecated dataset {0}\nResponse status code: {1}\nResponse text: {2}".format(
                        cr_identifier,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
                return json_or_empty(metax_api_response) or metax_api_response.text, metax_api_response.status_code
            else:
                log.error("Error fixing deprecated dataset {0} \n{1}".format(cr_identifier, e))
            return {'detail': 'Error trying to send data to metax.'}, 500
        log.info('Fixed deprecated dataset {}'.format(cr_identifier))
        return (json_or_empty(metax_api_response) or metax_api_response.text), metax_api_response.status_code

_metax_api = MetaxQvainLightAPIService(app)

def get_directory(dir_id, params=None):
    """Public function to get a specific directory with directory's id"""
    return _metax_api.get_directory(dir_id, params)

def get_directory_for_project(project_id, params=None):
    """Public function to get directory contents for a specific project"""
    return _metax_api.get_directory_for_project(project_id, params)

def get_file(file_identifier):
    """Public function to get a specific file with file's id"""
    return _metax_api.get_file(file_identifier)

def patch_file(file_identifier, data):
    """Public function to patch metadata for a file with given data."""
    return _metax_api.patch_file(file_identifier, data)

def get_datasets_for_user(user_id, limit, offset, no_pagination):
    """Public function to get datasets created by the specified user."""
    return _metax_api.get_datasets_for_user(user_id, limit, offset, no_pagination)

def create_dataset(form_data, params=None, use_doi=False):
    """Public function to Send the data from the frontend to Metax."""
    return _metax_api.create_dataset(form_data, params, use_doi)

def update_dataset(form_data, cr_id, last_modified, params=None):
    """Public function to Update a dataset with the data that the user has entered in Qvain-light."""
    return _metax_api.update_dataset(form_data, cr_id, last_modified, params)

def get_dataset(cr_id):
    """Public function to get dataset"""
    return _metax_api.get_dataset(cr_id)


def delete_dataset(cr_id):
    """Public function to delete dataset from Metax."""
    return _metax_api.delete_dataset(cr_id)

def change_cumulative_state(cr_id, cumulative_state):
    """Public function to change cumulative_state of a dataset in Metax."""
    return _metax_api.change_cumulative_state(cr_id, cumulative_state)

def refresh_directory_content(cr_identifier, dir_identifier):
    """Public function to call Metax refresh_directory_content RPC."""
    return _metax_api.refresh_directory_content(cr_identifier, dir_identifier)

def fix_deprecated_dataset(cr_id):
    """Public function to call Metax fix_deprecated RPC."""
    return _metax_api.fix_deprecated_dataset(cr_id)
