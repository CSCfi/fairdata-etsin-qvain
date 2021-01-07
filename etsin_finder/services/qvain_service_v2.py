# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Qvain"""

import requests
import json

from etsin_finder.log import log

from etsin_finder.utils.utils import format_url
from etsin_finder.utils.request_utils import make_request
from etsin_finder.services.qvain_service import MetaxQvainAPIService as MetaxQvainAPIServiceV1


class MetaxQvainAPIServiceV2(MetaxQvainAPIServiceV1):
    """
    Metax API V2 Service

    Reuses most methods from MetaxQvainAPIServiceV1 but with V2 URLs.
    Only new and changed methods have to be defined here.
    """

    @property
    def _METAX_GET_DIRECTORY_FOR_PROJECT_URL(self):
        return None

    @property
    def _METAX_GET_DIRECTORY(self):
        return None

    @property
    def _METAX_GET_FILE(self):
        return self.metax_url('/rest/v2/files') + \
            '/{0}'

    @property
    def _METAX_UPDATE_DATASET_FILES(self):
        return self.metax_url('/rest/v2/datasets') + \
            '/{0}/files'

    @property
    def _METAX_GET_DATASET(self):
        return self.metax_url('/rest/v2/datasets') + \
            '/{0}'

    @property
    def _METAX_GET_DATASETS_FOR_USER(self):
        return self.metax_url('/rest/v2/datasets') + \
            '?metadata_provider_user={0}&ordering=-date_created'

    @property
    def _METAX_GET_ALL_DATASETS_FOR_USER(self):
        return self.metax_url('/rest/v2/datasets') + \
            '?metadata_provider_user={0}&ordering=-date_created&no_pagination=true'

    @property
    def _METAX_CREATE_DATASET(self):
        return self.metax_url('/rest/v2/datasets')

    @property
    def _METAX_PATCH_DATASET(self):
        return self.metax_url('/rest/v2/datasets') + \
            '/{0}'

    @property
    def _METAX_DELETE_DATASET(self):
        return self.metax_url('/rest/v2/datasets') + \
            '/{0}'

    @property
    def _METAX_CHANGE_CUMULATIVE_STATE(self):
        return self.metax_url('/rpc/v2/datasets/change_cumulative_state')

    @property
    def _METAX_REFRESH_DIRECTORY_CONTENT(self):
        return None

    @property
    def _METAX_FIX_DEPRECATED(self):
        return self.metax_url('/rpc/v2/datasets/fix_deprecated')

    @property
    def _METAX_CREATE_NEW_VERSION(self):
        return self.metax_url('/rpc/v2/datasets/create_new_version')

    @property
    def _METAX_PUBLISH_DATASET(self):
        return self.metax_url('/rpc/v2/datasets/publish_dataset')

    @property
    def _METAX_MERGE_DRAFT(self):
        return self.metax_url('/rpc/v2/datasets/merge_draft')

    @property
    def _METAX_CREATE_DRAFT(self):
        return self.metax_url('/rpc/v2/datasets/create_draft')

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
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             json=data,
                                             **args
                                             )

        if success:
            log.info('Created dataset with identifier: {}'.format(resp.get('identifier', 'COULD-NOT-GET-IDENTIFIER')))
        else:
            log.warning("Failed to create dataset")

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
        log.debug('Request URL: PATCH {0}\nHeaders: {1}\nData: {2}'.format(req_url, headers, json.dumps(data, indent=2)))

        args = self._get_args(timeout=30)
        resp, status, success = make_request(requests.patch,
                                             req_url,
                                             params=params,
                                             json=data,
                                             **args)

        if status == 412:
            return 'Resource has been modified since last publish', status

        if success:
            log.info('Updated dataset with identifier: {}'.format(cr_id))
        else:
            log.warning("Failed to update dataset {}".format(cr_id), status)
        return resp, status

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
        log.debug('Request URL: {0}\nData: {1}'.format(req_url, data))

        args = self._get_args(timeout=30)
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             json=data,
                                             **args
                                             )

        if not success:
            log.warning("Failed to update dataset {}".format(cr_id))
            return resp, status

        if status == 412:
            return 'Resource has been modified since last publish', 412

        log.info('Updated dataset with identifier: {}'.format(cr_id))
        return resp, status

    def refresh_directory_content(self, cr_identifier, dir_identifier):
        """No longer necessary, use update_dataset_files instead."""
        return "API removed", 403

    def fix_deprecated_dataset(self, cr_identifier):
        """No longer necessary, creating new version should fix a deprecated dataset automatically."""
        return "API removed", 403

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
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **args
                                             )

        if success:
            log.info('Created new version of dataset {}'.format(cr_identifier))
        else:
            log.warning("Failed to create new version of dataset {}".format(cr_identifier))
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
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **args)

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
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **args
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
        resp, status, success = make_request(requests.post,
                                             req_url,
                                             params=params,
                                             **args
                                             )

        if success:
            log.info("Created draft of {}".format(cr_identifier))
        else:
            log.warning("Failed to create draft of dataset {}".format(cr_identifier))
        return resp, status
