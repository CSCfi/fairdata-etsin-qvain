# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RESTful API endpoints, meant to be used by Qvain Light form"""

from functools import wraps

from flask import request, session
from flask_mail import Message
from flask_restful import abort, reqparse, Resource

from etsin_finder.app_config import get_app_config
from etsin_finder import authentication
from etsin_finder import authorization
from etsin_finder import cr_service
from etsin_finder import qvain_light_service
from etsin_finder.finder import app
from etsin_finder.utils import \
    sort_array_of_obj_by_key, \
    slice_array_on_limit

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
        user_id = authentication.get_user_id() if not app.testing else ''
        log.info('{0} - {1} - {2} - {3} - {4}'.format(
            request.environ['HTTP_X_REAL_IP'] if 'HTTP_X_REAL_IP' in request.environ else 'N/A',
            user_id if user_id else '',
            request.environ['REQUEST_METHOD'],
            request.path,
            request.user_agent))
        return f(*args, **kwargs)
    return func

class ProjectFiles(Resource):
    """File/directory related REST endpoints for getting project directory"""

    def __init__(self):
        """Setup file endpoints"""

    def get(self, pid):
        """
        Get files and directory objects for frontend.

        :param pid:
        :return:
        """

        project_dir_obj = qvain_light_service.get_directory_for_project(pid)

        # Return data only if authenticated
        if project_dir_obj and authentication.is_authenticated():
            # Sort the items
            sort_array_of_obj_by_key(project_dir_obj.get('directories', []), 'directory_name')
            sort_array_of_obj_by_key(project_dir_obj.get('files', []), 'file_name')

            # Limit the amount of items to be sent to the frontend
            if 'directories' in project_dir_obj:
                project_dir_obj['directories'] = slice_array_on_limit(project_dir_obj['directories'], TOTAL_ITEM_LIMIT)
            if 'files' in project_dir_obj:
                project_dir_obj['files'] = slice_array_on_limit(project_dir_obj['files'], TOTAL_ITEM_LIMIT)

            return project_dir_obj, 200
        return '', 404

class FileDirectory(Resource):
    """File/directory related REST endpoints for getting a directory"""

    def __init__(self):
        """Setup file endpoints"""

    def get(self, dir_id):
        """
        Get files and directory objects for frontend.

        :param dir_id:
        :return:
        """

        dir_obj = qvain_light_service.get_directory(dir_id)

        # Return data only if authenticated
        if dir_obj and authentication.is_authenticated():
            # Sort the items
            sort_array_of_obj_by_key(dir_obj.get('directories', []), 'directory_name')
            sort_array_of_obj_by_key(dir_obj.get('files', []), 'file_name')

            # Limit the amount of items to be sent to the frontend
            if 'directories' in dir_obj:
                dir_obj['directories'] = slice_array_on_limit(dir_obj['directories'], TOTAL_ITEM_LIMIT)
            if 'files' in dir_obj:
                dir_obj['files'] = slice_array_on_limit(dir_obj['files'], TOTAL_ITEM_LIMIT)

            return dir_obj, 200
        return '', 404

class UserDatasets(Resource):
    """Get user's datasets from the METAX dataset REST API"""

    def __init__(self):
        """Setup file endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('limit', type=str, action='append', required=False)
        self.parser.add_argument('offset', type=str, action='append', required=False)

    def get(self, user_id):
        """
        Get files and directory objects for frontend.

        :param dir_id:
        :return:
        """

        args = self.parser.parse_args()
        limit = args.get('limit', None)
        offset = args.get('offset', None)

        result = qvain_light_service.get_datasets_for_user(user_id, limit, offset)

        # Return data only if authenticated
        if result and authentication.is_authenticated():

            # Limit the amount of items to be sent to the frontend
            if 'results' in result:
                result['results'] = slice_array_on_limit(result['results'], TOTAL_ITEM_LIMIT)

            return result, 200
        return '', 404
