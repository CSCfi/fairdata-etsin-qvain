# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Fairdata SSO authentication related functionalities"""

import base64
import json
from flask import session, request
from etsin_finder.app import app
from etsin_finder.log import log
from etsin_finder.app_config import get_app_config

def get_sso_environment_prefix():
    """Checks what environment the user is currently in, based on app_config

    Returns
        session_data (string): String that defines what the SSO environment is

    """
    environment_string = get_app_config(app.testing).get('SSO_PREFIX')
    return environment_string

def get_fairdata_sso_session_details():
    """Get sso details for the session

    Returns
        session_data(list): Converted list of details found in Fairdata SSO session data

    """
    sso_environment_and_session = get_sso_environment_prefix() + '_fd_sso_session'
    session_data_string = request.cookies.getlist(sso_environment_and_session)
    session_data = json.loads(base64.b64decode(session_data_string[0]))
    return session_data

def is_authenticated_through_fairdata_sso():
    """Is user authenticated through the new Fairdata single-sign on login

    Returns:
        bool: Is auth.

    """
    sso_environment_and_username = get_sso_environment_prefix() + '_fd_sso_username'
    if request.cookies.getlist(sso_environment_and_username):
        return True
    return False

def log_sso_values():
    """Log SSO values for the Fairdata session"""
    log.info(request.cookies)
    log.info(get_fairdata_sso_session_details())
