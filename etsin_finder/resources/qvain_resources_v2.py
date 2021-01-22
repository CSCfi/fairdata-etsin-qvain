# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RESTful API endpoints, meant to be used by Qvain form"""

from marshmallow import ValidationError
from flask import request
from flask_restful import reqparse, Resource

from etsin_finder.auth import authentication
from etsin_finder.log import log

from etsin_finder.utils.utils import (
    slice_array_on_limit,
    datetime_to_header
)
from etsin_finder.schemas.qvain_dataset_schema_v2 import (
    validate,
    FileActionsValidationSchema,
)
from etsin_finder.utils.qvain_utils_v2 import (
    data_to_metax,
    check_dataset_creator,
    check_authentication,
    remove_deleted_datasets_from_results,
    edited_data_to_metax,
    get_encoded_access_granter,
)

from etsin_finder.services.qvain_service_v2 import MetaxQvainAPIServiceV2

from etsin_finder.utils.log_utils import log_request


TOTAL_ITEM_LIMIT = 1000

class FileCharacteristics(Resource):
    """REST endpoint for updating file_characteristics of a file."""

    def __init__(self):
        """Setup arguments"""
        self.parser = reqparse.RequestParser()

    def _update_characteristics(self, file_id, replace=False):
        """Update file_characteristics of a file.

        Args:
            file_id (str): File identifier.

        Returns:
            Metax response.

        """
        if request.content_type != 'application/json':
            return 'Expected content-type application/json', 403

        service = MetaxQvainAPIServiceV2()
        file_obj = service.get_file(file_id)
        project_identifier = file_obj.get('project_identifier')
        user_ida_projects = authentication.get_user_ida_projects() or []

        if project_identifier not in user_ida_projects:
            log.warning('User not authenticated or does not have access to project {0} for file {1}'.format(project_identifier, file_id))
            return 'Project missing from user or user is not authenticated', 403

        try:
            new_characteristics = request.json
        except Exception as e:
            return str(e), 400

        characteristics = file_obj.get('file_characteristics', {})

        # Make sure that only fields specified here are changed
        allowed_fields = {
            "file_format", "format_version", "encoding",
            "csv_delimiter", "csv_record_separator", "csv_quoting_char", "csv_has_header"
        }
        for key, value in new_characteristics.items():
            if (key not in characteristics) or (characteristics[key] != value):
                if key not in allowed_fields:
                    return "Changing field {} is not allowed".format(key), 400

        if replace:
            for key in allowed_fields:
                if key in characteristics:
                    del characteristics[key]

        # Update file_characteristics with new values
        characteristics.update(new_characteristics)
        data = {
            'file_characteristics': characteristics
        }

        return service.patch_file(file_id, data)

    @log_request
    def put(self, file_id):
        """Replace file_characteristics with supplied values."""
        return self._update_characteristics(file_id, replace=True)

    @log_request
    def patch(self, file_id):
        """Update file_characteristics with supplied values."""
        return self._update_characteristics(file_id)


class QvainDatasets(Resource):
    """Listing and creating Metax datasets for logged in user in Qvain."""

    def __init__(self):
        """Setup required utils for dataset metadata handling"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('draft', type=bool, required=False)

        # Datasets listing parameters
        self.parser.add_argument('limit', type=str, required=False)
        self.parser.add_argument('offset', type=str, required=False)
        self.parser.add_argument('no_pagination', type=bool, required=False)

    @log_request
    def get(self):
        """
        Get datasets for current user. Used by the Qvain dataset table. If request has query parameter no_pagination=true, fetches ALL datasets for user (warning: might result in performance issue).

        Used by the Qvain dataset table. If request has query parameter no_pagination=true,
        fetches ALL datasets for user (warning: might result in performance issue).

        Args:
            user_id (str): User identifier.

        Returns:
            tuple: Response with user datasets if successfull.

        """
        # Return data only if authenticated
        error = check_authentication()
        if error is not None:
            return error

        args = self.parser.parse_args()
        limit = args.get('limit', None)
        offset = args.get('offset', None)
        no_pagination = args.get('no_pagination', None)

        user_id = authentication.get_user_csc_name()
        service = MetaxQvainAPIServiceV2()
        result = service.get_datasets_for_user(user_id, limit, offset, no_pagination)
        if result:
            # Limit the amount of items to be sent to the frontend
            if 'results' in result:
                # Remove the datasets that have the metax property 'removed': True
                result = remove_deleted_datasets_from_results(result)
                result['results'] = slice_array_on_limit(result.get('results', []), TOTAL_ITEM_LIMIT)
            # If no datasets are created, an empty response should be returned, without error
            if result == 'no datasets':
                return '', 200
            return result, 200
        log.warning('User not authenticated or result for user_id is invalid\nuser_id: {0}'.format(user_id))
        return '', 404

    @log_request
    def post(self):
        """Create a dataset to Metax with the form data from the frontend.

        Returns:
            The response from metax or if error an error message.

        """
        error = check_authentication()
        if error is not None:
            return error

        params = {}
        args = self.parser.parse_args()
        draft = args.get('draft')
        if draft:
            params['draft'] = 'true'

        try:
            data = validate(request.data, params)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        metadata_provider_org = authentication.get_user_home_organization_id()
        metadata_provider_user = authentication.get_user_csc_name()

        if not metadata_provider_org or not metadata_provider_user:
            log.warning("The Metadata provider is not specified\n")
            return {"PermissionError": "The Metadata provider is not found in login information."}, 401

        if data["useDoi"] is True:
            params["pid_type"] = 'doi'

        metax_ready_data = data_to_metax(data, metadata_provider_org, metadata_provider_user)

        log.debug(f'metax ready data {metax_ready_data}')

        params["access_granter"] = get_encoded_access_granter()

        service = MetaxQvainAPIServiceV2()
        metax_response = service.create_dataset(metax_ready_data, params)
        return metax_response


class QvainDataset(Resource):
    """Single Qvain dataset."""

    @log_request
    def get(self, cr_id):
        """
        Get dataset for editing from Metax. Returns with an error if the logged in user does not own the requested dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns:
            [type] -- Metax response.

        """
        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        service = MetaxQvainAPIServiceV2()
        response, status = service.get_dataset(cr_id)
        return response, status

    @log_request
    def patch(self, cr_id):
        """Update existing dataset.

        Returns:
            The response from metax or if error an error message.

        """
        params = {}
        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        try:
            data = validate(request.data, params)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        if not data.get("original"):
            return {"Error": "Missing original dataset."}, 400

        original_cr_id = data["original"].get("identifier")
        if cr_id != original_cr_id:
            return {"Error": "Changing dataset identifier is not allowed."}, 400
        original = data["original"]

        # If date_modified not present, then the dataset has not been modified
        # after it was created, use date_created instead
        last_edit = original.get('date_modified') or original.get('date_created')
        if not last_edit:
            log.error('Could not find date_modified or date_created from dataset.')
            return 'Error getting dataset creation or modification date.', 500

        last_edit_converted = datetime_to_header(last_edit)
        if not last_edit_converted:
            log.error('Could not convert last_edit: {0} to http datetime.\nlast_edit is of type: {1}'.format(last_edit, type(last_edit)))
            return 'Error in dataset creation or modification date..', 500

        log.info('Converted datetime from metax: {0} to HTTP datetime: {1}'.format(last_edit, last_edit_converted))
        del data["original"]

        log.debug(f'in patch: data: {data}')

        metax_ready_data = edited_data_to_metax(data, original)

        log.debug(f'in patch: metax_ready_data.data_catalog: {metax_ready_data.get("data_catalog", "no catalog")}')

        params = {}
        params["access_granter"] = get_encoded_access_granter()
        service = MetaxQvainAPIServiceV2()
        metax_response = service.update_dataset(metax_ready_data, cr_id, last_edit_converted, params)
        log.debug("METAX RESPONSE: \n{0}".format(metax_response))
        return metax_response

    @log_request
    def delete(self, cr_id):
        """
        Delete dataset from Metax. Returns with an error if the logged in user does not own the requested dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns:
            Metax response.

        """
        # only creator of the dataset is allowed to delete it
        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        service = MetaxQvainAPIServiceV2()
        metax_response = service.delete_dataset(cr_id)
        return metax_response


class QvainDatasetFiles(Resource):
    """Update files of a dataset."""

    def __init__(self):
        """Setup endpoint"""
        self.validationSchema = FileActionsValidationSchema()

    @log_request
    def post(self, cr_id):
        """Add or remove files for dataset.

        Arguments:
            cr_id (str): Identifier of dataset.

        Returns:
            Metax response.

        """
        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        try:
            data = self.validationSchema.loads(request.data)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        ida_projects = authentication.get_user_ida_projects()
        if ida_projects is None:
            return {"IdaError": "Error in IDA group user permission or in IDA user groups."}, 403

        # Make Metax check that files belong to projects that the user is allowed to use
        params = {
            "allowed_projects": ",".join(ida_projects)
        }

        service = MetaxQvainAPIServiceV2()
        response, status = service.update_dataset_files(cr_id, data, params)
        if status != 200:
            return response, status

        return response, status
