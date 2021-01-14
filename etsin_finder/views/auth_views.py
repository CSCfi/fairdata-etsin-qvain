# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Handles authentication related routes."""

from urllib.parse import quote, unquote, urljoin

from flask import Blueprint, current_app, make_response, redirect, request, session
from onelogin.saml2.utils import OneLogin_Saml2_Utils

from etsin_finder.auth.authentication_direct_proxy import \
    get_saml_auth, \
    init_saml_auth, \
    prepare_flask_request_for_saml, \
    reset_flask_session_on_login
from etsin_finder.auth.authentication_fairdata_sso import \
    join_redirect_url_path
from etsin_finder.log import log
from etsin_finder.views.index_views import _render_index_template

auth_views = Blueprint('auth_views', __name__)

@auth_views.route('/sso/etsin')
def login_etsin():
    """Endpoint which the frontend calls when wanting to perform a login as Etsin

    Returns:
        Redirect the login.

    """
    # Check how to login, SSO, SSO (forced), or SAML
    sso_authentication_force = request.cookies.get('sso_authentication')
    app_config = current_app.config
    sso_is_enabled = app_config.get('SSO').get('ENABLED') or sso_authentication_force
    redirect_url = quote(request.args.get('relay', '/'))

    if sso_is_enabled:
        log.info('SSO is enabled, logging in to Etsin using SSO')
        login_host = app_config.get('SSO').get('HOST')
        sso_redirect_url = app_config.get('SERVER_ETSIN_DOMAIN_NAME')
        login_url = login_host + '/login?service=ETSIN&redirect_url=https://' + sso_redirect_url
    elif not sso_is_enabled:
        log.info('SSO is disabled, logging in to Etsin using SAML auth')
        auth = get_saml_auth(request, '_ETSIN')
        login_url = auth.login(redirect_url)

    login_url = join_redirect_url_path(login_url, redirect_url)
    session['logged_in_through'] = 'etsin'
    return redirect(login_url)

@auth_views.route('/login/qvain')
def login_qvain():
    """Endpoint which the frontend calls when wanting to perform a login as Qvain

    Returns:
        Redirect the login

    """
    # Check how to login, SSO, SSO (forced), or SAML
    sso_authentication_force = request.cookies.get('sso_authentication')
    app_config = current_app.config
    sso_is_enabled = app_config.get('SSO').get('ENABLED') or sso_authentication_force
    redirect_url = quote(request.args.get('relay', '/'))

    if sso_is_enabled:
        log.info('SSO is enabled, logging in to Qvain using SSO')
        login_host = app_config.get('SSO').get('HOST')
        sso_redirect_url = app_config.get('SERVER_QVAIN_DOMAIN_NAME', '')
        login_url = login_host + '/login?service=QVAIN&redirect_url=https://' + sso_redirect_url
    elif not sso_is_enabled:
        log.info('SSO is disabled, logging in to Qvain using SAML auth')
        auth = get_saml_auth(request, '_QVAIN')
        login_url = auth.login(redirect_url)

    login_url = join_redirect_url_path(login_url, redirect_url)
    session['logged_in_through'] = 'qvain'
    return redirect(login_url)

@auth_views.route('/logout/etsin')
def logout_etsin():
    """Endpoint which frontend calls when wanting to perform a logout from Etsin

    Returns:
        Redirect the logout.

    """
    # Check how to logout, SSO, SSO (forced), or SAML
    sso_authentication_force = request.cookies.get('sso_authentication')
    app_config = current_app.config
    sso_is_enabled = app_config.get('SSO').get('ENABLED') or sso_authentication_force

    if sso_is_enabled:
        log.info('SSO is enabled, logging out from Etsin using SSO')
        logout_host = app_config.get('SSO').get('HOST')
        sso_redirect_url = app_config.get('SERVER_ETSIN_DOMAIN_NAME')
        logout_url = logout_host + '/logout?service=ETSIN&redirect_url=https://' + sso_redirect_url

        resp = make_response(redirect(logout_url))

        # Delete forced SSO cookie
        shared_domain = app_config.get('SESSION_COOKIE_DOMAIN')
        formatted_shared_domain = '.' + shared_domain
        resp.set_cookie('sso_authentication', '', expires=0, domain=formatted_shared_domain)
        return resp

    elif not sso_is_enabled:
        log.info('SSO is disabled, logging out from Etsin using SAML auth')
        auth = get_saml_auth(request, '_ETSIN')
        name_id = None
        session_index = None
        if 'samlNameId' in session:
            name_id = session.get('samlNameId')
        if 'samlSessionIndex' in session:
            session_index = session.get('samlSessionIndex')
        # Clear the flask session here because the idp doesnt seem to call the sls route.
        session.clear()
        return redirect(auth.logout(name_id=name_id, session_index=session_index))

@auth_views.route('/logout/qvain')
def logout_qvain():
    """Endpoint which the frontend calls when wanting to perform a logout from Qvain

    Returns:
        Redirect the logout.

    """
    # Check how to logout, SSO, SSO (forced), or SAML
    sso_authentication_force = request.cookies.get('sso_authentication')
    app_config = current_app.config
    sso_is_enabled = app_config.get('SSO').get('ENABLED') or sso_authentication_force

    if sso_is_enabled:
        log.info('SSO is enabled, logging out from Qvain using SSO')
        logout_host = app_config.get('SSO').get('HOST')
        sso_redirect_url = app_config.get('SERVER_QVAIN_DOMAIN_NAME', '')
        logout_url = logout_host + '/logout?service=QVAIN&redirect_url=https://' + sso_redirect_url

        resp = make_response(redirect(logout_url))

        # Delete forced SSO cookie
        shared_domain = app_config.get('SESSION_COOKIE_DOMAIN')
        formatted_shared_domain = '.' + shared_domain
        resp.set_cookie('sso_authentication', '', expires=0, domain=formatted_shared_domain)
        return resp

    elif not sso_is_enabled:
        log.info('SSO is disabled, logging out from Qvain using SAML auth')
        auth = get_saml_auth(request, '_QVAIN')
        name_id = None
        session_index = None
        if 'samlNameId' in session:
            name_id = session.get('samlNameId')
        if 'samlSessionIndex' in session:
            session_index = session.get('samlSessionIndex')
        # Clear the flask session here because the idp doesnt seem to call the sls route.
        session.clear()
        return redirect(auth.logout(name_id=name_id, session_index=session_index))


# SAML authentication functions (not relevant for SSO)

@auth_views.route('/saml_metadata/')
def saml_metadata_legacy():
    """Optional. Prints out the public saml metadata for Etsin."""
    auth = get_saml_auth(request, '')
    settings = auth.get_settings()
    metadata = settings.get_sp_metadata()
    errors = settings.validate_metadata(metadata)

    if len(errors) == 0:
        resp = make_response(metadata, 200)
        resp.headers['Content-Type'] = 'text/xml'
    else:
        resp = make_response(', '.join(errors), 500)
    return resp

@auth_views.route('/acs/', methods=['GET', 'POST'])
def saml_attribute_consumer_service_legacy():
    """The endpoint which is used by the saml library on auth.login call for both Etsin & Qvain"""
    # Workaround for local_development + old proxy
    host = request.headers.get('X-Forwarded-Host')
    if host == '30.30.30.30':
        return redirect('https://' + current_app.config.get('SERVER_ETSIN_DOMAIN_NAME') + '/acs/', 307)

    logged_in_through = session.get('logged_in_through')
    reset_flask_session_on_login()
    req = prepare_flask_request_for_saml(request, '')
    auth = init_saml_auth(req, '')
    auth.process_response()
    errors = auth.get_errors()

    if len(errors) == 0 and auth.is_authenticated():
        session['samlUserdata'] = auth.get_attributes()
        session['samlNameId'] = auth.get_nameid()
        session['samlSessionIndex'] = auth.get_session_index()
        self_url = OneLogin_Saml2_Utils.get_self_url(req)
        log.debug("SESSION: {0}".format(session))

        # Check if old proxy is used
        if ('samlUserdata' in session and len(session.get('samlUserdata', None)) > 0):
            redirect_url = ''

            # Redirect for Qvain
            if (logged_in_through == 'qvain'):
                redirect_url = 'https://' + current_app.config.get('SERVER_QVAIN_DOMAIN_NAME')

            # Redirect for Etsin
            if (logged_in_through == 'etsin'):
                redirect_url = 'https://' + current_app.config.get('SERVER_ETSIN_DOMAIN_NAME')

            if redirect_url:
                if 'RelayState' in request.form:
                    redirect_url = urljoin(redirect_url, unquote(request.form.get('RelayState')))
                return redirect(redirect_url)

        if 'RelayState' in request.form and self_url != request.form.get('RelayState'):
            return redirect(auth.redirect_to(unquote(request.form.get('RelayState'))))

    return _render_index_template(saml_errors=errors)

@auth_views.route('/sls/', methods=['GET', 'POST'])
def saml_single_logout_service_legacy():
    """The endpoint which is used by the saml library on auth.logout call for both Etsin & Qvain"""
    auth = get_saml_auth(request, '')
    slo_success = False
    url = auth.process_slo(delete_session_cb=lambda: session.clear())
    errors = auth.get_errors()
    if len(errors) == 0:
        if url is not None:
            return redirect(url)
        else:
            slo_success = True

    return _render_index_template(saml_errors=errors, slo_success=slo_success)
