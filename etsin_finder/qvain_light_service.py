# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Qvain Light"""

import requests

from etsin_finder.finder import app
from etsin_finder.app_config import get_metax_api_config
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

        metax_api_config = get_metax_api_config(app.testing)

        if metax_api_config:

            self.METAX_GET_DIRECTORY_FOR_PROJECT_URL = 'https://{0}/rest/directories'.format(metax_api_config['HOST']) + \
                                                       '/root?project={0}'
            self.METAX_GET_DIRECTORY = 'https://{0}/rest/directories'.format(metax_api_config['HOST']) + \
                                       '/{0}/files'
            self.METAX_GET_DATASETS_FOR_USER = 'https://{0}/rest/datasets'.format(metax_api_config['HOST']) + \
                                               '?metadata_provider_user={0}'

            self.user = metax_api_config['USER']
            self.pw = metax_api_config['PASSWORD']
            self.verify_ssl = metax_api_config.get('VERIFY_SSL', True)
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
            metax_api_response = requests.get(req_url,
                                              headers={'Accept': 'application/json'},
                                              auth=(self.user, self.pw),
                                              verify=self.verify_ssl,
                                              timeout=10)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.debug("Failed to get data for project {0} from Metax API".
                          format(project_identifier))
                log.debug('Response status code: {0}'.format(metax_api_response.status_code))
                log.debug('Response text: {0}'.format(json_or_empty(metax_api_response) or metax_api_response.text))
            else:
                log.error("Failed to get data for project {0} from Metax API".
                          format(project_identifier))
                log.error(e)
            return None

        return metax_api_response.json()

    def get_directory(self, dir_identifier):
        """
        Get a specific directory with directory's id

        :param dir_identifier:
        :return:
        """
        req_url = self.METAX_GET_DIRECTORY.format(dir_identifier)

        try:
            metax_api_response = requests.get(req_url,
                                              headers={'Accept': 'application/json'},
                                              auth=(self.user, self.pw),
                                              verify=self.verify_ssl,
                                              timeout=10)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.debug("Failed to get data for directory {0} from Metax API".
                          format(dir_identifier))
                log.debug('Response status code: {0}'.format(metax_api_response.status_code))
                log.debug('Response text: {0}'.format(json_or_empty(metax_api_response) or metax_api_response.text))
            else:
                log.error("Failed to get data for directory {0} from Metax API".
                          format(dir_identifier))
                log.error(e)
            return None

        return metax_api_response.json()


    def get_datasets_for_user(self, user_id):
        """
        Get datasets created by the specified user

        :param user_id:
        :return datasets:
        """
        req_url = self.METAX_GET_DATASETS_FOR_USER.format(user_id)

        try:
            metax_api_response = requests.get(req_url,
                                              headers={'Accept': 'application/json'},
                                              auth=(self.user, self.pw),
                                              verify=self.verify_ssl,
                                              timeout=10)
            metax_api_response.raise_for_status()
        except Exception as e:
            if isinstance(e, requests.HTTPError):
                log.debug("Failed to get data for directory {0} from Metax API".
                          format(dir_identifier))
                log.debug('Response status code: {0}'.format(metax_api_response.status_code))
                log.debug('Response text: {0}'.format(json_or_empty(metax_api_response) or metax_api_response.text))
            else:
                log.error("Failed to get data for directory {0} from Metax API".
                          format(dir_identifier))
                log.error(e)
            return None

        return metax_api_response.json()


_metax_api = MetaxQvainLightAPIService(app)

def get_directory(dir_id):
    return _metax_api.get_directory(dir_id)

def get_directory_for_project(project_id):
    return _metax_api.get_directory_for_project(project_id)

def get_datasets_for_user(user_id):
    return _metax_api.get_datasets_for_user(user_id)
