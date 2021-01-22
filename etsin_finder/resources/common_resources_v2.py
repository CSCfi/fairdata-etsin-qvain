# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RESTful API endpoints, meant to be used by Etsin and Qvain"""

from marshmallow import ValidationError
from flask import request
from flask_restful import reqparse, Resource

from etsin_finder.auth import authentication
from etsin_finder.auth import authorization
from etsin_finder.log import log
from etsin_finder.utils.utils import \
    sort_array_of_obj_by_key, \
    slice_array_on_limit
from etsin_finder.schemas.qvain_dataset_schema_v2 import (
    UserMetadataValidationSchema
)
from etsin_finder.utils.qvain_utils_v2 import check_dataset_edit_permission

from etsin_finder.services.common_service_v2 import (
    get_directory_for_project,
    get_dataset_projects,
    get_directory,
    get_dataset_user_metadata,
    update_dataset_user_metadata,
)

from etsin_finder.utils.log_utils import log_request


TOTAL_ITEM_LIMIT = 1000


class ProjectFiles(Resource):
    """File/directory related REST endpoints for getting project directory"""

    def __init__(self):
        """Setup file endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('cr_identifier', type=str, required=False)

    @log_request
    def get(self, pid):
        """
        Get dataset projects from Metax.

        Arguments:
            pid {string} -- The identifier of the project.

        Returns:
            [type] -- Metax response.

        """
        # If cr_identifier is set, retrieve only project files that belong to dataset
        params = {}
        args = self.parser.parse_args()
        cr_identifier = args.get('cr_identifier', None)

        # Unauthenticated users can only access files belonging to a published dataset
        if cr_identifier:
            if not authorization.user_can_view_dataset(cr_identifier):
                return '', 404
            params['cr_identifier'] = cr_identifier
        else:
            if not authentication.is_authenticated():
                return 'The cr_identifier parameter is required if user is not authenticated', 400

        # Return data if user is a member of the project, or if user can view cr_identifier
        user_ida_projects = authentication.get_user_ida_projects() or []

        if cr_identifier or pid in user_ida_projects:
            resp, status = get_directory_for_project(pid, params)
            if status != 200:
                return resp, status
            project_dir_obj = resp
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

class DirectoryFiles(Resource):
    """File/directory related REST endpoints for getting a directory"""

    def __init__(self):
        """Setup file endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('not_cr_identifier', type=str, required=False)
        self.parser.add_argument('cr_identifier', type=str, required=False)
        self.parser.add_argument('pagination', type=bool, required=False)
        self.parser.add_argument('include_parent', type=bool, required=False)
        self.parser.add_argument('offset', type=str, required=False)
        self.parser.add_argument('limit', type=str, required=False)
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

        # Unauthenticated users can only access files belonging to a published dataset
        if cr_identifier:
            if not authorization.user_can_view_dataset(cr_identifier):
                return '', 404
        else:
            if not authentication.is_authenticated():
                return 'The cr_identifier parameter is required if user is not authenticated', 400

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
                "file_type",
                "byte_size",
                "checksum_value",
                "checksum_algorithm"
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
                "title",
                "byte_size"
            ])

        if cr_identifier is not None and not_cr_identifier is not None:
            return 'Parameters cr_identifier and not_cr_identifier are exclusive', 400

        params = {
            'include_parent': 'true' # always include parent so we can check the parent directory project_identifier
        }
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

        resp, status = get_directory(dir_id, params)
        if status != 200:
            return resp, status

        dir_obj = resp
        if dir_obj:
            if not cr_identifier:
                # Return data only if user has access to project
                user_ida_projects = authentication.get_user_ida_projects() or []
                project_identifier = dir_obj.get('project_identifier') or dir_obj.get('results', {}).get('project_identifier')
                if project_identifier not in user_ida_projects:
                    log.warning('Directory not in user projects: {0}'.format(dir_id))
                    return '', 404

            # Limit the amount of items to be sent to the frontend
            if 'directories' in dir_obj:
                dir_obj['directories'] = slice_array_on_limit(dir_obj['directories'], TOTAL_ITEM_LIMIT)
            if 'files' in dir_obj:
                dir_obj['files'] = slice_array_on_limit(dir_obj['files'], TOTAL_ITEM_LIMIT)

            return dir_obj, 200
        log.warning('Error: dir_obj is invalid\ndir_id: {0}'.format(dir_id))
        return '', 404


class DatasetProjects(Resource):
    """Get list of dataset IDA projects."""

    @log_request
    def get(self, cr_id):
        """
        Get list of dataset IDA projects from Metax.

        Arguments:
            cr_id {str} -- Identifier of dataset.

        Returns:
            [type] -- Metax response.

        """
        # Unauthenticated users can only access files belonging to a published dataset
        if not authorization.user_can_view_dataset(cr_id):
            return '', 404

        metax_response = get_dataset_projects(cr_id)
        return metax_response


class DatasetUserMetadata(Resource):
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
        # Unauthenticated users can only access files belonging to a published dataset
        if not authorization.user_can_view_dataset(cr_id):
            return '', 404

        metax_response = get_dataset_user_metadata(cr_id)
        return metax_response

    @log_request
    def put(self, cr_id):
        """
        Update dataset file/directory metadata.

        Arguments:
            cr_id {str} -- Identifier of dataset.
            body {json} -- Metadata updates.

        Returns:
            [type] -- Metax response.

        """
        try:
            data = request.json
        except Exception as e:
            return str(e), 400

        error = check_dataset_edit_permission(cr_id)
        if error is not None:
            return error

        try:
            data = self.validationSchema.loads(request.data)
        except ValidationError as err:
            log.warning("Invalid form data: {0}".format(err.messages))
            return err.messages, 400

        metax_response = update_dataset_user_metadata(cr_id, data)
        return metax_response
