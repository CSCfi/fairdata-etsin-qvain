# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RPC API endpoints, meant to be used by the Qvain form"""

from flask import request, current_app
from flask.views import MethodView
from flask_mail import Message
from webargs import fields, validate

from etsin_finder.utils.abort import abort
from etsin_finder.utils.parser import parser
from etsin_finder.services.qvain_service import MetaxQvainAPIService
from etsin_finder.utils.log_utils import log_request
from etsin_finder.utils.qvain_utils import (
    check_dataset_edit_permission,
    check_dataset_edit_permission_and_lock,
)


def get_rpc_args(extra_args=None):
    """Returns parsed arguments for RPC APIs."""
    args = {
        "identifier": fields.Str(required=True, validate=validate.Length(min=1)),
    }
    if extra_args:
        args.update(extra_args)
    return parser.parse(args)


class QvainDatasetChangeCumulativeState(MethodView):
    """Metax RPC for changing cumulative_state of a dataset."""

    @log_request
    def post(self):
        """Change cumulative_state of a dataset in Metax.

        Arguments:
            identifier (str): The identifier of the dataset.
            cumulative_state (int): The new cumulative state.

        Returns:
            Metax response.

        """
        args = get_rpc_args(
            extra_args={
                "cumulative_state": fields.Integer(required=True),
            }
        )
        cr_id = args.get("identifier")
        cumulative_state = args.get("cumulative_state")
        error = check_dataset_edit_permission_and_lock(cr_id)
        if error is not None:
            return error
        service = MetaxQvainAPIService()
        metax_response = service.change_cumulative_state(cr_id, cumulative_state)

        # clear dataset from cache
        current_app.cr_cache.delete(cr_id)
        current_app.cr_permission_cache.delete(cr_id)
        return metax_response


class QvainDatasetCreateNewVersion(MethodView):
    """Metax RPC for creating a new dataset version draft."""

    @log_request
    def post(self):
        """Create new dataset draft version.

        Also removes all files and directories that no longer exist from the dataset.

        Arguments:
            identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        args = get_rpc_args()
        cr_id = args.get("identifier")
        err = check_dataset_edit_permission(cr_id)
        if err is not None:
            return err
        service = MetaxQvainAPIService()
        metax_response = service.create_new_version(cr_id)
        return metax_response


class QvainDatasetCreateDraft(MethodView):
    """Metax RPC for creating a draft from a published dataset."""

    @log_request
    def post(self):
        """Create a draft of a published dataset.

        Arguments:
            identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        args = get_rpc_args()
        cr_id = args.get("identifier")
        err = check_dataset_edit_permission(cr_id)
        if err is not None:
            return err
        service = MetaxQvainAPIService()
        metax_response = service.create_draft(cr_id)
        return metax_response


class QvainDatasetMergeDraft(MethodView):
    """Metax RPC for merging draft changes to a published dataset."""

    @log_request
    def post(self):
        """Publish a draft of a published dataset.

        Arguments:
            identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        args = get_rpc_args()
        cr_id = args.get("identifier")
        err = check_dataset_edit_permission_and_lock(cr_id)
        if err is not None:
            return err
        service = MetaxQvainAPIService()
        metax_response = service.merge_draft(cr_id)

        # clear dataset from cache
        current_app.cr_cache.delete(cr_id)
        current_app.cr_permission_cache.delete(cr_id)
        return metax_response


class QvainDatasetPublishDataset(MethodView):
    """Metax RPC for publishing an unpublished draft dataset."""

    @log_request
    def post(self):
        """Publish a draft dataset.

        Arguments:
            identifier (str): The identifier of the dataset.

        Returns:
            Metax response.

        """
        args = get_rpc_args()
        cr_id = args.get("identifier")
        err = check_dataset_edit_permission_and_lock(cr_id)
        if err is not None:
            return err
        service = MetaxQvainAPIService()
        metax_response = service.publish_dataset(cr_id)

        # clear dataset from permission cache
        current_app.cr_cache.delete(cr_id)
        current_app.cr_permission_cache.delete(cr_id)
        return metax_response
