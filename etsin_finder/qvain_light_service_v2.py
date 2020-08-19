# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax for Qvain Light"""

import requests
from flask import jsonify

import json

from etsin_finder.finder import app
from etsin_finder.app_config import get_metax_qvain_api_config
from etsin_finder.utils import json_or_empty, FlaskService, format_url
from etsin_finder.qvain_light_service import MetaxQvainLightAPIService as MetaxQvainLightAPIServiceV1

log = app.logger

class MetaxQvainLightAPIService(MetaxQvainLightAPIServiceV1):
    """
    Metax API V2 Service

    Reuses most methods from MetaxQvainLightAPIServiceV1 but with V2 URLs.
    Only new and changed methods have to be defined here.
    """

    def __init__(self, app):
        """Init Metax API Service."""
        super().__init__(app)

        metax_qvain_api_config = get_metax_qvain_api_config(app.testing)

        if metax_qvain_api_config:

            self.METAX_GET_DIRECTORY_FOR_PROJECT_URL = None
            self.METAX_GET_DIRECTORY = None
            self.METAX_GET_FILE = 'https://{0}/rest/v2/files'.format(metax_qvain_api_config['HOST']) + \
                                  '/{0}'
            self.METAX_UPDATE_DATASET_FILES = 'https://{0}/rest/v2/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                '/{0}/files'
            self.METAX_GET_DATASET = 'https://{0}/rest/v2/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                                     '/{0}'
            self.METAX_GET_DATASETS_FOR_USER = 'https://{0}/rest/v2/datasets'.format(metax_qvain_api_config.get('HOST')) + \
                                               '?metadata_provider_user={0}&ordering=-date_created'
            self.METAX_GET_ALL_DATASETS_FOR_USER = 'https://{0}/rest/v2/datasets'.format(metax_qvain_api_config.get('HOST')) + \
                '?metadata_provider_user={0}&ordering=-date_created&no_pagination=true'
            self.METAX_CREATE_DATASET = 'https://{0}/rest/v2/datasets'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_PATCH_DATASET = 'https://{0}/rest/v2/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                                       '/{0}'
            self.METAX_DELETE_DATASET = 'https://{0}/rest/v2/datasets'.format(metax_qvain_api_config.get('HOST'), ) + \
                                        '/{0}'
            self.METAX_CHANGE_CUMULATIVE_STATE = 'https://{0}/rpc/v2/datasets/change_cumulative_state'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_REFRESH_DIRECTORY_CONTENT = None
            self.METAX_FIX_DEPRECATED = 'https://{0}/rpc/v2/datasets/fix_deprecated'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_CREATE_NEW_VERSION = 'https://{0}/rpc/v2/datasets/create_new_version'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_PUBLISH_DATASET = 'https://{0}/rpc/v2/datasets/publish_dataset'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_MERGE_DRAFT = 'https://{0}/rpc/v2/datasets/merge_draft'.format(metax_qvain_api_config.get('HOST'))
            self.METAX_CREATE_DRAFT = 'https://{0}/rpc/v2/datasets/create_draft'.format(metax_qvain_api_config.get('HOST'))
            self.user = metax_qvain_api_config.get('USER')
            self.pw = metax_qvain_api_config.get('PASSWORD')
            self.verify_ssl = metax_qvain_api_config.get('VERIFY_SSL', True)
        elif not self.is_testing:
            log.error("Unable to initialize MetaxAPIService due to missing config")

    def create_dataset(self, data, params=None):
        """Send the data from the frontend to Metax.

        Arguments:
            data (object): Object with the dataset data that has been validated and converted to comply with the Metax schema.
            params (dict): Dictionary of key-value pairs of query parameters.

        Returns:
            The response from Metax.

        """
        req_url = self.METAX_CREATE_DATASET
        headers = {'Accept': 'application/json'}
        try:
            metax_api_response = requests.post(req_url,
                                               params=params,
                                               json=data,
                                               headers=headers,
                                               auth=(self.user, self.pw),
                                               verify=self.verify_ssl,
                                               timeout=10)
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
        req_url = format_url(self.METAX_PATCH_DATASET, cr_id)
        headers = {'Accept': 'application/json', 'If-Unmodified-Since': last_modified}
        log.debug('Request URL: PATCH {0}\nHeaders: {1}\nData: {2}'.format(req_url, headers, json.dumps(data, indent=2)))
        try:
            metax_api_response = requests.patch(req_url,
                                                params=params,
                                                json=data,
                                                headers=headers,
                                                auth=(self.user, self.pw),
                                                verify=self.verify_ssl,
                                                timeout=10)
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
        req_url = format_url(self.METAX_UPDATE_DATASET_FILES, cr_id)
        log.debug('Request URL: {0}\nData: {1}'.format(req_url, data))
        try:
            metax_api_response = requests.post(req_url,
                                               params=params,
                                               json=data,
                                               auth=(self.user, self.pw),
                                               verify=self.verify_ssl,
                                               timeout=10)
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

        return json_or_empty(metax_api_response), metax_api_response.status_code

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
        req_url = self.METAX_CREATE_NEW_VERSION
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
                    "Failed to create new dataset version {0}\nResponse status code: {1}\nResponse text: {2}".format(
                        cr_identifier,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
                return json_or_empty(metax_api_response) or metax_api_response.text, metax_api_response.status_code
            else:
                log.error("Error creating new dataset version {0} \n{1}".format(cr_identifier, e))
            return {'detail': 'Error trying to send data to metax.'}, 500
        log.info('Created new dataset version {}'.format(cr_identifier))
        return (json_or_empty(metax_api_response) or metax_api_response.text), metax_api_response.status_code

    def publish_dataset(self, cr_identifier):
        """Call Metax publish_dataset RPC to publish a draft dataset.

        Arguments:
            cr_identifier (str): The identifier of the draft dataset.

        Returns:
            Metax response.

        """
        req_url = self.METAX_PUBLISH_DATASET
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
                    "Failed to publish dataset {0}\nResponse status code: {1}\nResponse text: {2}".format(
                        cr_identifier,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
                return json_or_empty(metax_api_response) or metax_api_response.text, metax_api_response.status_code
            else:
                log.error("Error publishing draft dataset {0} \n{1}".format(cr_identifier, e))
            return {'detail': 'Error trying to send data to metax.'}, 500
        log.info('Published draft dataset {}'.format(cr_identifier))
        return (json_or_empty(metax_api_response) or metax_api_response.text), metax_api_response.status_code

    def merge_draft(self, cr_identifier):
        """Call Metax merge_draft RPC to merge a draft to the corresponding published dataset.

        Arguments:
            cr_identifier (str): The identifier of the draft dataset.

        Returns:
            Metax response.

        """
        req_url = self.METAX_MERGE_DRAFT
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
                    "Failed to merge draft {0}\nResponse status code: {1}\nResponse text: {2}".format(
                        cr_identifier,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
                return json_or_empty(metax_api_response) or metax_api_response.text, metax_api_response.status_code
            else:
                log.error("Errog merging draft {0} \n{1}".format(cr_identifier, e))
            return {'detail': 'Error trying to send data to metax.'}, 500
        log.info('Merged draft dataset {}'.format(cr_identifier))
        return (json_or_empty(metax_api_response) or metax_api_response.text), metax_api_response.status_code

    def create_draft(self, cr_identifier):
        """Call Metax create_draft RPC to publish a draft dataset.

        Arguments:
            cr_identifier (str): The identifier of the draft dataset.

        Returns:
            Metax response.

        """
        req_url = self.METAX_CREATE_DRAFT
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
                    "Failed create draft {0}\nResponse status code: {1}\nResponse text: {2}".format(
                        cr_identifier,
                        metax_api_response.status_code,
                        json_or_empty(metax_api_response) or metax_api_response.text
                    ))
                return json_or_empty(metax_api_response) or metax_api_response.text, metax_api_response.status_code
            else:
                log.error("Error creating draft {0} \n{1}".format(cr_identifier, e))
            return {'detail': 'Error trying to send data to metax.'}, 500
        log.info('Create draft from dataset {}'.format(cr_identifier))
        return (json_or_empty(metax_api_response) or metax_api_response.text), metax_api_response.status_code

_metax_api = MetaxQvainLightAPIService(app)

get_file = _metax_api.get_file
patch_file = _metax_api.patch_file
get_datasets_for_user = _metax_api.get_datasets_for_user
create_dataset = _metax_api.create_dataset
update_dataset = _metax_api.update_dataset
update_dataset_files = _metax_api.update_dataset_files
get_dataset = _metax_api.get_dataset
delete_dataset = _metax_api.delete_dataset
change_cumulative_state = _metax_api.change_cumulative_state
fix_deprecated_dataset = _metax_api.fix_deprecated_dataset
create_new_version = _metax_api.create_new_version
publish_dataset = _metax_api.publish_dataset
merge_draft = _metax_api.merge_draft
create_draft = _metax_api.create_draft
