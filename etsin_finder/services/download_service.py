# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Functionalities for download data from Download API"""

import requests
import re
import json
import marshmallow

from etsin_finder.utils.request_utils import make_request
from etsin_finder.utils.crypto_utils import (
    generate_fernet_key,
    dict_encrypt,
    dict_decrypt,
)
from etsin_finder.app_config import get_download_api_config
from etsin_finder.log import log
from etsin_finder.utils.utils import FlaskService
from .base_service import BaseService, ConfigValidationMixin
from etsin_finder.schemas.services import DownloadServiceConfigurationSchema


class DownloadAPIService(FlaskService, ConfigValidationMixin):
    """Download API Service"""

    schema = DownloadServiceConfigurationSchema(unknown=marshmallow.RAISE)

    def __init__(self, app):
        """Setup Download API Service.

        Args:
            app (object): flask.Flask object instance.

        """
        super().__init__(app)

        dl_api_config = get_download_api_config(app)
        self.config = dl_api_config
        if dl_api_config:
            host = dl_api_config.get("HOST")
            port = dl_api_config.get("PORT")
            public_host = dl_api_config.get("PUBLIC_HOST")
            public_port = dl_api_config.get("PUBLIC_PORT")
            auth_token = dl_api_config.get("AUTH_TOKEN")
            verify_ssl = dl_api_config.get("VERIFY_SSL", True)
            self_domain = app.config.get("SERVER_ETSIN_DOMAIN_NAME")

            self.API_BASE_URL = f"https://{host}:{port}"
            self.API_PUBLIC_BASE_URL = f"https://{public_host}:{public_port}"
            self.REQUESTS_URL = f"{self.API_BASE_URL}/requests"
            self.AUTHORIZE_URL = f"{self.API_BASE_URL}/authorize"
            self.SUBSCRIBE_URL = f"{self.API_BASE_URL}/subscribe"
            self.STATUS_URL = f"{self.API_BASE_URL}/status"
            self.DOWNLOAD_URL = f"{self.API_PUBLIC_BASE_URL}/download"
            self.NOTIFICATION_CALLBACK_URL = (
                f"https://{self_domain}/api/download/notifications"
            )
            self.NOTIFICATION_SECRET = generate_fernet_key(app.config["SECRET_KEY"])

            self.verify_ssl = verify_ssl
            self.auth_token = auth_token
            self.proxies = None
            if dl_api_config.get("HTTPS_PROXY"):
                self.proxies = dict(https=dl_api_config.get("HTTPS_PROXY"))
        else:
            log.error("Unable to initialize DownloadAPIService due to missing config")

    def _get_args(self, **kwargs):
        """Get default args for request, allow overriding with kwargs."""
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
        if self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"

        args = dict(
            headers=headers,
            verify=self.verify_ssl,
            timeout=30,
            proxies=self.proxies,
            error_to_response=self._error_to_response,
        )
        args.update(kwargs)
        return args

    @staticmethod
    def _error_to_response(error, code):
        if code == 503:
            return "Unable to connect to the download service"
        return "Server error connecting to the download service"

    def get_requests(self, dataset):
        """Get package generation requests for dataset"""
        params = {"dataset": dataset}
        args = self._get_args()
        resp, status, success = make_request(
            requests.get,
            self.REQUESTS_URL,
            params=params,
            **args,
        )
        if status == 404:
            try:
                # Not finding active tasks should not be considered an error here
                if re.match("no active .*tasks", resp.get("error"), re.IGNORECASE):
                    return {}, 200
            except Exception:
                pass
        if not success:
            log.warning(f"Failed to get requests for dataset {dataset}")
        return resp, status

    def post_request(self, dataset, scope):
        """Post package generation request for dataset"""
        params = {
            "dataset": dataset,
        }
        if scope:
            params["scope"] = scope
        args = self._get_args()
        resp, status, success = make_request(
            requests.post,
            self.REQUESTS_URL,
            json=params,
            **args,
        )
        if not success:
            log.warning(
                f"Failed to create package for dataset {dataset} with scope {scope}"
            )
        return resp, status

    def subscribe(self, dataset, scope, payload):
        """Subscribe to package generation notification"""
        params = {
            "dataset": dataset,
            "subscriptionData": payload,
            "notifyURL": self.NOTIFICATION_CALLBACK_URL,
        }
        if scope:
            params["scope"] = scope
        args = self._get_args()
        resp, status, success = make_request(
            requests.post,
            self.SUBSCRIBE_URL,
            json=params,
            **args,
        )
        if not success:
            log.warning(
                f"Failed to subscribe to package generation for {dataset} with scope {scope}"
            )
        return resp, status

    def authorize(self, dataset, file=None, package=None):
        """Authorize package or file download"""
        params = {"dataset": dataset}
        if file:
            params["file"] = file
        if package:
            params["package"] = package
        args = self._get_args()

        resp, status, success = make_request(
            requests.post,
            self.AUTHORIZE_URL,
            json=params,
            **args,
        )
        if not success:
            log.warning(f"Failed to get requests for dataset {dataset}")

        return resp, status

    def status(self):
        """Return status of download service."""
        args = self._get_args()
        resp, status, success = make_request(
            requests.get,
            self.STATUS_URL,
            **args,
        )
        if isinstance(resp, dict) and (resp_status := resp.get("status")):
            resp = resp_status
        if not success:
            log.warning(f"Downloads not available: {status} {resp}")

        return resp, status

    def get_download_url(self, token):
        """Create download URL from token"""
        return f"{self.DOWNLOAD_URL}?token={token}"

    def encode_notification(self, payload):
        """Encode payload dictionary as json and encrypt it"""
        return dict_encrypt(payload, self.NOTIFICATION_SECRET)

    def decode_notification(self, encoded_payload):
        """Decrypt payload and return it as dict"""
        return dict_decrypt(encoded_payload, self.NOTIFICATION_SECRET)
