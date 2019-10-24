# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Authentication related functionalities"""

from urllib.parse import urlparse

from flask import session
from onelogin.saml2.auth import OneLogin_Saml2_Auth

from etsin_finder.finder import app
from etsin_finder.utils import executing_travis

log = app.logger


def get_saml_auth(flask_request):
    """
    Used by saml library.

    :param flask_request:
    :return:
    """
    return OneLogin_Saml2_Auth(prepare_flask_request_for_saml(flask_request), custom_base_path=app.config['SAML_PATH'])


def init_saml_auth(saml_prepared_flask_request):
    """
    Used by saml library.

    :param saml_prepared_flask_request:
    :return:
    """
    return OneLogin_Saml2_Auth(saml_prepared_flask_request, custom_base_path=app.config['SAML_PATH'])


def is_authenticated():
    """
    Is user authenticated or not.

    :return:
    """
    if executing_travis():
        return False
    return True if 'samlUserdata' in session and len(session['samlUserdata']) > 0 else False

def is_authenticated_CSC_user():
    """
    Is the user authenticated with CSC username or not.

    :return:
    """
    key = 'urn:oid:1.3.6.1.4.1.8057.2.80.26'
    if executing_travis():
        return False
    return True if 'samlUserdata' in session and len(session['samlUserdata']) > 0 and key in session['samlUserdata'] else False


def prepare_flask_request_for_saml(request):
    """
    Used by saml library.

    :param request:
    :return:
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
        # "lowercase_urlencoding": "",
        # "request_uri": "",
        # "query_string": ""

    }


def reset_flask_session_on_login():
    """Reset Flask session on login"""
    session.clear()
    session.permanent = True


def reset_flask_session_on_logout():
    """Reset Flask session on logout"""
    session.clear()


def get_user_csc_name():
    """
    Get user csc name from saml userdata.

    :return:
    """
    if not is_authenticated() or not is_authenticated_CSC_user() or 'samlUserdata' not in session:
        return None

    csc_name = session['samlUserdata'].get('urn:oid:1.3.6.1.4.1.16161.4.0.53', False)
    if csc_name:
        return csc_name[0]
    else:
        log.warning("User seems to be authenticated but CSC user name not in session object. "
                 "Saml userdata:\n{0}".format(session['samlUserdata']))

    return None


def get_user_id():
    """
    Get user id from saml userdata.

    :return:
    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    user_fd_id = session['samlUserdata'].get('urn:oid:1.3.6.1.4.1.8057.2.80.9', False)
    if user_fd_id:
        return user_fd_id[0]
    else:
        log.warning("User seems to be authenticated but fairdata id not in session object. "
                 "Saml userdata:\n{0}".format(session['samlUserdata']))

    return None

def get_user_ida_groups():
    """
    Get the Groups from CSC IdM for the user.

    :return:
    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    groups = session['samlUserdata'].get('urn:oid:1.3.6.1.4.1.8057.2.80.26', False)
    if groups:
        ida_groups = [group for group in groups if group.startswith('IDA')]
        return ida_groups
    else:
        log.warning("User seems to be authenticated but groups not in session object. "
                    "Saml userdata:\n{0}".format(session['samlUserdata']))

    return None

def get_user_home_organization_id():
    """
    Get the organization id from the saml userdata

    :return:
    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    home_organization = session['samlUserdata'].get('urn:oid:1.3.6.1.4.1.25178.1.2.9', False)
    if home_organization:
        return home_organization[0]
    else:
        log.warning("User seems to be authenticated but CSC organization id not in session object."
                    "Saml userdata:\n{0}".format(session['samlUserdata']))

def get_user_home_organization_name():
    """
    Get the organization id from the saml userdata

    :return:
    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    home_organization_id = session['samlUserdata'].get('urn:oid:1.3.6.1.4.1.16161.4.0.88', False)
    if home_organization_id:
        return home_organization_id[0]
    else:
        log.warning("User seems to be authenticated but CSC organization name not in session object."
                    "Saml userdata:\n{0}".format(session['samlUserdata']))
