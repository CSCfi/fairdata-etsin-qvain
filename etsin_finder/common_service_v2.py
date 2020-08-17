# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Etsin and Qvain Light"""

import requests
import json

from etsin_finder.finder import app
from etsin_finder.app_config import get_metax_qvain_api_config
from etsin_finder.utils import json_or_text, FlaskService
from etsin_finder.request_utils import make_request

log = app.logger


class MetaxCommonAPIService(FlaskService):
    """Service for Metax API v2 requests used by both Etsin and Qvain Light."""

    def __init__(self, app):
        """
        Init Metax API Service.

        :param metax_api_config:
        """
        super().__init__(app)

        metax_qvain_api_config = get_metax_qvain_api_config(app.testing)

        if metax_qvain_api_config:
            self.METAX_GET_DIRECTORY_FOR_PROJECT_URL = 'https://{0}/rest/v2/directories'.format(metax_qvain_api_config['HOST']) + \
                                                       '/files?project={0}&path=%2F&include_parent'
            self.METAX_GET_DIRECTORY = 'https://{0}/rest/v2/directories'.format(metax_qvain_api_config['HOST']) + \
                                       '/{0}/files'
            self.METAX_GET_DATASET_USER_METADATA = 'https://{0}/rest/v2/datasets'.format(metax_qvain_api_config['HOST'], ) + \
                '/{0}/files/user_metadata'
            self.METAX_PUT_DATASET_USER_METADATA = self.METAX_GET_DATASET_USER_METADATA
            self.METAX_GET_DATASET_PROJECTS = 'https://{0}/rest/v2/datasets'.format(metax_qvain_api_config['HOST'], ) + \
                '/{0}/projects'
            self.user = metax_qvain_api_config['USER']
            self.pw = metax_qvain_api_config['PASSWORD']
            self.verify_ssl = metax_qvain_api_config.get('VERIFY_SSL', True)
        elif not self.is_testing:
            log.error("Unable to initialize MetaxCommonAPIService due to missing config")

    def get_directory(self, dir_identifier, params=None):
        """
        Get a specific directory with directory's id

        Arguments:
            dir_identifier {string} -- The identifier of the directory.
            params {dict} -- Dictionary of key-value pairs of query parameters.

        Returns
            [type] -- Metax response.

        """
        req_url = self.METAX_GET_DIRECTORY.format(dir_identifier)
        resp, status, success = make_request(requests.get,
                                             req_url,
                                             params=params,
                                             headers={'Accept': 'application/json'},
                                             auth=(self.user, self.pw),
                                             verify=self.verify_ssl,
                                             timeout=10)
        if not success:
            log.warning("Failed to get directory {}".format(dir_identifier))
            return resp, status
        return resp, status

    def get_directory_for_project(self, project_identifier, params=None):
        """
        Get directory contents for a specific project

        Arguments:
            project_identifier {string} -- The identifier of the project.
            params {dict} -- Dictionary of key-value pairs of query parameters.

        Returns
            [type] -- Metax response.

        """
        req_url = self.METAX_GET_DIRECTORY_FOR_PROJECT_URL.format(project_identifier)
        resp, status, success = make_request(requests.get,
                                             req_url,
                                             headers={'Accept': 'application/json'},
                                             params=params,
                                             auth=(self.user, self.pw),
                                             verify=self.verify_ssl,
                                             timeout=10)
        if not success:
            log.warning("Failed to get directory contents for project {}".format(project_identifier))
        return resp, status

    def get_dataset_projects(self, cr_id):
        """
        Get dataset projects from Metax.

        Arguments:
            cr_id {string} -- The identifier of the dataset.

        Returns:
            [type] -- Metax response.

        """
        req_url = self.METAX_GET_DATASET_PROJECTS.format(cr_id)
        resp, status, success = make_request(requests.get,
                                             req_url,
                                             headers={'Accept': 'application/json'},
                                             auth=(self.user, self.pw),
                                             verify=self.verify_ssl,
                                             timeout=10)
        if not success:
            log.warning("Failed to get projects for dataset {}".format(cr_id))
        return resp, status

    def get_dataset_user_metadata(self, cr_id):
        """
        Get user-defined file metadata for dataset from Metax.

        Arguments:
            cr_id {string} -- The identifier of the dataset.

        Returns:
            [type] -- Metax response.

        """
        req_url = self.METAX_GET_DATASET_USER_METADATA.format(cr_id)
        resp, status, success = make_request(requests.get,
                                             req_url,
                                             headers={'Accept': 'application/json'},
                                             auth=(self.user, self.pw),
                                             verify=self.verify_ssl,
                                             timeout=10)
        if not success:
            log.warning("Failed to get user metadata for dataset {}".format(cr_id))
        return resp, status

    def update_dataset_user_metadata(self, cr_id, data):
        """
        Update user-defined file metadata for dataset from Metax.

        The data directory should contain arrays of dictionaries containing metadata in the following format:
        data = {
            directories: [{ identifier: x, ...metadata }, ...],
            files: [...]
        }
        The existing user metadata in the listed directories and files will be replaced with the new values.
        To remove metadata, set delete = true for a directory or file.

        Arguments:
            cr_id {string} -- The identifier of the dataset.
            data -- Dictionary of file/directory metadata updates,

        Returns:
            [type] -- Metax response.

        """
        req_url = self.METAX_PUT_DATASET_USER_METADATA.format(cr_id)
        headers = {'Accept': 'application/json'}

        resp, status, success = make_request(requests.put,
                                             req_url,
                                             headers=headers,
                                             json=data,
                                             auth=(self.user, self.pw),
                                             verify=self.verify_ssl,
                                             timeout=10)
        if not success:
            log.warning("Failed to update user metadata for dataset {}".format(cr_id))
        return resp, status


_service = MetaxCommonAPIService(app)
get_directory = _service.get_directory
get_directory_for_project = _service.get_directory_for_project
get_dataset_projects = _service.get_dataset_projects
get_dataset_user_metadata = _service.get_dataset_user_metadata
update_dataset_user_metadata = _service.update_dataset_user_metadata
