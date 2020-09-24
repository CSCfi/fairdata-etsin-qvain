# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Fairdata SSO authentication related functionalities"""

import base64
import json
import jwt
from flask import session, request
from etsin_finder.app import app
from etsin_finder.log import log
from etsin_finder.app_config import get_app_config
from etsin_finder.saml_config import get_sso_key
from etsin_finder.utils import executing_travis

def get_sso_environment_prefix():
    """Checks what environment the user is currently in, based on app_config

    Returns
        session_data (string): String that defines what the SSO environment is

    """
    environment_string = get_app_config(app.testing).get('SSO_PREFIX')
    return environment_string

def get_fairdata_sso_session_details():
    """Get SSO details for the session

    Returns
        session_data(list): Converted list of details found in Fairdata SSO session data

    """
    key = get_sso_key()
    sso_environment_and_session = get_sso_environment_prefix() + '_fd_sso_session'
    fd_sso_session = request.cookies.getlist(sso_environment_and_session)
    decoded_fd_sso_session = jwt.decode(fd_sso_session[0], key, algorithms=['HS256'])
    log.info(decoded_fd_sso_session)
    return decoded_fd_sso_session

def is_authenticated_through_fairdata_sso():
    """Is user authenticated through the new Fairdata single-sign on login

    Returns:
        bool: Is auth.

    """
    if executing_travis():
        return False

    sso_environment_and_session = get_sso_environment_prefix() + '_fd_sso_session'
    fd_sso_session = request.cookies.getlist(sso_environment_and_session)
    key = get_sso_key()
    decoded_fd_sso_session = jwt.decode(fd_sso_session[0], key, algorithms=['HS256'])
    if decoded_fd_sso_session.get('authenticated_user').get('id'):
        return True
    return False

def log_sso_values():
    """Log SSO values for the Fairdata session"""
    log.info(request.cookies)
    log.info(get_fairdata_sso_session_details())
