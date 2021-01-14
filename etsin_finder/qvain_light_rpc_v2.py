# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RPC API endpoints, meant to be used by the Qvain form"""

from flask_restful import reqparse, Resource

from etsin_finder.qvain_light_service_v2 import (
    change_cumulative_state,
    create_new_version,
    publish_dataset,
    merge_draft,
    create_draft
)
from etsin_finder.log_utils import log_request
from etsin_finder.qvain_light_utils_v2 import check_dataset_edit_permission


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
        cr_id = args.get('identifier')
        cumulative_state = args.get('cumulative_state')
        error = check_dataset_edit_permission(cr_id)
        if error is not None:
            return error
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
        cr_id = args.get('identifier')
        err = check_dataset_edit_permission(cr_id)
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
        cr_id = args.get('identifier')
        err = check_dataset_edit_permission(cr_id)
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
        cr_id = args.get('identifier')
        err = check_dataset_edit_permission(cr_id)
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
        cr_id = args.get('identifier')
        err = check_dataset_edit_permission(cr_id)
        if err is not None:
            return err
        metax_response = publish_dataset(cr_id)
        return metax_response
