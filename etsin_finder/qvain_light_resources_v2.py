# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RESTful API endpoints, meant to be used by Qvain Light form"""

from functools import wraps
import inspect
from marshmallow import ValidationError
from flask import request, session
from flask_mail import Message
from flask_restful import abort, reqparse, Resource
import json

from etsin_finder.app_config import get_app_config
from etsin_finder import authentication
from etsin_finder import authorization
from etsin_finder import cr_service
from etsin_finder.finder import app
from etsin_finder.utils import \
    sort_array_of_obj_by_key, \
    slice_array_on_limit, \
    datetime_to_header
from etsin_finder.constants import SAML_ATTRIBUTES
from etsin_finder.qvain_light_dataset_schema_v2 import (
    DatasetValidationSchema,
    FileActionsValidationSchema,
    UserMetadataValidationSchema
)
from etsin_finder.qvain_light_utils_v2 import (
    data_to_metax,
    get_dataset_creator,
    check_dataset_creator,
    remove_deleted_datasets_from_results,
    edited_data_to_metax,
    get_encoded_access_granter,
    get_user_ida_projects
)

from etsin_finder.qvain_light_service_v2 import (
    create_dataset,
    update_dataset,
    get_datasets_for_user,
    get_directory_for_project,
    get_directory,
    get_file,
    patch_file,
    get_dataset,
    get_dataset_projects,
    get_dataset_user_metadata,
    update_dataset_user_metadata,
    delete_dataset,
    update_dataset_files
)

log = app.logger

TOTAL_ITEM_LIMIT = 1000

def log_request(f):
    """
    Log request when used as decorator.

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
        csc_name = authentication.get_user_csc_name() if not app.testing else ''
        log.info('[{0}.{1}] {2} {3} {4} USER AGENT: {5}'.format(
            args[0].__class__.__name__,
            f.__name__,
            csc_name if csc_name else 'UNAUTHENTICATED',
            request.environ['REQUEST_METHOD'],
            request.path,
            request.user_agent))
        return f(*args, **kwargs)
    return func


class ProjectFiles(Resource):
    """File/directory related REST endpoints for getting project directory"""

    def __init__(self):
        """Setup file endpoints"""

    @log_request
    def get(self, pid):
        """
        Get files and directory objects for frontend.

        :param pid:
        :return:
        """
        # Return data only if user is a member of the project
        user_ida_projects = get_user_ida_projects() or []
        if pid in user_ida_projects:
            project_dir_obj = get_directory_for_project(pid)
        else:
            project_dir_obj = None

        if project_dir_obj:
            # Sort the items
            sort_array_of_obj_by_key(project_dir_obj.get('directories', []), 'directory_name')
            sort_array_of_obj_by_key(project_dir_obj.get('files', []), 'file_name')

            # Limit the amount of items to be sent to the frontend
            if 'directories' in project_dir_obj:
                project_dir_obj['directories'] = slice_array_on_limit(project_dir_obj['directories'], TOTAL_ITEM_LIMIT)
            if 'files' in project_dir_obj:
                project_dir_obj['files'] = slice_array_on_limit(project_dir_obj['files'], TOTAL_ITEM_LIMIT)

            return project_dir_obj, 200
        log.warning('User is missing project or project_dir_obj is invalid\npid: {0}'.format(pid))
        return '', 404

class FileDirectory(Resource):
    """File/directory related REST endpoints for getting a directory"""

    def __init__(self):
        """Setup file endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('not_cr_identifier', type=str, action='append', required=False)
        self.parser.add_argument('cr_identifier', type=str, action='append', required=False)
        self.parser.add_argument('pagination', type=bool, action='append', required=False)
        self.parser.add_argument('offset', type=str, action='append', required=False)
        self.parser.add_argument('limit', type=str, action='append', required=False)
        self.parser.add_argument('directory_fields', type=str, action='append', required=False)
        self.parser.add_argument('file_fields', type=str, action='append', required=False)

    @log_request
    def get(self, dir_id):
        """
        Get files and directory objects for frontend.

        :param dir_id:
        :return:
        """
        args = self.parser.parse_args()
        not_cr_identifier = args.get('not_cr_identifier', None)
        cr_identifier = args.get('cr_identifier', None)
        pagination = args.get('pagination', None)
        limit = args.get('limit', None)
        offset = args.get('offset', None)
        directory_fields = args.get('directory_fields', None)
        file_fields = args.get('file_fields', None)

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

        if cr_identifier is not None and not_cr_identifier is not None:
            return 'Parameters cr_identifier and not_cr_identifier are exclusive', 403

        params = {}
        if cr_identifier:
            params['cr_identifier'] = cr_identifier
        if not_cr_identifier:
            params['not_cr_identifier'] = not_cr_identifier
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

        dir_obj = get_directory(dir_id, params)

        # Return data only if authenticated
        if dir_obj and authentication.is_authenticated():
            # Limit the amount of items to be sent to the frontend
            if 'directories' in dir_obj:
                dir_obj['directories'] = slice_array_on_limit(dir_obj['directories'], TOTAL_ITEM_LIMIT)
            if 'files' in dir_obj:
                dir_obj['files'] = slice_array_on_limit(dir_obj['files'], TOTAL_ITEM_LIMIT)
            return dir_obj, 200
        log.warning('User not authenticated or dir_obj is invalid\ndir_id: {0}'.format(dir_id))
        return '', 404

class FileCharacteristics(Resource):
    """REST endpoint for updating file_characteristics of a file."""

    def __init__(self):
        """Setup arguments"""
        self.parser = reqparse.RequestParser()

    @log_request
    def patch(self, file_id):
        """
        Update file_characteristics of a file.

        Arguments:
            file {object} -- File object as json, should contain a file_characteristics object that will be updated.

        Returns:
            [type] -- Metax response.

        """
        if request.content_type != 'application/json':
            return 'Expected content-type application/json', 403

        file_obj = get_file(file_id)
        project_identifier = file_obj['project_identifier']
        user_ida_projects = get_user_ida_projects() or []

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

        # Update file_characteristics with new values
        characteristics.update(new_characteristics)
        data = {
            'file_characteristics': characteristics
        }

        return patch_file(file_id, data)


class UserDatasets(Resource):
    """Get user's datasets from the METAX dataset REST API"""

    def __init__(self):
        """Setup endpoint"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('limit', type=str, action='append', required=False)
        self.parser.add_argument('offset', type=str, action='append', required=False)
        self.parser.add_argument('no_pagination', type=bool, action='append', required=False)

    @log_request
    def get(self, user_id):
        """
        Get datasets for user. Used by qvain light dataset table. If request has query parameter no_pagination=true, fetches ALL datasets for user (warning: might result in performance issue).

        :param user_id:
        :return:
        """
        args = self.parser.parse_args()
        limit = args.get('limit', None)
        offset = args.get('offset', None)
        no_pagination = args.get('no_pagination', None)

        result = get_datasets_for_user(user_id, limit, offset, no_pagination)
        # Return data only if authenticated
        if result and authentication.is_authenticated():
            # Limit the amount of items to be sent to the frontend
            if 'results' in result:
                # Remove the datasets that have the metax property 'removed': True
                result = remove_deleted_datasets_from_results(result)
                result['results'] = slice_array_on_limit(result['results'], TOTAL_ITEM_LIMIT)
            # If no datasets are created, an empty response should be returned, without error
            if (result == 'no datasets'):
                return '', 200
            return result, 200
        log.warning('User not authenticated or result for user_id is invalid\nuser_id: {0}'.format(user_id))
        return '', 404

class QvainDataset(Resource):
    """POST and PATCH request handling coming in from Qvain Light. Used for adding/editing datasets in METAX."""

    def __init__(self):
        """Setup required utils for dataset metadata handling"""
        self.validationSchema = DatasetValidationSchema()
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('draft', type=bool, action='append', required=False)

    @log_request
    def post(self):
        """
        Create a dataset to Metax with the form data from the frontend.

        Returns:
            object -- The response from metax or if error an error message.

        """
        params = {}
        args = self.parser.parse_args()
        draft = args.get('draft')
        if draft:
            params['draft'] = 'true'

        is_authd = authentication.is_authenticated()
        if not is_authd:
            return {"PermissionError": "User not logged in."}, 401
        try:
            data = self.validationSchema.loads(request.data)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400
        try:
            metadata_provider_org = session["samlUserdata"]["urn:oid:1.3.6.1.4.1.25178.1.2.9"][0]
            metadata_provider_user = session["samlUserdata"]["urn:oid:1.3.6.1.4.1.16161.4.0.53"][0]
        except KeyError as err:
            log.warning("The Metadata provider is not specified: \n{0}".format(err))
            return {"PermissionError": "The Metadata provider is not found in login information."}, 401

        if data["useDoi"] is True:
            params["pid_type"] = 'doi'

        metax_ready_data = data_to_metax(data, metadata_provider_org, metadata_provider_user)

        params["access_granter"] = get_encoded_access_granter()
        metax_response = create_dataset(metax_ready_data, params)
        return metax_response

    @log_request
    def patch(self):
        """
        Update existing dataset.

        Returns:
            object -- The response from metax or if error an error message.

        """
        params = {}
        args = self.parser.parse_args()
        draft = args.get('draft')
        if draft:
            params['draft'] = 'true'

        is_authd = authentication.is_authenticated()
        if not is_authd:
            return {"PermissionError": "User not logged in."}, 401
        try:
            data = self.validationSchema.loads(request.data)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400
        cr_id = data["original"]["identifier"]
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

        # Only creator of the dataset is allowed to update it
        user = session["samlUserdata"]["urn:oid:1.3.6.1.4.1.16161.4.0.53"][0]
        creator = get_dataset_creator(cr_id)
        if user != creator:
            log.warning('User: \"{0}\" is not the creator of the dataset. Update operation not allowed. Creator: \"{1}\"'.format(user, creator))
            return {"PermissionError": "User not authorized to to edit dataset."}, 403

        metax_ready_data = edited_data_to_metax(data, original)

        params["access_granter"] = get_encoded_access_granter()
        metax_response = update_dataset(metax_ready_data, cr_id, last_edit_converted, params)
        log.debug("METAX RESPONSE: \n{0}".format(metax_response))
        return metax_response

class QvainDatasetEdit(Resource):
    """Get single dataset for editing."""

    @log_request
    def get(self, cr_id):
        """
        Get dataset for editing from Metax. Returns with an error if the logged in user does not own the requested dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns:
            [type] -- Metax response.

        """
        print("V2 dataset_edit")
        log.info("V2 dataset_edit")

        is_authd = authentication.is_authenticated()
        if not is_authd:
            return {"PermissionError": "User not logged in."}, 401
        user = session["samlUserdata"][SAML_ATTRIBUTES["CSC_username"]][0]
        response, status = get_dataset(cr_id)
        if status != 200:
            return response, status
        if user != response.get('metadata_provider_user'):
            log.warning('User: \"{0}\" is not the creator of the dataset. Editing not allowed.'.format(user))
            return {"PermissionError": "User is not allowed to edit the dataset."}, 403

        return response, status


class QvainDatasetFiles(Resource):
    """Update files of a dataset."""

    def __init__(self):
        """Setup endpoint"""
        self.validationSchema = FileActionsValidationSchema()

    @log_request
    def post(self, cr_id):
        """
        Add or remove files for dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns:
            [type] -- Metax response.

        """
        is_authd = authentication.is_authenticated()
        if not is_authd:
            return {"PermissionError": "User not logged in."}, 401
        user = session["samlUserdata"][SAML_ATTRIBUTES["CSC_username"]][0]

        creator = get_dataset_creator(cr_id)
        if user != creator:
            log.warning('User: \"{0}\" is not the creator of the dataset. Editing not allowed.'.format(user))
            return {"PermissionError": "User is not allowed to edit the dataset."}, 403

        try:
            data = self.validationSchema.loads(request.data)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        ida_projects = get_user_ida_projects()
        if ida_projects is None:
            return {"IdaError": "Error in IDA group user permission or in IDA user groups."}, 403

        # Make Metax check that files belong to projects that the user is allowed to use
        params = {
            "allowed_projects": ",".join(ida_projects)
        }

        response, status = update_dataset_files(cr_id, data, params)
        if status != 200:
            return response, status

        return response, status


class QvainDatasetProjects(Resource):
    """Get single dataset for editing."""

    @log_request
    def get(self, cr_id):
        """
        Get list of dataset IDA projects from Metax. Returns with an error if the logged in user does not own the requested dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns:
            [type] -- Metax response.

        """
        log.info("V2 qvain_dataset_projects")

        is_authd = authentication.is_authenticated()
        if not is_authd:
            return {"PermissionError": "User not logged in."}, 401
        user = session["samlUserdata"][SAML_ATTRIBUTES["CSC_username"]][0]

        creator = get_dataset_creator(cr_id)
        if user != creator:
            log.warning('User: \"{0}\" is not the creator of the dataset.'.format(user))
            return {"PermissionError": "User is not the owner of the dataset."}, 403

        metax_response = get_dataset_projects(cr_id)
        return metax_response


class QvainDatasetUserMetadata(Resource):
    """Get user metadata for a single dataset."""

    def __init__(self):
        """Setup endpoint"""
        self.validationSchema = UserMetadataValidationSchema()

    @log_request
    def get(self, cr_id):
        """
        Get user metadata for a dataset.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns:
            [type] -- Metax response.

        """
        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        metax_response = get_dataset_user_metadata(cr_id)
        return metax_response

    def put(self, cr_id):
        """
        Update dataset file/directory metadata.

        Arguments:
            cr_id {str} -- Identifier of dataset.
            body {json} --

        Returns:
            [type] -- Metax response.

        """
        try:
            data = request.json
        except Exception as e:
            return str(e), 400

        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        try:
            data = self.validationSchema.loads(request.data)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        metax_response = update_dataset_user_metadata(cr_id, data)
        return metax_response


class QvainDatasetDelete(Resource):
    """DELETE request handling coming in from Qvain Light. Used for deleting datasets in METAX."""

    @log_request
    def delete(self, cr_id):
        """
        Delete dataset from Metax.

        Arguments:
            config {object} -- Includes 'data' key that has the identifier of the dataset.

        Returns:
            [type] -- Metax response.

        """
        is_authd = authentication.is_authenticated()
        if not is_authd:
            return {"PermissionError": "User not logged in."}, 401

        # only creator of the dataset is allowed to delete it
        user = session["samlUserdata"]["urn:oid:1.3.6.1.4.1.16161.4.0.53"][0]
        creator = get_dataset_creator(cr_id)
        if user != creator:
            log.warning('User: \"{0}\" is not the creator of the dataset. Delete operation not allowed. Creator: \"{1}\"'.format(user, creator))
            return {"PermissionError": "User not authorized to to delete dataset."}, 403

        metax_response = delete_dataset(cr_id)
        return metax_response
