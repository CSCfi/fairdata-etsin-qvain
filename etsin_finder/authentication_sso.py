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
    log.info(session_data)