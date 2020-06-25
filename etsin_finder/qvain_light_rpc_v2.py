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
from etsin_finder.qvain_light_service_v2 import (
    change_cumulative_state, fix_deprecated_dataset, create_new_version, publish_dataset, merge_draft, create_draft
)
from etsin_finder.finder import app
from etsin_finder.qvain_light_utils import get_dataset_creator
from etsin_finder.utils import SAML_ATTRIBUTES

from etsin_finder.qvain_light_utils_v2 import (
    check_dataset_creator
)

log = app.logger

def log_request(f):
    """Log request when used as decorator."""
    @wraps(f)
    def func(*args, **kwargs):
        """Log requests."""
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
            identifier (str): The identifier of the dataset.
            cumulative_state (int): The new cumulative state.

        Returns:
            Metax response.

        """
        args = self.parser.parse_args()
        cr_id = args['identifier']
        cumulative_state = args['cumulative_state']
        is_authd = authentication.is_authenticated()
        if not is_authd:
            return {"PermissionError": "User not logged in."}, 401

        # only creator of the dataset is allowed to modify it
        user = session["samlUserdata"][SAML_ATTRIBUTES["CSC_username"]][0]
        creator = get_dataset_creator(cr_id)
        if user != creator:
            log.warning('User: \"{0}\" is not the creator of the dataset. Changing cumulative state not allowed. Creator: \"{1}\"'.format(user, creator))
            return {"PermissionError": "User not authorized to change cumulative state of dataset."}, 403
        metax_response = change_cumulative_state(cr_id, cumulative_state)
        return metax_response


class QvainDatasetCreateNewVersion(Resource):
    """Metax RPC for creating a new dataset version draft."""

    def __init__(self):
        """Setup endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('identifier', type=str, required=True)

    @log_request
    def post(self):
        """Create new dataset draft version.

        Also removes all files and directories that no longer exist from the dataset.

        Arguments:
            identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        args = self.parser.parse_args()
        cr_id = args['identifier']
        err = check_dataset_creator(cr_id)
        if err is not None:
            return err
        metax_response = create_new_version(cr_id)
        return metax_response


class QvainDatasetCreateDraft(Resource):
    """Metax RPC for creating a draft from a published dataset."""

    def __init__(self):
        """Setup endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('identifier', type=str, required=True)

    @log_request
    def post(self):
        """Create a draft of a published dataset.

        Arguments:
            identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        args = self.parser.parse_args()
        cr_id = args['identifier']
        err = check_dataset_creator(cr_id)
        if err is not None:
            return err
        metax_response = create_draft(cr_id)
        return metax_response


class QvainDatasetMergeDraft(Resource):
    """Metax RPC for merging draft changes to a published dataset."""

    def __init__(self):
        """Setup endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('identifier', type=str, required=True)

    @log_request
    def post(self):
        """Publish a draft of a published dataset.

        Arguments:
            identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        args = self.parser.parse_args()
        cr_id = args['identifier']
        err = check_dataset_creator(cr_id)
        if err is not None:
            return err
        metax_response = merge_draft(cr_id)
        return metax_response


class QvainDatasetPublishDataset(Resource):
    """Metax RPC for publishing an unpublished draft dataset."""

    def __init__(self):
        """Setup endpoints"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('identifier', type=str, required=True)

    @log_request
    def post(self):
        """Publish a draft dataset.

        Arguments:
            identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        args = self.parser.parse_args()
        cr_id = args['identifier']
        err = check_dataset_creator(cr_id)
        if err is not None:
            return err
        metax_response = publish_dataset(cr_id)
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
        cr_id = args['identifier']
        is_authd = authentication.is_authenticated()
        if not is_authd:
            return {"PermissionError": "User not logged in."}, 401

        # only creator of the dataset is allowed to modify it
        user = session["samlUserdata"][SAML_ATTRIBUTES["CSC_username"]][0]
        creator = get_dataset_creator(cr_id)
        if user != creator:
            log.warning('User: \"{0}\" is not the creator of the dataset. Fixing deprecated dataset not allowed. Creator: \"{1}\"'.format(user, creator))
            return {"PermissionError": "User not authorized to fix deprecated dataset."}, 403
        metax_response = fix_deprecated_dataset(cr_id)
        return metax_response
