# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Functionalities for download data from Download API v2"""

import requests

from etsin_finder.utils.request_utils import make_request
from etsin_finder.app_config import get_download_api_v2_config
from etsin_finder.log import log
from etsin_finder.utils.utils import FlaskService


class DownloadAPIService(FlaskService):
    """Download API Service"""

    def __init__(self, app):
        """Setup Download API Service.

        Args:
            app (object): flask.Flask object instance.

        """
        super().__init__(app)

        dl_api_config = get_download_api_v2_config(app)
        if dl_api_config:
            host = dl_api_config.get('HOST')
            port = dl_api_config.get('PORT')
            user = dl_api_config.get('USER')
            password = dl_api_config.get('PASSWORD')
            public_host = dl_api_config.get('PUBLIC_HOST')
            public_port = dl_api_config.get('PUBLIC_PORT')

            self.API_BASE_URL = f'https://{host}:{port}'
            self.API_PUBLIC_BASE_URL = f'https://{public_host}:{public_port}'
            self.REQUESTS_URL = f'{self.API_BASE_URL}/requests'
            self.AUTHORIZE_URL = f'{self.API_BASE_URL}/authorize'
            self.DOWNLOAD_URL = f'{self.API_PUBLIC_BASE_URL}/download'
            self.verify_ssl = True
            self.auth = None
            if user or password:
                self.auth = (user, password)
            self.proxies = None
            if dl_api_config.get('HTTPS_PROXY'):
                self.proxies = dict(https=dl_api_config.get('HTTPS_PROXY'))
        else:
            log.error('Unable to initialize DownloadAPIService (v2) due to missing config')

    def _get_args(self, **kwargs):
        """Get default args for request, allow overriding with kwargs."""
        args = dict(headers={'Accept': 'application/json', 'Content-Type': 'application/json'},
                    auth=self.auth,
                    verify=self.verify_ssl,
                    timeout=10,
                    proxies=self.proxies)
        args.update(kwargs)
        return args

    def get_requests(self, dataset):
        """Get package generation requests for dataset"""
        params = {
            'dataset': dataset
        }
        args = self._get_args()
        resp, status, success = make_request(requests.get,
                                             self.REQUESTS_URL,
                                             params=params,
                                             **args,
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
        args = self._get_args()
        resp, status, success = make_request(requests.post,
                                             self.REQUESTS_URL,
                                             json=params,
                                             **args,
                                             )
        if status == 404:
            return {}, 404
        if not success:
            log.warning(f"Failed to create package for dataset {dataset} with scope {scope}")
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
        args = self._get_args()

        resp, status, success = make_request(requests.post,
                                             self.AUTHORIZE_URL,
                                             json=params,
                                             **args,
                                             )
        if status == 404:
            return {}, 404

        if not success:
            log.warning(f"Failed to get requests for dataset {dataset}")

        return resp, status

    def get_download_url(self, token, dataset, file=None, package=None):
        """Create download URL from token"""
        params = {
            'token': token,
            'dataset': dataset
        }
        if file:
            params['file'] = file
        if package:
            params['package'] = package

        keyValues = '&'.join('='.join(item) for item in params.items())
        return f'{self.DOWNLOAD_URL}?{keyValues}'
