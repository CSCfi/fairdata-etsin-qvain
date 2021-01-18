# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Fairdata SSO authentication related functionalities"""

import jwt
from flask import request, current_app
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode, urljoin

from etsin_finder.log import log
from etsin_finder.utils.utils import executing_travis

def get_sso_environment_prefix():
    """Checks what environment the user is currently in, based on app_config

    Returns
        session_data (string): String that defines what the SSO environment is

    """
    environment_string = current_app.config.get('SSO').get('PREFIX')
    return environment_string

def get_decrypted_sso_session_details():
    """Retrieve decrypted_sso_session_details

    Returns:
        decrypted_fd_sso_session(list): List of decrypted cookies

    """
    key = current_app.config.get('SSO').get('KEY')
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

def is_authenticated_through_fairdata_sso():
    """Is user authenticated through the new Fairdata single-sign on login

    Returns:
        bool: Is auth.

    """
    if executing_travis():
        return False

    fd_sso_session = get_decrypted_sso_session_details()

    if fd_sso_session:
        if fd_sso_session.get('authenticated_user').get('id'):
            return True
        return False
    return False

def log_sso_values():
    """Log SSO values for the Fairdata session"""
    log.info(request.cookies)
    log.info(get_decrypted_sso_session_details())

def join_redirect_url_path(url, path):
    """
    Append path to redirect_url parameter in URL

    Used to append a path to the redirect_url query parameter in a URL.
    If the query parameter does not exist, the URL is returned unchanged.

    Args:
        url (str): Original URL including the query string
        path (str): Path to append to redirect_url, may contain query params

    Returns:
        updated_url (str): Updated URL

    """
    if path == '' or path == '/':
        return url

    parsed_url = urlparse(url)
    query = parse_qs(parsed_url.query)
    query_redirect_url = query.get('redirect_url')
    if not query_redirect_url:
        return url

    query['redirect_url'] = [urljoin(query_redirect_url[0], path)]
    updated_url = parsed_url._replace(query=urlencode(query, doseq=True))
    return urlunparse(updated_url)
