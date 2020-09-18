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

from etsin_finder.finder import app

log = app.logger

def get_fairdata_sso_session_details():
    """Get sso details for the session
    
    Returns
        session_data(list): Converted list of details found in Fairdata SSO session data
    """
    # To do: account for test/stable/demo
    session_data_string = request.cookies.getlist('fd_test_csc_fi_fd_sso_session')
    session_data = json.loads(base64.b64decode(session_data_string[0]))
    return session_data

def is_authenticated_through_fairdata_sso():
    """Is user authenticated through the new Fairdata single-sign on login

    Returns:
        bool: Is auth.

    """
    if request.cookies.getlist('fd_test_csc_fi_fd_sso_username'):
        return True
    return False

def log_sso_values():
    """Log SSO values for the Fairdata session"""
    log.info(request.cookies)
    log.info(get_fairdata_sso_session_details())
