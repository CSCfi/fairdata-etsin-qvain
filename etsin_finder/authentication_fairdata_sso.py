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
from datetime import datetime
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

def get_decrypted_sso_session_details():
    """Retrieve decrypted_sso_session_details

    Returns:
        decrypted_fd_sso_session(list): List of decrypted cookies

    """
    key = get_sso_key()
    sso_environment_and_session = get_sso_environment_prefix() + '_fd_sso_session'
    if request.cookies.getlist(sso_environment_and_session):
        fd_sso_session = request.cookies.getlist(sso_environment_and_session)
        if fd_sso_session:
            try:
                decrypted_fd_sso_session = jwt.decode(fd_sso_session[0], key, algorithms=['HS256'])
                return decrypted_fd_sso_session
            except Exception as error_message:
                log.info(error_message)
                return None
        return None
    return None

def is_session_still_valid():
    """Checks if the cookie is still valid and not expired

    Returns:
        bool: Is session still valid

    """
    fd_sso_session = get_decrypted_sso_session_details()

    if fd_sso_session:
        if fd_sso_session.get('exp'):
            sso_session_expiry_date = fd_sso_session.get('exp')
            now = datetime.utcnow()
            current_date = int(now.timestamp())
            if sso_session_expiry_date > current_date:
                return True
            log.info('Session has expired')
            return False
        return False
    return False

def is_authenticated_through_fairdata_sso():
    """Is user authenticated through the new Fairdata single-sign on login

    Returns:
        bool: Is auth.

    """
    if executing_travis():
        return False

    fd_sso_session = get_decrypted_sso_session_details()

    if fd_sso_session:
        if is_session_still_valid():
            if fd_sso_session.get('authenticated_user').get('id'):
                return True
            return False
        return False
    return False

def log_sso_values():
    """Log SSO values for the Fairdata session"""
    log.info(request.cookies)
    log.info(get_decrypted_sso_session_details())
