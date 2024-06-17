# This file is part of the Etsin service
#
# Copyright 2017-2024 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax V3"""

import requests
from flask import current_app, g, request

from etsin_finder.log import log
from etsin_finder.utils.request_utils import make_request
from etsin_finder.utils.utils import FlaskService


class MetaxV3APIService(FlaskService):
    """Metax V3 API Service.

    The service proxies the SSO session cookie so Metax sees the
    requests as coming from the user.
    """

    def __init__(self):
        """Init service."""
        super().__init__(current_app)

        app_config = current_app.config
        metax_v3_config = app_config.get("METAX_V3_API")
        cookie_prefix = app_config.get("SSO", {}).get("PREFIX")

        if metax_v3_config and cookie_prefix:
            self.host = metax_v3_config["HOST"]
            self.port = metax_v3_config["PORT"]
            self.sso_cookie_name = f"{cookie_prefix}_fd_sso_session"
            self.verify_ssl = metax_v3_config.get("VERIFY_SSL", True)
        elif not self.is_testing:
            log.error("Unable to initialize MetaxV3APIService due to missing config")

    @property
    def session(self):
        """Create single session for the duration of the current Flask request."""
        if session := getattr(g, "metax_v3_session", None):
            return session

        # Forward header and cookie values required for authenticating the user.
        # Metax SSO and Metax CSRF cookies needs to be on a common domain.
        cookies = {}
        if sso_session := request.cookies.get(self.sso_cookie_name):
            cookies[self.sso_cookie_name] = sso_session

        # Non-GET requests need CSRF token in cookies to match
        # the X-CSRFToken header provided by the frontend
        csrf_cookie_name = "metax_csrftoken"
        if csrf_cookie := request.cookies.get(csrf_cookie_name):
            cookies[csrf_cookie_name] = csrf_cookie

        # Metax CSRF validation allows HTTPS requests when
        # referer is in Metax CSRF_TRUSTED_ORIGINS
        headers = {"Referer": request.headers.get("Referer")}

        # Frontend needs to add X-CSRFToken header to non-GET requests
        if csrf_token := request.headers.get("X-CSRFToken"):
            headers["X-CSRFToken"] = csrf_token

        session = requests.Session()
        session.cookies.update(cookies)
        session.headers.update(headers)
        g.metax_v3_session = session
        return session

    def metax_url(self, path: str, **kwargs):
        """Returns a formatted Metax V3 url."""
        base_url = f"https://{self.host}:{self.port}"
        return f"{base_url}{path.format(**kwargs)}"

    def get_dataset(self, identifier):
        """Get dataset from Metax."""
        url = self.metax_url("/v3/datasets/{identifier}", identifier=identifier)
        resp, _, success = make_request(
            self.session.get,
            url,
            params={"include_allowed_actions": "true"},
            headers={"Accept": "application/json"},
            verify=self.verify_ssl,
            timeout=30,
        )
        if not success:
            log.warning(
                "Failed to get catalog record {0} from Metax API".format(identifier)
            )
            return None
        return resp
