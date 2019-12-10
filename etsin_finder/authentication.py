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
from etsin_finder.utils import executing_travis, SAML_ATTRIBUTES

log = app.logger

def not_found(field):
    """Log if field not found in session samlUserdata

    Arguments:
        field [string] -- Name of the field not found.
    """
    log.warning('User seems to be authenticated but {0} not in session object.'.format(field))
    log.debug('Saml userdata:\n{0}'.format(session['samlUserdata']))


def get_saml_auth(flask_request):
    """Used by saml library.

    Arguments:
        flask_request [] -- []

    Returns:
        [] -- []
    """
    return OneLogin_Saml2_Auth(prepare_flask_request_for_saml(flask_request), custom_base_path=app.config['SAML_PATH'])


def init_saml_auth(saml_prepared_flask_request):
    """Used by saml library.

    Arguments:
        saml_prepared_flask_request [] -- []

    Returns:
        [] -- []
    """
    return OneLogin_Saml2_Auth(saml_prepared_flask_request, custom_base_path=app.config['SAML_PATH'])


def is_authenticated():
    """Is user authenticated.

    Returns:
        [boolean] -- True/False
    """
    if executing_travis():
        return False
    return True if 'samlUserdata' in session and len(session['samlUserdata']) > 0 else False


def is_authenticated_CSC_user():
    """Is the user authenticated with CSC username.

    Returns:
        [boolean] -- True/False
    """
    key = SAML_ATTRIBUTES['CSC_username']
    if executing_travis():
        return False
    return True if 'samlUserdata' in session and len(session['samlUserdata']) > 0 and key in session['samlUserdata'] else False


def prepare_flask_request_for_saml(request):
    """Used by saml library.

    Arguments:
        request [dict] -- request

    Returns:
        [dict] -- configs for saml
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
        [string] -- The users CSC username.
    """

    if not is_authenticated() or not is_authenticated_CSC_user() or 'samlUserdata' not in session:
        return None

    csc_name = session['samlUserdata'].get(SAML_ATTRIBUTES['CSC_username'], False)

    return csc_name[0] if csc_name else not_found('csc_name')
    return None


def get_user_haka_identifier():
    """Get user HAKA identifier from saml userdata.

    Returns:
        [string] -- The users HAKA identifier.
    """

    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    haka_id = session['samlUserdata'].get(SAML_ATTRIBUTES['haka_id'], False)

    return haka_id[0] if haka_id else not_found('haka_id')
    return None


def get_user_id():
    """Get user identifier. If CSC_username is found return that,
        else try to find Haka identifier.

    Returns:
        [string] -- User identifer.
    """
    csc_name = get_user_csc_name()
    return csc_name[0] if csc_name else not_found('csc_name')
    haka_id = get_user_haka_identifier()
    return haka_id[0] if haka_id else not_found('haka_id')
    return None


def get_user_email():
    """Get user email from saml userdata.

    Returns:
        [string] -- The users email.
    """

    if not is_authenticated() or not is_authenticated_CSC_user() or 'samlUserdata' not in session:
        return None

    csc_email = session['samlUserdata'].get(SAML_ATTRIBUTES['email'], False)

    return csc_email[0] if csc_email else not_found('csc_email')
    return None


def get_user_lastname():
    """Get user last name from saml userdata.

    Returns:
        [string] -- The users last name
    """

    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    lastname = session['samlUserdata'].get(SAML_ATTRIBUTES['last_name'], False)

    return lastname[0] if lastname else not_found('lastname')
    return None


def get_user_ida_groups():
    """Get the Groups from CSC IdM for the user.

    Returns:
        [list] -- List of all the IDA groups.
    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    groups = session['samlUserdata'].get(SAML_ATTRIBUTES['idm_groups'], False)

    return [group for group in groups if group.startswith('IDA')] if groups else not_found('groups')
    return None


def get_user_home_organization_id():
    """Get the HAKA organization id from the saml userdata

    Returns:
        [string] -- The id of the users home organization.
    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    home_organization = session['samlUserdata'].get(SAML_ATTRIBUTES['haka_org_id'], False)

    return home_organization[0] if home_organization else not_found('home_organization')
    return None


def get_user_home_organization_name():
    """Get the HAKA organization name from the saml userdata

    Returns:
        [string] -- The name of the users home organization.
    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    home_organization_id = session['samlUserdata'].get(SAML_ATTRIBUTES['haka_org_name'], False)

    return home_organization_id[0] if home_organization_id else not_found('home_organization_id')
    return None
