# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for routing traffic from Flask to frontend."""

from flask import Blueprint, make_response, render_template, request, session, current_app
import requests

from etsin_finder.auth.authentication import is_authenticated
from etsin_finder.auth.authentication_direct_proxy import is_authenticated_through_direct_proxy
from etsin_finder.auth.authentication_fairdata_sso import (
    is_authenticated_through_fairdata_sso,
    log_sso_values
)
from etsin_finder.log import log
from etsin_finder.utils.localization import get_language, translate

index_views = Blueprint('index_views', __name__)

def webpack_dev_proxy(host, path):
    """Proxy requests through webpack dev server"""
    response = requests.get(f"{host}{path}")
    excluded_headers = ["content-encoding", "content-length", "transfer-encoding", "connection"]
    headers = {
        name: value
        for name, value in response.raw.headers.items()
        if name.lower() not in excluded_headers
    }
    # if dev server responds with html, return the rendered index template instead
    if headers.get('Content-Type') == 'text/html; charset=UTF-8':
        return _render_index_template()
    return (response.content, response.status_code, headers)

@index_views.route('/', defaults={'path': ''})
@index_views.route('/<path:path>')
def frontend_app(path):
    """All other requests to the app should be routed via here. Renders the base file for the frontend app.

    Args:
        path (str): path

    Returns:
        Render the frontend.

    """
    # If using webpack dev server, proxy requests through it
    if current_app.config.get('WEBPACK_DEV_PROXY'):
        return webpack_dev_proxy("http://localhost:8080", request.path)

    # Check if URL endpoint force enabling SSO has been visited
    sso_enabled_through_url = request.args.get('sso_authentication', default='false', type=str)
    resp = make_response(_render_index_template())

    if sso_enabled_through_url == 'true':
        # Force enable SSO cookie for entire domain (Etsin + Qvain)
        shared_domain = current_app.config.get('SESSION_COOKIE_DOMAIN')
        formatted_shared_domain = '.' + shared_domain
        resp.set_cookie('sso_authentication', 'true', domain=formatted_shared_domain)

    return resp

def _render_index_template(saml_errors=[], slo_success=False):
    """Load saml attributes if logged in through old proxy, and log values

    Args:
        saml_errors (list): List of SAML errors
        slo_success (bool): SLO status

    Returns:
        index.html rendered template

    """
    is_auth = is_authenticated()
    if is_auth:
        if is_authenticated_through_direct_proxy():
            log.info(session.get('samlUserdata').items())
        if is_authenticated_through_fairdata_sso():
            log_sso_values()

    lang = get_language()
    if request.headers.get('X-Etsin-App', None) == 'qvain':
        app_title = translate(lang, 'qvain.title')
        app_description = translate(lang, 'qvain.description')
    else:
        app_title = translate(lang, 'etsin.title')
        app_description = translate(lang, 'etsin.description')

    return render_template('index.html', lang=lang, app_title=app_title, app_description=app_description)
