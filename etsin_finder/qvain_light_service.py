# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Qvain Light"""

import requests

from etsin_finder.finder import app
from etsin_finder.app_config import get_metax_qvain_api_config
from etsin_finder.utils import json_or_empty, FlaskService

log = app.logger

class MetaxQvainLightAPIService(FlaskService):
    """Metax API Service"""

    def __init__(self, app):
        """
        Init Metax API Service.

        :param metax_api_config:
        """
        super().__init__(app)

        metax_qvain_api_config = get_metax_qvain_api_config(app.testing)

        if metax_qvain_api_config:

            self.METAX_GET_DIRECTORY_FOR_PROJECT_URL = 'https://{0}/rest/directories'.format(metax_qvain_api_config['HOST']) + \
                                                       '/root?project={0}'
            self.METAX_GET_DIRECTORY = 'https://{0}/rest/directories'.format(metax_qvain_api_config['HOST']) + \
                                       '/{0}/files'
            self.METAX_GET_DATASETS_FOR_USER = 'https://{0}/rest/datasets'.format(metax_qvain_api_config['HOST']) + \
                                               '?metadata_provider_user={0}&file_details&ordering=-date_modified'
            self.METAX_CREATE_DATASET = 'https://{0}/rest/datasets'.format(metax_qvain_api_config['HOST'])
            self.user = metax_qvain_api_config['USER']
            self.pw = metax_qvain_api_config['PASSWORD']
            self.verify_ssl = metax_qvain_api_config.get('VERIFY_SSL', True)
        elif not self.is_testing:
            log.error("Unable to initialize MetaxAPIService due to missing config")

    def get_directory_for_project(self, project_identifier):
        """
        Get directory contents for a specific project

        :param project_identifier:
        :return:
        """
        req_url = self.METAX_GET_DIRECTORY_FOR_PROJECT_URL.format(project_identifier)

        try:
            metax_qvain_api_response = requests.get(req_url,
                                                    headers={'Accept': 'application/json'},
                                                    auth=(self.user, self.pw),
                                                    verify=self.verify_ssl,
                                                    timeout=10)
            metax_qvain_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.debug("Failed to get data for project {0} from Metax API".
                          format(project_identifier))
                log.debug('Response status code: {0}'.format(metax_qvain_api_response.status_code))
                log.debug('Response text: {0}'.format(json_or_empty(metax_qvain_api_response) or metax_qvain_api_response.text))
            else:
                log.error("Failed to get data for project {0} from Metax API".
                          format(project_identifier))
                log.error(e)
            return None

        return metax_qvain_api_response.json()

    def get_directory(self, dir_identifier):
        """
        Get a specific directory with directory's id

        :param dir_identifier:
        :return:
        """
        req_url = self.METAX_GET_DIRECTORY.format(dir_identifier)

        try:
            metax_qvain_api_response = requests.get(req_url,
                                                    headers={'Accept': 'application/json'},
                                                    auth=(self.user, self.pw),
                                                    verify=self.verify_ssl,
                                                    timeout=10)
            metax_qvain_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.debug("Failed to get data for directory {0} from Metax API".
                          format(dir_identifier))
                log.debug('Response status code: {0}'.format(metax_qvain_api_response.status_code))
                log.debug('Response text: {0}'.format(json_or_empty(metax_qvain_api_response) or metax_qvain_api_response.text))
            else:
                log.error("Failed to get data for directory {0} from Metax API".
                          format(dir_identifier))
                log.error(e)
            return None

        return metax_qvain_api_response.json()

    def get_datasets_for_user(self, user_id, limit, offset):
        """
        Get datasets created by the specified user. Uses pagination, so offset and limit are used as well.

        :param user_id:
        :return datasets:
        """
        req_url = self.METAX_GET_DATASETS_FOR_USER.format(user_id)

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
                log.debug("Failed to get datasets for user {0} from Metax API".
                          format(user_id))
                log.debug('Response status code: {0}'.format(metax_api_response.status_code))
                log.debug('Response text: {0}'.format(json_or_empty(metax_api_response) or metax_api_response.text))
            else:
                log.debug("Failed to get datasets for user {0} from Metax API".
                          format(user_id))
                log.error(e)
            return None

        return metax_api_response.json()

    def create_dataset(self, data):
        """
        Send the data from the frontend to Metax.

        Arguments:
            data {object} -- Object with the dataset data that has been validated and converted to comply with the Metax schema.

        Returns:
            [type] -- The response from Metax.

        """
        req_url = self.METAX_CREATE_DATASET
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.post(req_url,
                                               json=data,
                                               headers=headers,
                                               auth=(self.user, self.pw),
                                               verify=self.verify_ssl,
                                               timeout=10)
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.debug("Failed to create dataset.")
                log.debug('Response status code: {0}'.format(metax_api_response.status_code))
                log.debug('Response text: {0}'.format(json_or_empty(metax_api_response) or metax_api_response.text))
            else:
                log.error("Failed to get data for directory {0} from Metax API")
                log.error(e)
            return {'Error_message': 'Error trying to send data to metax.'}

        return metax_api_response.json()

    def update_dataset(self, data, cr_id):
        """
        Update a dataset with the datat that the user has entered in Qvain-light.

        Arguments:
            data {object} -- Object with the dataset data that has been validated and converted to comply with the Metax schema.
            cr_id {string} -- The identifier of the dataset.

        Returns:
            [type] -- The response from Metax.

        """
        req_url = self.METAX_CREATE_DATASET + "/" + cr_id
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.patch(req_url,
                                                json=data,
                                                headers=headers,
                                                auth=(self.user, self.pw),
                                                verify=self.verify_ssl,
                                                timeout=10)
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.debug("Failed to create dataset.")
                log.debug('Response status code: {0}'.format(metax_api_response.status_code))
                log.debug('Response text: {0}'.format(json_or_empty(metax_api_response) or metax_api_response.text))
            else:
                log.error("Failed to get data for directory {0} from Metax API")
                log.error(e)
            return {'Error_message': 'Error trying to send data to metax.'}
        return metax_api_response.json()

    def delete_dataset(self, cr_id):
        """
        Delete dataset from Metax.

        Arguments:
            cr_id {string} -- The identifier of the dataset.

        Returns:
            [type] -- Metax response.

        """
        req_url = self.METAX_CREATE_DATASET + "/" + cr_id
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.delete(req_url,
                                                 headers=headers,
                                                 auth=(self.user, self.pw),
                                                 verify=self.verify_ssl,
                                                 timeout=10)
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.debug("Failed to deletedataset.")
                log.debug('Response status code: {0}'.format(metax_api_response.status_code))
                log.debug('Response text: {0}'.format(json_or_empty(metax_api_response) or metax_api_response.text))
            return {'Error_message': 'Error trying to send data to metax.'}

        return metax_api_response.status_code


_metax_api = MetaxQvainLightAPIService(app)

def get_directory(dir_id):
    """
    Get directory from metax.

    :param dir_id:
    :return:
    """
    return _metax_api.get_directory(dir_id)

def get_directory_for_project(project_id):
    """
    Get project root file directory from metax.

    :param project_id:
    :return:
    """
    return _metax_api.get_directory_for_project(project_id)

def get_datasets_for_user(user_id, limit, offset):
    """
    Get datasets for user

    :param user_id, limit:
    :return:
    """
    return _metax_api.get_datasets_for_user(user_id, limit, offset)

def create_dataset(form_data):
    """
    Create dataset in Metax.

    Arguments:
        form_data {object} -- Object with the dataset data that has been validated and converted to comply with the Metax schema.

    Returns:
        [type] -- Metax response.

    """
    return _metax_api.create_dataset(form_data)

def update_dataset(form_data, cr_id):
    """
    Update dataset in Metax.

    Arguments:
        form_data {object} -- Object with the dataset data that has been validated and converted to comply with the Metax schema.
        cr_id {string} -- The identifier of the dataset.

    Returns:
        [type] -- Metax response.

    """
    return _metax_api.update_dataset(form_data, cr_id)

def delete_dataset(cr_id):
    """
    Delete dataset from Metax.

    Arguments:
        cr_id {string} -- The identifier of the dataset.

    Returns:
        [type] -- Metax response.

    """
    return _metax_api.delete_dataset(cr_id)
