# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Direct authentication related functionalities"""

from urllib.parse import urlparse
from flask import session, request
from onelogin.saml2.auth import OneLogin_Saml2_Auth

from etsin_finder.finder import app
from etsin_finder.utils import executing_travis
from etsin_finder.constants import SAML_ATTRIBUTES

def not_found(field):
    """Log if field not found in session samlUserdata

    Args:
        field (string): Name of the field that was not found in samlUserdata.

    """
    log.warning('User seems to be authenticated but {0} not in session object.'.format(field))
    log.debug('Saml userdata:\n{0}'.format(session.get('samlUserdata', None)))


def get_saml_auth(flask_request):
    """Get saml auth

    Args:
        flask_request (object): flask.Request

    Returns:
        object: SP SAML instance.

    """
    return OneLogin_Saml2_Auth(prepare_flask_request_for_saml(flask_request), custom_base_path=app.config.get('SAML_PATH', None))


def init_saml_auth(saml_prepared_flask_request):
    """Init saml auth

    Args:
        saml_prepared_flask_request (object): Prepared flask request.

    Returns:
        object: Initializes the SP SAML instance.

    """
    return OneLogin_Saml2_Auth(saml_prepared_flask_request, custom_base_path=app.config.get('SAML_PATH', None))

def is_authenticated_without_fairdata_sso():
    """Is user authenticated through the old proxy solution

    Returns:
        bool: Is auth.

    """
    if ('samlUserdata' in session and len(session.get('samlUserdata', None)) > 0):
        return True
    return False

def prepare_flask_request_for_saml(request):
    """Prepare Flask request for saml

    Args:
        request (object): flask.Request

    Returns:
        dict: Request data.

    """
    # If server is behind proxys or balancers use the HTTP_X_FORWARDED fields
    url_data = urlparse(request.url)
    # If in local development environment this will redirect the saml login right.
    if request.host == 'localhost':
        request.host = '30.30.30.30'
    return {
        'https': 'on' if request.scheme == 'https' else 'off',
        'http_host': request.host,
        'server_port': url_data.port,
        'script_name': request.path,
        'get_data': request.args.copy(),
        'post_data': request.form.copy()
    }

def reset_flask_session_on_login():
    """Reset Flask session on login"""
    session.clear()
    session.permanent = True


def reset_flask_session_on_logout():
    """Reset Flask session on logout"""
    session.clear()