# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RESTful API endpoints, meant to be used by the Qvain form"""

from marshmallow import ValidationError
from flask import request
from flask_restful import reqparse, Resource

from etsin_finder.auth import authentication
from etsin_finder.log import log

from etsin_finder.utils.utils import \
    sort_array_of_obj_by_key, \
    slice_array_on_limit, \
    datetime_to_header
from etsin_finder.utils.constants import DATA_CATALOG_IDENTIFIERS
from etsin_finder.schemas.qvain_dataset_schema import DatasetValidationSchema
from etsin_finder.utils.qvain_utils import (
    data_to_metax,
    remove_deleted_datasets_from_results,
    edited_data_to_metax,
    check_if_data_in_user_IDA_project,
    get_encoded_access_granter,
    check_dataset_creator,
    check_authentication,
)
from etsin_finder.utils.log_utils import log_request
from etsin_finder.services.qvain_service import MetaxQvainAPIService


TOTAL_ITEM_LIMIT = 1000


class ProjectFiles(Resource):
    """File/directory related REST endpoints for getting project directory"""

    def __init__(self):
        """Setup file endpoints"""

    @log_request
    def get(self, pid):
        """Get files and directory objects for frontend.

        Args:
            pid (str): Identifier.

        Returns:
            tuple: A response with the payload in the first
            slot and the status code in the second.

        """
        # Return data only if user is a member of the project
        user_ida_projects = authentication.get_user_ida_projects() or []
        if pid in user_ida_projects:
            service = MetaxQvainAPIService()
            project_dir_obj = service.get_directory_for_project(pid)
        else:
            project_dir_obj = None

        if project_dir_obj:
            # Sort the items
            sort_array_of_obj_by_key(project_dir_obj.get('directories', []),
                                     'directory_name')
            sort_array_of_obj_by_key(project_dir_obj.get('files', []),
                                     'file_name')

            # Limit the amount of items to be sent to the frontend
            if 'directories' in project_dir_obj:
                project_dir_obj['directories'] = slice_array_on_limit(
                    project_dir_obj.get('directories', []),
                    TOTAL_ITEM_LIMIT)
            if 'files' in project_dir_obj:
                project_dir_obj['files'] = slice_array_on_limit(
                    project_dir_obj.get('files', []),
                    TOTAL_ITEM_LIMIT)

            return project_dir_obj, 200
        log.warning('User is missing project or project_dir_obj is invalid\npid: {0}'.format(pid))
        return '', 404


class DirectoryFiles(Resource):
    """File/directory related REST endpoints for getting a directory"""

    def __init__(self):
        """Setup file endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('cr_identifier', type=str, action='append', required=False)
        self.parser.add_argument('pagination', type=bool, action='append', required=False)
        self.parser.add_argument('offset', type=str, action='append', required=False)
        self.parser.add_argument('limit', type=str, action='append', required=False)
        self.parser.add_argument('directory_fields', type=str, action='append', required=False)
        self.parser.add_argument('file_fields', type=str, action='append', required=False)

    @log_request
    def get(self, dir_id):
        """Get files and directory objects for frontend.

        Args:
            dir_id (str): Directory identifier.

        Returns:
            tuple: A response with the payload and the status code.

        """
        args = self.parser.parse_args()
        cr_identifier = args.get('cr_identifier', None)
        pagination = args.get('pagination', None)
        limit = args.get('limit', None)
        offset = args.get('offset', None)
        directory_fields = args.get('directory_fields', None)
        file_fields = args.get('file_fields', None)

        if not authentication.is_authenticated():
            return 'User is not authenticated', 403

        if file_fields is None:
            file_fields = ','.join([
                "file_name",
                "project_identifier",
                "file_characteristics",
                "id",
                "identifier",
                "file_path",
                "description",
                "use_category",
                "title",
                "file_type"
            ])

        if directory_fields is None:
            directory_fields = ','.join([
                "directory_name",
                "project_identifier",
                "id",
                "identifier",
                "directory_path",
                "file_count",
                "description",
                "use_category",
                "title"
            ])

        params = {
            'include_parent': 'true'  # always include parent so we can check the parent directory project_identifier
        }
        if cr_identifier:
            params['cr_identifier'] = cr_identifier
        if pagination:
            params['pagination'] = 'true'
        if limit is not None:
            params['limit'] = limit
        if offset is not None:
            params['offset'] = offset
        if directory_fields:
            params['directory_fields'] = directory_fields
        if file_fields:
            params['file_fields'] = file_fields

        service = MetaxQvainAPIService()
        dir_obj = service.get_directory(dir_id, params)

        # Return data only if user has access to project
        user_ida_projects = authentication.get_user_ida_projects() or []
        project_identifier = dir_obj.get('project_identifier') or dir_obj.get('results', {}).get('project_identifier')
        if project_identifier not in user_ida_projects:
            log.warning('Directory not in user projects: {0}'.format(dir_id))
            return '', 404

        if dir_obj:
            # Limit the amount of items to be sent to the frontend
            if 'directories' in dir_obj:
                dir_obj['directories'] = slice_array_on_limit(dir_obj.get('directories', []), TOTAL_ITEM_LIMIT)
            if 'files' in dir_obj:
                dir_obj['files'] = slice_array_on_limit(dir_obj.get('files', []), TOTAL_ITEM_LIMIT)
            return dir_obj, 200
        log.warning('The dir_obj is invalid\ndir_id: {0}'.format(dir_id))
        return '', 404


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

        service = MetaxQvainAPIService()
        file_obj = service.get_file(file_id)
        project_identifier = file_obj.get('project_identifier')
        user_ida_projects = authentication.get_user_ida_projects() or []

        if project_identifier not in user_ida_projects:
            log.warning('User not authenticated or does not have access to " \
                "project {0} for file {1}'.format(project_identifier, file_id))
            return 'Project missing from user or user " \
                "is not authenticated', 403

        try:
            new_characteristics = request.json
        except Exception as e:
            return str(e), 400

        characteristics = file_obj.get('file_characteristics', {})

        # Make sure that only fields specified here are changed
        allowed_fields = {
            "file_format", "format_version", "encoding",
            "csv_delimiter", "csv_record_separator",
            "csv_quoting_char", "csv_has_header"
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
        self.validationSchema = DatasetValidationSchema()

        # Datasets listing parameters
        self.parser = reqparse.RequestParser()
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
        service = MetaxQvainAPIService()
        result = service.get_datasets_for_user(user_id, limit, offset, no_pagination)
        if result:
            # Limit the amount of items to be sent to the frontend
            if 'results' in result:
                # Remove the datasets that have the metax property 'removed': True
                result = remove_deleted_datasets_from_results(result)
                result['results'] = slice_array_on_limit(result.get('results', []), TOTAL_ITEM_LIMIT)
            # If no datasets are created, an empty response should be returned, without error
            if (result == 'no datasets'):
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
        use_doi = False
        # Return data only if authenticated
        error = check_authentication()
        if error is not None:
            return error

        try:
            data = self.validationSchema.loads(request.data)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        metadata_provider_org = authentication.get_user_home_organization_id()
        metadata_provider_user = authentication.get_user_csc_name()

        if not metadata_provider_org or not metadata_provider_user:
            log.warning("The Metadata provider is not specified\n")
            return {"PermissionError": "The Metadata provider is not found in login information."}, 401

        if data.get("dataCatalog") == DATA_CATALOG_IDENTIFIERS.get('ida'):
            if not check_if_data_in_user_IDA_project(data):
                return {"IdaError":
                        "Error in IDA group user permission or in IDA user groups."}, 403

        if data.get("useDoi") is True:
            use_doi = True

        metax_ready_data = data_to_metax(data, metadata_provider_org,
                                         metadata_provider_user)
        params = {
            "access_granter": get_encoded_access_granter()
        }
        service = MetaxQvainAPIService()
        metax_response = service.create_dataset(metax_ready_data, params, use_doi)
        return metax_response


class QvainDataset(Resource):
    """Single Qvain dataset."""

    def __init__(self):
        """Setup required utils for dataset metadata handling"""
        self.validationSchema = DatasetValidationSchema()

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

        service = MetaxQvainAPIService()
        response, status = service.get_dataset(cr_id)
        return response, status

    @log_request
    def patch(self, cr_id):
        """Update existing dataset.

        Returns:
            The response from metax or if error an error message.

        """
        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        try:
            data = self.validationSchema.loads(request.data)
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

        metax_ready_data = edited_data_to_metax(data, original)

        params = {}
        params["access_granter"] = get_encoded_access_granter()
        service = MetaxQvainAPIService()
        metax_response = service.update_dataset(metax_ready_data, cr_id, last_edit_converted, params)
        log.debug("METAX RESPONSE: \n{0}".format(metax_response))
        return metax_response

    @log_request
    def delete(self, cr_id):
        """
        Delete dataset from Metax.

        Arguments:
            config {object} -- Includes 'data' key that has the identifier of the dataset.

        Returns:
            [type] -- Metax response.

        """
        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        service = MetaxQvainAPIService()
        metax_response = service.delete_dataset(cr_id)
        return metax_response
