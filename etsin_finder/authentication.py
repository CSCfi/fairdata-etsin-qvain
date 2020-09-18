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

from etsin_finder.app import app, log
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


def is_authenticated():
    """Is user authenticated.

    Returns:
        bool: Is auth.

    """
    if executing_travis():
        return False
    return True if 'samlUserdata' in session and len(session.get('samlUserdata', None)) > 0 else False


def is_authenticated_CSC_user():
    """Is the user authenticated with CSC username.

    Returns:
        bool: Is CSC user.

    """
    key = SAML_ATTRIBUTES.get('CSC_username')
    if executing_travis():
        return False
    return True if 'samlUserdata' in session and len(session.get('samlUserdata', None)) > 0 and key in session.get('samlUserdata', None) else False


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
    """Get user csc name from saml userdata.

    Returns:
        string: The users CSC username.

    """
    if not is_authenticated() or not is_authenticated_CSC_user() or 'samlUserdata' not in session:
        return None

    csc_name = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('CSC_username', None), False)

    return csc_name[0] if csc_name else not_found('csc_name')


def get_user_haka_identifier():
    """Get user HAKA identifier from saml userdata.

    Returns:
        string: The users HAKA identifier.

    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    haka_id = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('haka_id', None), False)

    return haka_id[0] if haka_id else not_found('haka_id')


def get_user_id():
    """Get user identifier

    If CSC_username is found return that, else try to find Haka identifier.

    Returns:
        string: User identifer.

    """
    csc_name = get_user_csc_name()
    if csc_name:
        return csc_name
    haka_id = get_user_haka_identifier()
    if haka_id:
        return haka_id
    return None


def get_user_email():
    """Get user email from saml userdata.

    Returns:
        string: The users email.

    """
    if not is_authenticated() or not is_authenticated_CSC_user() or 'samlUserdata' not in session:
        return None

    csc_email = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('email', None), False)

    return csc_email[0] if csc_email else not_found('csc_email')


def get_user_lastname():
    """Get user last name from saml userdata.

    Returns:
        string: The users last name.

    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    lastname = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('last_name', None), False)

    return lastname[0] if lastname else not_found('lastname')


def get_user_firstname():
    """Get user first name from saml userdata.

    Returns:
        string: The users first name.

    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    first_name = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('first_name', None), False)

    return first_name[0] if first_name else not_found('first_name')


def get_user_ida_groups():
    """Get the Groups from CSC IdM for the user.

    Returns:
        list: List of all the IDA groups, or None.

    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    groups = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('idm_groups', None), False)

    return [group for group in groups if group.startswith('IDA')] if groups else not_found('groups')


def get_user_home_organization_id():
    """Get the HAKA organization id from the saml userdata

    Returns:
        string: The id of the users home organization, or None.

    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    home_organization = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('haka_org_id', None), False)

    return home_organization[0] if home_organization else not_found('home_organization')


def get_user_home_organization_name():
    """Get the HAKA organization name from the saml userdata

    Returns:
        string: The name of the users home organization, or None.

    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    home_organization_id = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('haka_org_name', None), False)

    return home_organization_id[0] if home_organization_id else not_found('home_organization_id')
