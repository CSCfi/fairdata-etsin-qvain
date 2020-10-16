# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Download API v2 endpoints"""

from flask import session, redirect
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

class Requests(Resource):
    """Class for generating and retrieving download package requests."""

    def __init__(self):
        """Setup endpoint"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('cr_id', type=str, required=True)

    def get(self):
        """Get download package requests.

        Returns:
            Response from download service.

        """
        args = self.parser.parse_args()
        cr_id = args.get('cr_id')
        check_download_permission(cr_id)
        return download_service.get_requests(cr_id)


class Authorize(Resource):
    """Class for requesting download authorizations."""

    def __init__(self):
        """Setup endpoint"""
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('cr_id', type=str, required=True)
        self.parser.add_argument('file', type=str, required=False) # file path
        self.parser.add_argument('package', type=str, required=False) # package name

    @log_request
    def post(self):
        """
        Authorize file or package for download

        Returns:
            Object with the dowload URL, or error from download service.

        """
        args = self.parser.parse_args()
        file = args.get('file')
        package = args.get('package')

        if not (file or package):
            return "Either 'file' or 'package' query parameter required", 400
        if file and package:
            return "Specify either 'file' or 'package', not both", 400

        cr_id = args.get('cr_id')
        check_download_permission(cr_id)

        resp, status = download_service.authorize(cr_id, file=file, package=package)
        if status != 200:
            return resp, status

        token = resp.get('token')
        if not token:
            return "Token missing from response", 500

        return { 'url': download_service.get_download_url(token) }
