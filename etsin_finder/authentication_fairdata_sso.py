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

def get_sso_session_details():
    """Get sso details for the session
    """
    session_data_string = request.cookies.getlist('fd_test_csc_fi_fd_sso_session')
    session_data = json.loads(base64.b64decode(session_data_string[0]))
    # log.info(session_data)

def is_authenticated_through_fairdata_sso():
    """Is user authenticated through the new Fairdata single-sign on login

    Returns:
        bool: Is auth.

    """
    if request.cookies.getlist('fd_test_csc_fi_fd_sso_username'):
        return True
    return False

def convert_sso_data_to_saml_format():
    """Convert details from SSO login to SAML attributes

    Returns:
        list:
    """
    session_data_string = request.cookies.getlist('fd_test_csc_fi_fd_sso_session')
    session_data = json.loads(base64.b64decode(session_data_string[0]))
    log.info(session_data)

    # ToDo: retrieve for each field in authentication.py
    object_to_return = {
			'urn:oid:0.9.2342.19200300.100.1.3': [session_data.get('authenticated_user').get('email')],
			'urn:oid:1.3.6.1.4.1.16161.4.0.53': [session_data.get('authenticated_user').get('id')],
			'urn:oid:1.3.6.1.4.1.16161.4.0.88': [session_data.get('authenticated_user').get('organization').get('name')],
			'urn:oid:1.3.6.1.4.1.25178.1.2.9': [session_data.get('authenticated_user').get('organization').get('id')],
			'urn:oid:1.3.6.1.4.1.8057.2.80.26': ['_platform01:_projectName'],
			'urn:oid:2.5.4.4': ['first'],
			'urn:oid:2.5.4.42': ['last']
    }
		
    return object_to_return
