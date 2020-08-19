# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RPC API endpoints, meant to be used by Qvain Light form"""

from functools import wraps
import inspect
from flask import request, session
from flask_restful import abort, reqparse, Resource

from etsin_finder.app_config import get_app_config
from etsin_finder import authentication
from etsin_finder.qvain_light_service import change_cumulative_state, refresh_directory_content, fix_deprecated_dataset
from etsin_finder.finder import app
from etsin_finder.qvain_light_utils import get_dataset_creator, check_dataset_creator
from etsin_finder.constants import SAML_ATTRIBUTES
from etsin_finder.log_utils import log_request

log = app.logger

class QvainDatasetChangeCumulativeState(Resource):
    """Metax RPC for changing cumulative_state of a dataset."""

    def __init__(self):
        """Setup endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('identifier', type=str, required=True)
        self.parser.add_argument('cumulative_state', type=int, required=True)

    @log_request
    def post(self):
        """Change cumulative_state of a dataset in Metax.

        Arguments:
            identifier (string): The identifier of the dataset.
            cumulative_state (int): The new cumulative state.

        Returns:
            Metax response.

        """
        args = self.parser.parse_args()
        cr_id = args.get('identifier')
        cumulative_state = args.get('cumulative_state')

        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        metax_response = change_cumulative_state(cr_id, cumulative_state)
        return metax_response

class QvainDatasetRefreshDirectoryContent(Resource):
    """Metax RPC for refreshing directory content in a dataset."""

    def __init__(self):
        """Setup endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('cr_identifier', type=str, required=True)
        self.parser.add_argument('dir_identifier', type=str, required=True)

    @log_request
    def post(self):
        """Refresh contents of a directory in a dataset.

        May create a new dataset version.

        Arguments:
            cr_identifier (str): The identifier of the dataset.
            dir_identifier (str): The identifier of the directory.

        Returns:
            Metax response.

        """
        args = self.parser.parse_args()
        cr_identifier = args.get('cr_identifier')
        dir_identifier = args.get('dir_identifier')

        error = check_dataset_creator(cr_identifier)
        if error is not None:
            return error

        metax_response = refresh_directory_content(cr_identifier, dir_identifier)
        return metax_response


class QvainDatasetFixDeprecated(Resource):
    """Metax RPC for fixing a deprecated dataset."""

    def __init__(self):
        """Setup endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('identifier', type=str, required=True)

    @log_request
    def post(self):
        """Fix deprecated dataset using Metax fix_deprecated RPC.

        Removes all files and directories that no longer exist from the dataset.
        Creates a new, non-deprecated version.

        Arguments:
            identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        args = self.parser.parse_args()
        cr_id = args.get('identifier')

        error = check_dataset_creator(cr_id)
        if error is not None:
            return error

        metax_response = fix_deprecated_dataset(cr_id)
        return metax_response
