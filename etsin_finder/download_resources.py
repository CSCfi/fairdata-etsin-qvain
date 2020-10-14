# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Download API v2 endpoints"""

from flask import session
from flask_mail import Message
from flask_restful import abort, reqparse, Resource

from etsin_finder import authentication
from etsin_finder import authorization
from etsin_finder import cr_service
from etsin_finder.download_service_v2 import download_service
from etsin_finder.log import log

from etsin_finder.log_utils import log_request


def check_download_permission(cr_id):
    """Abort if user is not allowed to download files from dataset."""
    if not authorization.user_can_view_dataset(cr_id):
        abort(404)

    cr = cr_service.get_catalog_record(cr_id, False, False)
    if not cr:
        abort(400, message="Unable to get catalog record")

    if not authorization.user_is_allowed_to_download_from_ida(cr, authentication.is_authenticated()):
        abort(403, message="Not authorized")
    return True

class DownloadRequests(Resource):
    """Class for generating and retrieving download package requests."""

    def __init__(self):
        """Setup endpoint"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('cr_id', type=str, required=True)

    @log_request
    def get(self):
        """Get download package requets.

        Returns:
            Response from download service.

        """
        args = self.parser.parse_args()
        cr_id = args.get('cr_id')
        check_download_permission(cr_id)
        return download_service.get_requests(cr_id)