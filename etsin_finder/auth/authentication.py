# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Authentication related functionalities"""

from flask import session
from etsin_finder.log import log
from etsin_finder.utils.utils import executing_travis
from etsin_finder.utils.constants import SAML_ATTRIBUTES
from etsin_finder.auth.authentication_fairdata_sso import (
    is_authenticated_through_fairdata_sso,
    get_decrypted_sso_session_details,
)
from etsin_finder.auth.authentication_direct_proxy import is_authenticated_through_direct_proxy

def not_found(field):
    """Log if field not found in session samlUserdata or SSO data

    Args:
        field (string): Name of the field that was not found in either the samlUserdata or in SSO data

    """
    log.warning('User seems to be authenticated but {0} not found.'.format(field))

def is_authenticated():
    """Is user authenticated. Separate check for old proxy and new Fairdata SSO

    Returns:
        bool: Is auth.

    """
    if executing_travis():
        return False

    if is_authenticated_through_direct_proxy():
        return True
    if is_authenticated_through_fairdata_sso():
        return True

    return False

def is_authenticated_CSC_user():
    """Is the user authenticated with CSC username.

    Returns:
        bool: Is CSC user.

    """
    if executing_travis():
        return False

    # Authenticated through direct proxy
    if is_authenticated_through_direct_proxy():
        if 'samlUserdata' in session and len(session.get('samlUserdata', None)) > 0 and SAML_ATTRIBUTES.get('CSC_username') in session.get('samlUserdata', None):
            return True

    # Authenticated through Fairdata SSO
    if is_authenticated_through_fairdata_sso():
        session_data = get_decrypted_sso_session_details()
        if session_data.get('authenticated_user').get('id'):
            return True
    return False

def get_user_csc_name():
    """Get user csc name from SAML userdata or Fairdata SSO

    Returns:
        string: The users CSC username.

    """
    if not is_authenticated() or not is_authenticated_CSC_user():
        return None

    # Authenticated through direct proxy
    if is_authenticated_through_direct_proxy():
        csc_name = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('CSC_username', None), False)
        if csc_name:
            return csc_name[0]

    # Authentication through Fairdata SSO proxy
    if is_authenticated_through_fairdata_sso():
        session_data = get_decrypted_sso_session_details()
        return session_data.get('authenticated_user').get('id')

    return not_found('csc_name')

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
    """Get user email from SAML userdata.

    Returns:
        string: The users email.

    """
    if not is_authenticated() or not is_authenticated_CSC_user():
        return None

    # Authenticated through direct proxy
    if is_authenticated_through_direct_proxy():
        csc_email = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('email', None), False)
        return csc_email[0] if csc_email else not_found('csc_email')

    # Authenticated through Fairdata SSO
    if is_authenticated_through_fairdata_sso():
        session_data = get_decrypted_sso_session_details()
        user_email = session_data.get('authenticated_user').get('email')
        return user_email

    return not_found('csc_email')

def get_user_firstname():
    """Get user first name from SAML userdata.

    Returns:
        string: The users first name.

    """
    if not is_authenticated():
        return None

    # Authenticated through direct proxy
    if is_authenticated_through_direct_proxy():
        first_name = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('first_name', None), False)
        if first_name:
            return first_name[0]

    # Authenticated through Fairdata SSO
    if is_authenticated_through_fairdata_sso():
        session_data = get_decrypted_sso_session_details()
        first_name = session_data.get('authenticated_user').get('firstname')
        return first_name

    return not_found('firstname')

def get_user_lastname():
    """Get user last name from SAML userdata.

    Returns:
        string: The users last name.

    """
    if not is_authenticated():
        return None

    # Authenticated through direct proxy
    if is_authenticated_through_direct_proxy():
        lastname = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('last_name', None), False)
        if lastname:
            return lastname[0]

    # Authenticated through Fairdata SSO
    if is_authenticated_through_fairdata_sso():
        session_data = get_decrypted_sso_session_details()
        last_name = session_data.get('authenticated_user').get('lastname')
        return last_name

    return not_found('lastname')

def get_user_ida_projects():
    """Get user IDA projects in two different ways

    1) For proxy login: get IDA projects from IDM groups
    2) For Fairdata SSO login: get IDA projects directly from SSO cookies

    Returns:
        list: List of all the IDA groups, or None.

    """
    if not is_authenticated():
        log.info('User not authorized -> no user ida groups retrieved')
        return None

    # Authenticated through direct proxy
    if is_authenticated_through_direct_proxy():
        groups = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('idm_groups', None), False)
        idaProjects = [group for group in groups if group.startswith('IDA01:')] if groups else not_found('ida_projects')

        # Parse the projects (conversion from IdM group syntax)
        try:
            if (idaProjects):
                return [project.split(":")[1] for project in idaProjects]
        except IndexError as e:
            log.error('Index error while parsing user IDA projects:\n{0}'.format(e))
            return None

    # Authenticated through Fairdata SSO
    if is_authenticated_through_fairdata_sso():
        session_data = get_decrypted_sso_session_details()

        if session_data.get('services').get('IDA'):
            try:
                user_ida_projects = session_data.get('services').get('IDA').get('projects')
            except Exception as error_message:
                log.info(error_message)
                return None
        else:
            log.info('No IDA groups available for user.')
            return None
        return user_ida_projects

    return not_found('ida_projects')

def get_user_home_organization_id():
    """Get the HAKA organization id from the saml userdata

    Returns:
        string: The id of the users home organization, or None.

    """
    if not is_authenticated():
        log.info('User not authorized -> no home organization id retrieved')
        return None

    # Authenicated through direct proxy
    if is_authenticated_through_direct_proxy():
        home_organization_id = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('haka_org_id', None), False)
        if home_organization_id:
            return home_organization_id[0]

    # Authenticated through Fairdata SSO
    if is_authenticated_through_fairdata_sso():
        session_data = get_decrypted_sso_session_details()
        user_home_organization_id = session_data.get('authenticated_user').get('organization').get('id')
        return user_home_organization_id

    return not_found('home_organization_id')

def get_user_home_organization_name():
    """Get the HAKA organization name from the saml userdata

    Returns:
        string: The name of the users home organization, or None.

    """
    if not is_authenticated():
        log.info('User not authorized -> no home organization name retrieved')
        return None

    # Authenicated through direct proxy
    if is_authenticated_through_direct_proxy():
        home_organization_name = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('haka_org_name', None), False)
        if home_organization_name:
            return home_organization_name[0]

    # Authenticated through Fairdata SSO
    if is_authenticated_through_fairdata_sso():
        session_data = get_decrypted_sso_session_details()
        user_home_organization_name = session_data.get('authenticated_user').get('organization').get('name')
        return user_home_organization_name

    return not_found('home_organization')

def get_user_haka_identifier():
    """Get user HAKA identifier from saml userdata.

    Returns:
        string: The users HAKA identifier.

    """
    if not is_authenticated() or 'samlUserdata' not in session:
        return None

    haka_id = session.get('samlUserdata', {}).get(SAML_ATTRIBUTES.get('haka_id', None), False)

    return haka_id[0] if haka_id else not_found('haka_id')
