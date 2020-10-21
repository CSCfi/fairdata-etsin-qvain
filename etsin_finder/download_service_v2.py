# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Functionalities for download data from Download API v2"""

from flask import Response, stream_with_context
import requests
from urllib import parse

from etsin_finder.request_utils import make_request
from etsin_finder.app_config import get_download_api_v2_config
from etsin_finder.app import app
from etsin_finder.log import log

from etsin_finder.utils import FlaskService, format_url


class DownloadAPIService(FlaskService):
    """Download API Service"""

    def __init__(self, app):
        """Setup Download API Service.

        Args:
            app (object): flask.Flask object instance.

        """
        super().__init__(app)

        dl_api_config = get_download_api_v2_config(app.testing)
        if dl_api_config:
            host = dl_api_config.get('HOST')
            port = dl_api_config.get('PORT')

            self.API_BASE_URL = f'https://{host}:{port}'
            self.REQUESTS_URL = f'{self.API_BASE_URL}/requests'
            self.AUTHORIZE_URL = f'{self.API_BASE_URL}/authorize'
            self.DOWNLOAD_URL = f'{self.API_BASE_URL}/download'
            self.verify_ssl = True
        else:
            log.error('Unable to initialize DownloadAPIService (v2) due to missing config')

    def _get_args(self, **kwargs):
        """Get default args for request, allow overriding with kwargs."""
        args = dict(headers={'Accept': 'application/json', 'Content-Type': 'application/json'},
                    # auth=(self.user, self.pw),
                    verify=self.verify_ssl,
                    timeout=10)
        args.update(kwargs)
        return args

    def get_requests(self, dataset):
        """Get package generation requests for dataset"""
        params = {
            'dataset': dataset
        }
        resp, status, success = make_request(requests.get,
                                             self.REQUESTS_URL,
                                             params=params,
                                             )
        if status == 404:
            return {}, 404
        if not success:
            log.warning(f"Failed to get requests for dataset {dataset}")
        return resp, status

    def post_request(self, dataset, scope):
        """Post package generation request for dataset"""
        params = {
            'dataset': dataset,
        }
        if scope:
            params['scope'] = scope
        resp, status, success = make_request(requests.post,
                                             self.REQUESTS_URL,
                                             json=params,
                                             )
        if status == 404:
            return {}, 404
        if not success:
            log.warning(f"Failed to create requests for dataset {dataset} with scope {scope}")
        return resp, status

    def authorize(self, dataset, file=None, package=None):
        """Get package generation requests for dataset"""
        params = {
            'dataset': dataset
        }
        if file:
            params['file'] = file
        if package:
            params['package'] = package

        resp, status, success = make_request(requests.post,
                                             self.AUTHORIZE_URL,
                                             json=params,
                                             )
        if status == 404:
            return {}, 404

        if not success:
            log.warning(f"Failed to get requests for dataset {dataset}")

        return resp, status

    def get_download_url(self, token):
        """Create download URL from token"""
        return f'{self.DOWNLOAD_URL}?token={token}'

download_service = DownloadAPIService(app)
