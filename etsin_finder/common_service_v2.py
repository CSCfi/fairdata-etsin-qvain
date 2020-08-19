# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Etsin and Qvain Light"""

import requests
from flask_restful import abort
from functools import wraps
import json
import inspect


from etsin_finder.finder import app
from etsin_finder.app_config import get_metax_qvain_api_config
from etsin_finder.utils import json_or_text, FlaskService, format_url

log = app.logger


def metax_request(error_msg=""):
    """
    Decorator for Metax requests with error handling.

    Use error_msg parameter to customize error logging. The function parameters are used as arguments for error_msg.format().
    Returns Metax response json/text and status code.

    Example usage:

    @metax_request(error_msg="Request failed with x={x}.")
    def make_request(x):
        return requests.get("https://www.example.com/"+x)

    :param error_msg:
    :return:
    """
    def decorator_metax_request(f):
        """
        Metax request decorator for error handling.

        :param f:
        :return:
        """
        @wraps(f)
        def func(*args, **kwargs):
            """
            Log requests.

            :param args:
            :param kwargs:
            :return:
            """
            metax_response = None
            try:
                metax_response = f(*args, **kwargs)
                metax_response.raise_for_status()
            except Exception as e:
                bound_args = inspect.signature(f).bind(*args, **kwargs)
                bound_args.apply_defaults()
                arguments = bound_args.arguments

                # list function arguments, or use them in error_msg if set
                if not error_msg:
                    msg = '\n' + '\n'.join(['{}={}'.format(k, v) for k, v in arguments.items() if k != 'self'])
                else:
                    msg = error_msg.format(**dict(arguments))
                log.error("{}\n{}".format(msg, e))

                if isinstance(e, requests.HTTPError):
                    log.warning(
                        msg + "\nResponse status code: {0}\nResponse text: {1}".format(
                            metax_response.status_code,
                            json_or_text(metax_response)
                        ))
                else:
                    log.error("{}\n{}".format(msg, e))
                    abort(e)
            return json_or_text(metax_response), metax_response.status_code
        return func
    return decorator_metax_request


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

    @metax_request(error_msg="Failed to get directory {dir_identifier}.")
    def get_directory(self, dir_identifier, params=None):
        """
        Get a specific directory with directory's id

        Arguments:
            dir_identifier {string} -- The identifier of the directory.
            params {dict} -- Dictionary of key-value pairs of query parameters.

        Returns
            [type] -- Metax response.

        """
        req_url = format_url(self.METAX_GET_DIRECTORY, dir_identifier)
        return requests.get(req_url,
                            params=params,
                            headers={'Accept': 'application/json'},
                            auth=(self.user, self.pw),
                            verify=self.verify_ssl,
                            timeout=10)

    @metax_request(error_msg="Failed to get directory contents for project {project_identifier}.")
    def get_directory_for_project(self, project_identifier, params=None):
        """
        Get directory contents for a specific project

        Arguments:
            project_identifier {string} -- The identifier of the project.
            params {dict} -- Dictionary of key-value pairs of query parameters.

        Returns
            [type] -- Metax response.

        """
        req_url = format_url(self.METAX_GET_DIRECTORY_FOR_PROJECT_URL, project_identifier)
        return requests.get(req_url,
                            headers={'Accept': 'application/json'},
                            params=params,
                            auth=(self.user, self.pw),
                            verify=self.verify_ssl,
                            timeout=10)

    @metax_request(error_msg="Failed to get projects for dataset {cr_id}.")
    def get_dataset_projects(self, cr_id):
        """
        Get dataset projects from Metax.

        Arguments:
            cr_id {string} -- The identifier of the dataset.

        Returns:
            [type] -- Metax response.

        """
        req_url = format_url(self.METAX_GET_DATASET_PROJECTS, cr_id)
        headers = {'Accept': 'application/json'}
        return requests.get(req_url,
                            headers=headers,
                            auth=(self.user, self.pw),
                            verify=self.verify_ssl,
                            timeout=10)

    @metax_request(error_msg="Failed to get user metadata for dataset {cr_id}.")
    def get_dataset_user_metadata(self, cr_id):
        """
        Get user-defined file metadata for dataset from Metax.

        Arguments:
            cr_id {string} -- The identifier of the dataset.

        Returns:
            [type] -- Metax response.

        """
        req_url = format_url(self.METAX_GET_DATASET_USER_METADATA, cr_id)
        headers = {'Accept': 'application/json'}
        return requests.get(req_url,
                            headers=headers,
                            auth=(self.user, self.pw),
                            verify=self.verify_ssl,
                            timeout=10)

    @metax_request(error_msg="Failed to update user metadata for dataset {cr_id}.")
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
        req_url = format_url(self.METAX_PUT_DATASET_USER_METADATA, cr_id)
        headers = {'Accept': 'application/json'}

        return requests.put(req_url,
                            headers=headers,
                            json=data,
                            auth=(self.user, self.pw),
                            verify=self.verify_ssl,
                            timeout=10)


_service = MetaxCommonAPIService(app)
get_directory = _service.get_directory
get_directory_for_project = _service.get_directory_for_project
get_dataset_projects = _service.get_dataset_projects
get_dataset_user_metadata = _service.get_dataset_user_metadata
update_dataset_user_metadata = _service.update_dataset_user_metadata