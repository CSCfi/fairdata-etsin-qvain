# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""RPC API endpoints, meant to be used by the Qvain form"""

from flask_restful import reqparse, Resource

from etsin_finder.services.qvain_service_v2 import MetaxQvainAPIServiceV2
from etsin_finder.utils.log_utils import log_request
from etsin_finder.utils.qvain_utils_v2 import check_dataset_creator


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
        error = check_dataset_creator(cr_id)
        if error is not None:
            return error
        service = MetaxQvainAPIServiceV2()
        metax_response = service.change_cumulative_state(cr_id, cumulative_state)
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
        err = check_dataset_creator(cr_id)
        if err is not None:
            return err
        service = MetaxQvainAPIServiceV2()
        metax_response = service.create_new_version(cr_id)
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
        err = check_dataset_creator(cr_id)
        if err is not None:
            return err
        service = MetaxQvainAPIServiceV2()
        metax_response = service.create_draft(cr_id)
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
        err = check_dataset_creator(cr_id)
        if err is not None:
            return err
        service = MetaxQvainAPIServiceV2()
        metax_response = service.merge_draft(cr_id)
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
        err = check_dataset_creator(cr_id)
        if err is not None:
            return err
        service = MetaxQvainAPIServiceV2()
        metax_response = service.publish_dataset(cr_id)
        return metax_response
