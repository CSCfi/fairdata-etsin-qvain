# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Etsin and Qvain."""

import requests
import marshmallow
from flask import current_app

from etsin_finder.log import log
from etsin_finder.utils.utils import format_url
from etsin_finder.utils.request_utils import make_request
from etsin_finder.schemas.services import MetaxServiceConfigurationSchema
from .base_service import BaseService, ConfigValidationMixin

_REST_DIRECTORIES = "/rest/v2/directories"
_REST_DATASETS = "/rest/v2/datasets"


class MetaxCommonAPIService(BaseService, ConfigValidationMixin):
    """Service for Metax API v2 requests used by both Etsin and Qvain."""

    schema = MetaxServiceConfigurationSchema(unknown=marshmallow.RAISE)

    @property
    def config(self):
        """Get service configuration."""
        return current_app.config.get("METAX_QVAIN_API", None)

    @property
    def proxies(self):
        """Get service proxy configuration."""
        if self.config.get("HTTPS_PROXY"):
            return dict(https=self.config.get("HTTPS_PROXY"))
        return None

    @property
    def auth(self):
        """Get auth params."""
        return (self._USER, self._PASSWORD)

    def metax_url(self, url):
        """Return a Metax API URL."""
        return f"https://{self._HOST}{url}"

    @property
    def _HOST(self):
        return self.config.get("HOST")

    @property
    def _USER(self):
        return self.config.get("USER")

    @property
    def _PASSWORD(self):
        return self.config.get("PASSWORD")

    @property
    def _VERIFY_SSL(self):
        return self.config.get("VERIFY_SSL", True)

    @property
    def _METAX_GET_DIRECTORY_FOR_PROJECT_URL(self):
        return (
            self.metax_url(_REST_DIRECTORIES)
            + "/files?cr_identifier={0}&project={1}&path={2}&include_parent&pagination&limit=1"
        )

    @property
    def _METAX_GET_ROOT_DIRECTORIES_FOR_PROJECT_URL(self):
        return (
            self.metax_url(_REST_DIRECTORIES)
            + "/files?project={0}&path=%2F&include_parent"
        )

    @property
    def _METAX_GET_DIRECTORIES(self):
        return self.metax_url(_REST_DIRECTORIES) + "/{0}/files"

    @property
    def _METAX_GET_DATASET_USER_METADATA(self):
        return self.metax_url(_REST_DATASETS) + "/{0}/files/user_metadata"

    @property
    def _METAX_PUT_DATASET_USER_METADATA(self):
        return self._METAX_GET_DATASET_USER_METADATA

    @property
    def _METAX_GET_DATASET_BY_PREFERRED_IDENTIFIER(self):
        return self.metax_url(_REST_DATASETS) + "/?preferred_identifier={0}"

    @property
    def _METAX_GET_DATASET_PROJECTS(self):
        return self.metax_url(_REST_DATASETS) + "/{0}/projects"

    @property
    def _METAX_DATASET_EDITOR_PERMISSIONS_USERS(self):
        return self.metax_url(_REST_DATASETS) + "/{0}/editor_permissions/users"

    def _get_args(self, **kwargs):
        """Get default args for request, allow overriding with kwargs."""
        args = dict(
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            auth=(self._USER, self._PASSWORD),
            verify=self._VERIFY_SSL,
            timeout=10,
            proxies=self.proxies,
        )
        args.update(kwargs)
        return args

    def get_directory_for_project_using_path(self, cr_id, pid, path, params=None):
        """
        Get a specific directory with directory's id.

        Arguments:
            cr_id {string} -- The identifier of the catalog record.
            pid {string} -- The identifier of the project.
            path {string} -- The path of the project directory tree.
            params {dict} -- Dictionary of key-value pairs of query parameters.

        Returns
            [type] -- Metax response.

        """
        req_url = format_url(
            self._METAX_GET_DIRECTORY_FOR_PROJECT_URL, cr_id, pid, path
        )
        resp, status, success = make_request(
            requests.get, req_url, params=params, **self._get_args()
        )
        if not success:
            log.warning("Failed to get directory {}".format(path))
            log.warning("Using request {}".format(req_url))
            return resp, status
        return resp, status

    def get_directories(self, dir_identifier, params=None):
        """
        Get a specific directory with directory's id and it's contents, including sub-directories and files.

        Arguments:
            dir_identifier {string} -- The identifier of the directory.
            params {dict} -- Dictionary of key-value pairs of query parameters.

        Returns
            [type] -- Metax response.

        """
        req_url = format_url(self._METAX_GET_DIRECTORIES, dir_identifier)
        resp, status, success = make_request(
            requests.get, req_url, params=params, **self._get_args()
        )

        if not success:
            log.warning("Failed to get directory {}".format(dir_identifier))
            return resp, status
        return resp, status

    def get_directories_for_project(self, project_identifier, params=None):
        """
        Get directory contents for a specific project, including sub-directories and files.

        Arguments:
            project_identifier {string} -- The identifier of the project.
            params {dict} -- Dictionary of key-value pairs of query parameters.

        Returns
            [type] -- Metax response.

        """
        req_url = format_url(
            self._METAX_GET_ROOT_DIRECTORIES_FOR_PROJECT_URL, project_identifier
        )
        resp, status, success = make_request(
            requests.get, req_url, params=params, **self._get_args()
        )
        if not success:
            log.warning(
                "Failed to get directory contents for project {}".format(
                    project_identifier
                )
            )
        return resp, status

    def get_dataset_projects(self, cr_id):
        """
        Get dataset projects from Metax.

        Arguments:
            cr_id {string} -- The identifier of the dataset.

        Returns:
            [type] -- Metax response.

        """
        req_url = format_url(self._METAX_GET_DATASET_PROJECTS, cr_id)
        resp, status, success = make_request(requests.get, req_url, **self._get_args())
        if not success:
            log.warning("Failed to get projects for dataset {}".format(cr_id))
        return resp, status

    def get_dataset_editor_permissions_users(self, cr_id):
        """Get dataset.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = format_url(self._METAX_DATASET_EDITOR_PERMISSIONS_USERS, cr_id)
        resp, status, success = make_request(requests.get, req_url, **self._get_args())
        if not success:
            log.warning("Failed to get dataset {}".format(cr_id))
        return resp, status

    def get_dataset_user_metadata(self, cr_id):
        """
        Get user-defined file metadata for dataset from Metax.

        Arguments:
            cr_id {string} -- The identifier of the dataset.

        Returns:
            [type] -- Metax response.

        """
        req_url = format_url(self._METAX_GET_DATASET_USER_METADATA, cr_id)
        resp, status, success = make_request(requests.get, req_url, **self._get_args())
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
        req_url = format_url(self._METAX_PUT_DATASET_USER_METADATA, cr_id)
        resp, status, success = make_request(
            requests.put, req_url, json=data, **self._get_args()
        )
        if not success:
            log.warning("Failed to update user metadata for dataset {}".format(cr_id))
        return resp, status

    def get_dataset_exists_by_preferred_identifier(self, preferred_identifier):
        """
        Get a simple list of existing datasets based on a list of urls.

        Arguments:
            identifier {string} -- preferred identifier.

        Returns:
            identifier (string) OR None - if dataset exists in Metax, returns identifier, otherwise returns None
        """
        req_url = format_url(
            self._METAX_GET_DATASET_BY_PREFERRED_IDENTIFIER, preferred_identifier
        )
        resp, status, success = make_request(requests.get, req_url, **self._get_args())
        if status == 200:
            return resp["identifier"]
        return None


_service = MetaxCommonAPIService()
get_directory_for_project_using_path = _service.get_directory_for_project_using_path
get_directories = _service.get_directories
get_directories_for_project = _service.get_directories_for_project
get_dataset_projects = _service.get_dataset_projects
get_dataset_user_metadata = _service.get_dataset_user_metadata
get_dataset_exists_by_preferred_identifier = (
    _service.get_dataset_exists_by_preferred_identifier
)
update_dataset_user_metadata = _service.update_dataset_user_metadata
