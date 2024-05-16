# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Qvain."""

import requests
import json
import marshmallow
from flask import current_app

from etsin_finder.log import log

from etsin_finder.utils.utils import datetime_to_header, format_url
from etsin_finder.utils.request_utils import make_request
from etsin_finder.schemas.services import MetaxServiceConfigurationSchema
from .base_service import BaseService, ConfigValidationMixin


class MetaxQvainAPIService(BaseService, ConfigValidationMixin):
    """Metax API Service"""

    schema = MetaxServiceConfigurationSchema(unknown=marshmallow.RAISE)

    DATASETS_RESEARCH_DATASET_FIELDS = "title,preferred_identifier"

    @property
    def config(self):
        """Get service configuration"""
        return current_app.config.get("METAX_QVAIN_API", None)

    @property
    def proxies(self):
        """Get service proxy configuration"""
        if self.config.get("HTTPS_PROXY"):
            return dict(https=self.config.get("HTTPS_PROXY"))
        return None

    def metax_url(self, url):
        """Return a Metax API URL"""
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
        return None

    @property
    def _METAX_GET_DIRECTORY(self):
        return None

    @property
    def _METAX_GET_FILE(self):
        return self.metax_url("/rest/v2/files") + "/{0}"

    @property
    def _METAX_GET_DATASET(self):
        return self.metax_url("/rest/v2/datasets") + "/{0}"

    @property
    def _METAX_GET_DATASET_FILE(self):
        return self.metax_url("/rest/v2/datasets") + "/{0}/files/{1}"

    @property
    def _METAX_GET_DATASETS_FOR_USER(self):
        return (
            self.metax_url("/rest/v2/datasets")
            + "?metadata_provider_user={0}&ordering=-date_created"
        )

    @property
    def _METAX_GET_ALL_DATASETS_FOR_USER(self):
        return (
            self.metax_url("/rest/v2/datasets")
            + "?metadata_provider_user={0}&pagination=false&ordering=-date_created"
        )

    @property
    def _METAX_GET_ALL_DATASETS_FOR_EDITOR(self):
        return (
            self.metax_url("/rest/v2/datasets")
            + "?editor_permissions_user={0}&ordering=-date_created"
        )

    @property
    def _METAX_GET_ALL_DATASETS_FOR_PROJECTS(self):
        return (
            self.metax_url("/rest/v2/datasets") + "?projects={0}&ordering=-date_created"
        )

    @property
    def _METAX_CREATE_DATASET(self):
        return self.metax_url("/rest/v2/datasets")

    @property
    def _METAX_PATCH_DATASET(self):
        return self.metax_url("/rest/v2/datasets") + "/{0}"

    @property
    def _METAX_DELETE_DATASET(self):
        return self.metax_url("/rest/v2/datasets") + "/{0}"

    @property
    def _METAX_CHANGE_CUMULATIVE_STATE(self):
        return self.metax_url("/rpc/v2/datasets/change_cumulative_state")

    @property
    def _METAX_REFRESH_DIRECTORY_CONTENT(self):
        return None

    @property
    def _METAX_UPDATE_DATASET_FILES(self):
        return self.metax_url("/rest/v2/datasets") + "/{0}/files"

    @property
    def _METAX_CREATE_NEW_VERSION(self):
        return self.metax_url("/rpc/v2/datasets/create_new_version")

    @property
    def _METAX_PUBLISH_DATASET(self):
        return self.metax_url("/rpc/v2/datasets/publish_dataset")

    @property
    def _METAX_MERGE_DRAFT(self):
        return self.metax_url("/rpc/v2/datasets/merge_draft")

    @property
    def _METAX_CREATE_DRAFT(self):
        return self.metax_url("/rpc/v2/datasets/create_draft")

    @property
    def _METAX_DATASET_EDITOR_PERMISSIONS_USERS(self):
        return self.metax_url("/rest/v2/datasets") + "/{0}/editor_permissions/users"

    @property
    def _METAX_DATASET_EDITOR_PERMISSIONS_USER(self):
        return self.metax_url("/rest/v2/datasets") + "/{0}/editor_permissions/users/{1}"

    def _get_args(self, **kwargs):
        """Get default args for request, allow overriding with kwargs."""
        args = dict(
            headers={"Accept": "application/json", "Content-Type": "application/json"},
            auth=(self._USER, self._PASSWORD),
            verify=self._VERIFY_SSL,
            timeout=30,
            proxies=self.proxies,
        )
        args.update(kwargs)
        return args

    def get_directory_for_project(self, project_identifier, params=None):
        """Get directory contents for a specific project

        Args:
            project_identifier (str): Project identifier.

        Returns:
            Metax response

        """
        req_url = format_url(
            self._METAX_GET_DIRECTORY_FOR_PROJECT_URL, project_identifier
        )
        resp, _, success = make_request(
            requests.get, req_url, params=params, **self._get_args()
        )
        if not success:
            log.warning(
                "Failed to get directory contents for project {}".format(
                    project_identifier
                )
            )
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
        resp, _, success = make_request(
            requests.get, req_url, params=params, **self._get_args()
        )
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
        resp, _, success = make_request(requests.get, req_url, **self._get_args())
        if not success:
            log.warning("Failed to get file {}".format(file_identifier))
            return None
        return resp

    def get_dataset_file(self, cr_id, file_identifier):
        """Get a specific file in a dataset with file's id

        Args:
            file_identifier (str): File identifier.

        Returns:
            Metax response

        """
        req_url = format_url(self._METAX_GET_DATASET_FILE, cr_id, file_identifier)
        resp, _, success = make_request(requests.get, req_url, **self._get_args())
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
        resp, code, success = make_request(
            requests.patch, req_url, json=data, **self._get_args()
        )
        if not success:
            log.warning("Failed to patch file {}".format(file_identifier))
        return resp, code

    def get_datasets_for_user(
        self, user_id, limit, offset, no_pagination, data_catalog_matcher=None
    ):
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
        if no_pagination:
            req_url = format_url(self._METAX_GET_ALL_DATASETS_FOR_USER, user_id)

        params = {
            "research_dataset_fields": self.DATASETS_RESEARCH_DATASET_FIELDS,
        }
        if limit:
            params["limit"] = limit
        if offset:
            params["offset"] = offset
        if data_catalog_matcher:
            params["data_catalog"] = data_catalog_matcher

        resp, status, success = make_request(
            requests.get, req_url, params=params, **self._get_args(timeout=120)
        )
        if not success or len(resp) == 0:
            log.info(f"No datasets found. {status}")
            return [], status
        return resp, status

    def get_datasets_for_editor(self, user_id, data_catalog_matcher=None):
        """Get datasets where user has editor permission.

        Args:
            user_id (str): User identifier
            data_catalog_matcher (regexp): Filter datasets by data catalog

        Returns:
            Metax response.

        """
        req_url = format_url(self._METAX_GET_ALL_DATASETS_FOR_EDITOR, user_id)

        params = {
            "pagination": "false",
            "research_dataset_fields": self.DATASETS_RESEARCH_DATASET_FIELDS,
        }
        if data_catalog_matcher:
            params["data_catalog"] = data_catalog_matcher

        resp, status, success = make_request(
            requests.get, req_url, params=params, **self._get_args(timeout=120)
        )
        if not success or len(resp) == 0:
            log.info(f"No datasets found. {status}")
            return [], status
        return resp, status

    def get_datasets_for_projects(self, projects, data_catalog_matcher=None):
        """Get datasets belonging to one of projects.

        Args:
            projects (list): List of project identifiers
            data_catalog_matcher (regexp): Filter datasets by data catalog

        Returns:
            Metax response.

        """
        req_url = format_url(
            self._METAX_GET_ALL_DATASETS_FOR_PROJECTS, ",".join(projects)
        )

        params = {
            "pagination": "false",
            "research_dataset_fields": self.DATASETS_RESEARCH_DATASET_FIELDS,
        }
        if data_catalog_matcher:
            params["data_catalog"] = data_catalog_matcher

        resp, status, success = make_request(
            requests.get, req_url, params=params, **self._get_args(timeout=120)
        )
        if not success or len(resp) == 0:
            log.info("No datasets found.")
            return [], status
        return resp, status

    def create_dataset(self, data, params=None):
        """Send the data from the frontend to Metax.

        Arguments:
            data (object): Object with the dataset data that has been validated and converted to comply with the Metax schema.
            params (dict): Dictionary of key-value pairs of query parameters.

        Returns:
            The response from Metax.

        """
        req_url = self._METAX_CREATE_DATASET
        args = self._get_args(timeout=30)
        resp, status, success = make_request(
            requests.post, req_url, params=params, json=data, **args
        )

        if success:
            log.info(
                "Created dataset with identifier: {}".format(
                    resp.get("identifier", "COULD-NOT-GET-IDENTIFIER")
                )
            )
        else:
            log.warning(f"Failed to create dataset: {data}, {params}")

        return resp, status

    def update_dataset(self, data, cr_id, last_modified, params):
        """Update a dataset with the data that the user has entered in Qvain-light.

        Arguments:
            data (object): Object with the dataset data that has been validated and converted to comply with the Metax schema.
            cr_id (str): The identifier of the dataset.
            last_modified (datetime): Datetime of last modification.
            params (dict): Dictionary of key-value pairs of query parameters.

        Returns:
            The response from Metax.

        """
        req_url = format_url(self._METAX_PATCH_DATASET, cr_id)
        last_modified_str = datetime_to_header(last_modified)
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "If-Unmodified-Since": last_modified_str,
        }
        log.debug(
            "Request URL: PATCH {0}\nHeaders: {1}\nData: {2}".format(
                req_url, headers, json.dumps(data, indent=2)
            )
        )

        args = self._get_args(timeout=30, headers=headers)
        resp, status, success = make_request(
            requests.patch, req_url, params=params, json=data, **args
        )

        if status == 412:
            return "Resource has been modified elsewhere.", status

        if success:
            log.info("Updated dataset with identifier: {}".format(cr_id))
        else:
            log.warning("Failed to update dataset {}".format(cr_id), status)
        return resp, status

    def get_dataset(self, cr_id):
        """Get dataset.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = format_url(self._METAX_GET_DATASET, cr_id)
        resp, status, success = make_request(requests.get, req_url, **self._get_args())
        if not success:
            log.warning("Failed to get dataset {}".format(cr_id))
        return resp, status

    def delete_dataset(self, cr_id):
        """Delete dataset from Metax.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = format_url(self._METAX_DELETE_DATASET, cr_id)
        resp, status, success = make_request(
            requests.delete, req_url, **self._get_args()
        )
        if success:
            log.info("Deleted dataset with identifier: {}".format(cr_id))
        else:
            log.warning("Failed to delete dataset {}".format(cr_id))
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
        params = {"identifier": cr_id, "cumulative_state": cumulative_state}
        resp, status, success = make_request(
            requests.post, req_url, params=params, **self._get_args()
        )
        if success:
            log.info(
                "Changed cumulative state of dataset {} to {}".format(
                    cr_id, cumulative_state
                )
            )
        else:
            log.warning(
                "Failed to change cumulative_state of dataset {} to {}".format(
                    cr_id, cumulative_state
                )
            )
        return resp, status

    def refresh_directory_content(self, cr_identifier, dir_identifier):
        """No longer necessary, use update_dataset_files instead."""
        return "API removed", 403

    def update_dataset_files(self, cr_id, data, params=None):
        """Add or remove files in a dataset.

        Arguments:
            data (object): Object with lists of directory/file addition and removal actions.
            cr_id (str): The identifier of the dataset.
            params (dict): Dictionary of key-value pairs of query parameters.
                Use e.g. "allowed_projects=project_x,project_y" to prevent user from accessing files that are not in their projects.

        Returns:
            The response from Metax.

        """
        req_url = format_url(self._METAX_UPDATE_DATASET_FILES, cr_id)
        log.debug("Request URL: {0}\nData: {1}".format(req_url, data))

        args = self._get_args(timeout=30)
        resp, status, success = make_request(
            requests.post, req_url, params=params, json=data, **args
        )

        if not success:
            log.warning("Failed to update dataset {}".format(cr_id))
            return resp, status

        if status == 412:
            return "Resource has been modified elsewhere.", 412

        log.info("Updated dataset with identifier: {}".format(cr_id))
        return resp, status

    def create_new_version(self, cr_identifier):
        """Call Metax create_new_version RPC.

        Arguments:
            cr_identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        req_url = self._METAX_CREATE_NEW_VERSION
        params = {
            "identifier": cr_identifier,
        }
        args = self._get_args(timeout=30)
        resp, status, success = make_request(
            requests.post, req_url, params=params, **args
        )

        if success:
            log.info("Created new version of dataset {}".format(cr_identifier))
        else:
            log.warning(
                "Failed to create new version of dataset {}".format(cr_identifier)
            )
        return resp, status

    def publish_dataset(self, cr_identifier):
        """Call Metax publish_dataset RPC to publish a draft dataset.

        Arguments:
            cr_identifier (str): The identifier of the draft dataset.

        Returns:
            Metax response.

        """
        req_url = self._METAX_PUBLISH_DATASET
        params = {
            "identifier": cr_identifier,
        }
        args = self._get_args(timeout=30)
        resp, status, success = make_request(
            requests.post, req_url, params=params, **args
        )

        if success:
            log.info("Published dataset {}".format(cr_identifier))
        else:
            log.warning("Failed to publish dataset {}".format(cr_identifier))

        return resp, status

    def merge_draft(self, cr_identifier):
        """Call Metax merge_draft RPC to merge a draft to the corresponding published dataset.

        Arguments:
            cr_identifier (str): The identifier of the draft dataset.

        Returns:
            Metax response.

        """
        req_url = self._METAX_MERGE_DRAFT
        params = {
            "identifier": cr_identifier,
        }
        args = self._get_args(timeout=30)
        resp, status, success = make_request(
            requests.post, req_url, params=params, **args
        )

        if success:
            log.info("Merged draft {}".format(cr_identifier))
        else:
            log.warning("Failed to merge draft {}".format(cr_identifier))
        return resp, status

    def create_draft(self, cr_identifier):
        """Call Metax create_draft RPC to create a draft of an existing dataset.

        Arguments:
            cr_identifier (str): The identifier of the existing dataset.

        Returns:
            Metax response.

        """
        req_url = self._METAX_CREATE_DRAFT
        params = {
            "identifier": cr_identifier,
        }
        args = self._get_args(timeout=30)
        resp, status, success = make_request(
            requests.post, req_url, params=params, **args
        )

        if success:
            log.info("Created draft of {}".format(cr_identifier))
        else:
            log.warning("Failed to create draft of dataset {}".format(cr_identifier))
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

    def create_dataset_editor_permissions_user(self, cr_id, user, role="editor"):
        """Get dataset.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        data = {"user_id": user, "role": role}
        req_url = format_url(self._METAX_DATASET_EDITOR_PERMISSIONS_USERS, cr_id)
        resp, status, success = make_request(
            requests.post, req_url, json=data, **self._get_args()
        )
        if not success:
            log.warning("Failed to get dataset {}".format(cr_id))
        return resp, status

    def delete_dataset_editor_permissions_user(self, cr_id, user):
        """Get dataset.

        Arguments:
            cr_id (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        data = {"user_id": user}
        req_url = format_url(self._METAX_DATASET_EDITOR_PERMISSIONS_USER, cr_id, user)
        resp, status, success = make_request(
            requests.delete, req_url, json=data, **self._get_args()
        )
        if not success:
            log.warning(f"Failed to delete dataset {cr_id} user permission for {user}")
        return resp, status
