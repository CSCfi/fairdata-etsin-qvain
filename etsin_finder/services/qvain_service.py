# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Qvain"""

import requests
import marshmallow
from flask import current_app

from etsin_finder.log import log

from etsin_finder.utils.utils import format_url
from etsin_finder.utils.request_utils import make_request
from etsin_finder.schemas.services import MetaxServiceConfigurationSchema
from .base_service import BaseService, ConfigValidationMixin


class MetaxQvainAPIService(BaseService, ConfigValidationMixin):
    """Metax API Service"""

    schema = MetaxServiceConfigurationSchema(unknown=marshmallow.RAISE)

    @property
    def config(self):
        """Get service configuration"""
        return current_app.config.get('METAX_QVAIN_API', None)

    @property
    def proxies(self):
        """Get service proxy configuration"""
        if self.config.get('HTTPS_PROXY'):
            return dict(https=self.config.get('HTTPS_PROXY'))
        return None

    def metax_url(self, url):
        """Return a Metax API URL"""
        return f'https://{self._HOST}{url}'

    @property
    def _HOST(self):
        return self.config.get('HOST')

    @property
    def _USER(self):
        return self.config.get('USER')

    @property
    def _PASSWORD(self):
        return self.config.get('PASSWORD')

    @property
    def _VERIFY_SSL(self):
        return self.config.get('VERIFY_SSL', True)

    @property
    def _METAX_GET_DIRECTORY_FOR_PROJECT_URL(self):
        return self.metax_url('/rest/directories') + \
            '/files?project={0}&path=%2F'

    @property
    def _METAX_GET_DIRECTORY(self):
        return self.metax_url('/rest/directories') + \
            '/{0}/files'

    @property
    def _METAX_GET_FILE(self):
        return self.metax_url('/rest/files') + \
            '/{0}'

    @property
    def _METAX_GET_DATASET(self):
        return self.metax_url('/rest/datasets') + \
            '/{0}?file_details'

    @property
    def _METAX_GET_DATASETS_FOR_USER(self):
        return self.metax_url('/rest/datasets') + \
            '?metadata_provider_user={0}&file_details&ordering=-date_created'

    @property
    def _METAX_GET_ALL_DATASETS_FOR_USER(self):
        return self.metax_url('/rest/datasets') + \
            '?metadata_provider_user={0}&file_details&ordering=-date_created&no_pagination=true'

    @property
    def _METAX_CREATE_DATASET(self):
        return self.metax_url('/rest/datasets?file_details')

    @property
    def _METAX_PATCH_DATASET(self):
        return self.metax_url('/rest/datasets') + \
            '/{0}?file_details'

    @property
    def _METAX_DELETE_DATASET(self):
        return self.metax_url('/rest/datasets') + \
            '/{0}'

    @property
    def _METAX_CHANGE_CUMULATIVE_STATE(self):
        return self.metax_url('/rpc/datasets/change_cumulative_state')

    @property
    def _METAX_REFRESH_DIRECTORY_CONTENT(self):
        return self.metax_url('/rpc/datasets/refresh_directory_content')

    @property
    def _METAX_FIX_DEPRECATED(self):
        return self.metax_url('/rpc/datasets/fix_deprecated')

    def _get_args(self, **kwargs):
        """Get default args for request, allow overriding with kwargs."""
        args = dict(headers={'Accept': 'application/json', 'Content-Type': 'application/json'},
                    auth=(self._USER, self._PASSWORD),
                    verify=self._VERIFY_SSL,
                    timeout=10,
                    proxies=self.proxies)
        args.update(kwargs)
        return args

    def get_directory_for_project(self, project_identifier, params=None):
        """Get directory contents for a specific project

        Args:
            project_identifier (str): Project identifier.

        Returns:
            Metax response

        """
        req_url = format_url(self._METAX_GET_DIRECTORY_FOR_PROJECT_URL, project_identifier)
        resp, _, success = make_request(requests.get,
                                        req_url,
                                        params=params,
                                        **self._get_args()
                                        )
        if not success:
            log.warning("Failed to get directory contents for project {}".format(project_identifier))
            return None
        return resp

    def get_directory(self, dir_identifier, params=None):
        """Get a specific directory with directory's id

        Args:
            dir_identifier (str): Directory identifier.
            params (dict, optional): Query parameters. Defaults to None.

        Returns:
            Metax response

        """
        req_url = format_url(self._METAX_GET_DIRECTORY, dir_identifier)
        resp, _, success = make_request(requests.get,
                                        req_url,
                                        params=params,
                                        **self._get_args())
        if not success:
            log.warning("Failed to get directory {}".format(dir_identifier))
            return None
        return resp

    def get_file(self, file_identifier):
        """Get a specific file with file's id

        Args:
            file_identifier (str): File identifier.

        Returns:
            Metax response

        """
        req_url = format_url(self._METAX_GET_FILE, file_identifier)
        resp, _, success = make_request(requests.get,
                                        req_url,
                                        **self._get_args()
                                        )
        if not success:
            log.warning("Failed to get file {}".format(file_identifier))
            return None
        return resp

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
        req_url = format_url(self._METAX_GET_FILE, file_identifier)
        resp, code, success = make_request(requests.patch,
                                           req_url,
                                           json=data,
                                           **self._get_args()
                                           )
        if not success:
            log.warning("Failed to patch file {}".format(file_identifier))
        return resp, code

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
        req_url = format_url(self._METAX_GET_DATASETS_FOR_USER, user_id)
        if (no_pagination):
            req_url = format_url(self._METAX_GET_ALL_DATASETS_FOR_USER, user_id)

        params = {}
        if (limit):
            params['limit'] = limit
        if (offset):
            params['offset'] = offset

        resp, _, success = make_request(requests.get,
                                        req_url,
                                        **self._get_args()
                                        )
        if not success or len(resp) == 0:
            log.info('No datasets found.')
            return 'no datasets'
        return resp

    def create_dataset(self, data, params=None, use_doi=False):
        """Send the data from the frontend to Metax.

        Arguments:
            data (object): Object with the dataset data that has been validated and converted to comply with the Metax schema.
            params (dict): Dictionary of key-value pairs of query parameters.

        Returns:
            The response from Metax.

        """
        if params is None:
            params = {}
        req_url = self._METAX_CREATE_DATASET
        if use_doi is True:
            params['pid_type'] = 'doi'
        args = self._get_args(timeout=30)
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             json=data,
                                             **args
                                             )
        if success:
            log.info('Created dataset with identifier: {}'.format(resp.get('identifier', 'COULD-NOT-GET-IDENTIFIER')))
        else:
            log.error('Failed to create dataset')
        return resp, status

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
        req_url = format_url(self._METAX_PATCH_DATASET, cr_id)
        headers = {'Accept': 'application/json', 'If-Unmodified-Since': last_modified}
        log.debug('Request URL: {0}\nHeaders: {1}\nData: {2}'.format(req_url, headers, data))

        args = self._get_args(
            timeout=30,
            headers={'Accept': 'application/json', 'If-Unmodified-Since': last_modified}
        )
        resp, status, success = make_request(requests.patch,
                                             req_url,
                                             params=params,
                                             json=data,
                                             **args
                                             )
        if status == 412:
            return 'Resource has been modified since last publish', status

        if success:
            log.info('Updated dataset with identifier: {}'.format(cr_id))
        else:
            log.error('Failed to update dataset {}'.format(cr_id))

        return resp, status

    def get_dataset(self, cr_id):
        """Get dataset.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = format_url(self._METAX_GET_DATASET, cr_id)
        resp, status, success = make_request(requests.get,
                                             req_url,
                                             **self._get_args())
        if not success:
            log.warning('Failed to get dataset {}'.format(cr_id))
        return resp, status

    def delete_dataset(self, cr_id):
        """Delete dataset from Metax.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = format_url(self._METAX_DELETE_DATASET, cr_id)
        resp, status, success = make_request(requests.delete,
                                             req_url,
                                             **self._get_args())
        if success:
            log.info('Deleted dataset with identifier: {}'.format(cr_id))
        else:
            log.warning('Failed to delete dataset {}'.format(cr_id))
        return resp, status

    def change_cumulative_state(self, cr_id, cumulative_state):
        """Call Metax change_cumulative_state RPC.

        Arguments:
            cr_id (str): The identifier of the dataset.
            cumulative_state (int): New cumulative state.

        Returns:
            Metax response.

        """
        req_url = self._METAX_CHANGE_CUMULATIVE_STATE
        params = {
            "identifier": cr_id,
            "cumulative_state": cumulative_state
        }
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **self._get_args()
                                             )
        if success:
            log.info('Changed cumulative state of dataset {} to {}'.format(cr_id, cumulative_state))
        else:
            log.warning('Failed to change cumulative_state of dataset {} to {}'.format(cr_id, cumulative_state))
        return resp, status

    def refresh_directory_content(self, cr_identifier, dir_identifier):
        """Call Metax refresh_directory_content RPC.

        Arguments:
            cr_identifier (str): The identifier of the dataset.
            dir_identifier (int): The identifier of the directory.

        Returns:
            Metax response.

        """
        req_url = self._METAX_REFRESH_DIRECTORY_CONTENT
        params = {
            "cr_identifier": cr_identifier,
            "dir_identifier": dir_identifier
        }
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **self._get_args()
                                             )
        if success:
            log.info('Refreshed content of directory {} in dataset {}'.format(dir_identifier, cr_identifier))
        else:
            log.warning('Failed to refresh content directory {} in dataset {}'.format(dir_identifier, cr_identifier))
        return resp, status

    def fix_deprecated_dataset(self, cr_identifier):
        """Call Metax fix_deprecated RPC.

        Arguments:
            cr_identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = self._METAX_FIX_DEPRECATED
        params = {
            "identifier": cr_identifier,
        }
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **self._get_args()
                                             )
        if success:
            log.info('Fixed deprecated dataset {}'.format(cr_identifier))
        else:
            log.warning('Failed to fix deprecated dataset {}'.format(cr_identifier))
        return resp, status
