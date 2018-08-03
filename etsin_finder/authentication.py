# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from urllib.parse import urlparse

from flask import request, session
from onelogin.saml2.auth import OneLogin_Saml2_Auth

from etsin_finder.finder import app
from etsin_finder.utils import executing_travis

log = app.logger


def get_saml_auth(flask_request):
    return OneLogin_Saml2_Auth(prepare_flask_request_for_saml(flask_request), custom_base_path=app.config['SAML_PATH'])


def init_saml_auth(saml_prepared_flask_request):
    return OneLogin_Saml2_Auth(saml_prepared_flask_request, custom_base_path=app.config['SAML_PATH'])


def is_authenticated():
    if executing_travis():
        return False
    auth = get_saml_auth(request)
    return True if auth.is_authenticated and 'samlUserdata' in session and len(session['samlUserdata']) > 0 else False


def prepare_flask_request_for_saml(request):
    # If server is behind proxys or balancers use the HTTP_X_FORWARDED fields
    url_data = urlparse(request.url)
    return {
        'https': 'on' if request.scheme == 'https' else 'off',
        'http_host': request.host,
        'server_port': url_data.port,
        'script_name': request.path,
        'get_data': request.args.copy(),
        'post_data': request.form.copy()
        # "lowercase_urlencoding": "",
        # "request_uri": "",
        # "query_string": ""

    }


def reset_flask_session_on_login():
    session.clear()
    session.permanent = True


def reset_flask_session_on_logout():
    session.clear()


def get_user_saml_info():
    if not is_authenticated():
        return {}

    eppn = session['samlUserdata'].get('urn:oid:1.3.6.1.4.1.5923.1.1.1.6', False)[0]
    cn = session['samlUserdata'].get('urn:oid:2.5.4.3', False)[0]
    if not eppn or not cn:
        log.warn("User seems to be authenticated but eppn or cn not in session object. "
                 "Saml userdata:\n{0}".format(session['samlUserdata']))
    return {
        'user_id': eppn,
        'user_display_name': cn
    }


def get_user_eppn():
    user_info = get_user_saml_info()
    if user_info:
        return user_info.get('user_id', None)
    return None
