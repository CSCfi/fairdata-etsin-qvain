# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for routing traffic from Flask to frontend. Additionally handles authentication related routes."""
from urllib.parse import quote, unquote

from flask import make_response, render_template, redirect, request, session
from urllib.parse import urljoin
from onelogin.saml2.utils import OneLogin_Saml2_Utils
import requests

from etsin_finder.authentication import \
    is_authenticated
from etsin_finder.authentication_direct_proxy import \
    get_saml_auth, \
    is_authenticated_through_direct_proxy, \
    init_saml_auth, \
    prepare_flask_request_for_saml, \
    reset_flask_session_on_login
from etsin_finder.authentication_fairdata_sso import \
    is_authenticated_through_fairdata_sso, \
    log_sso_values, \
    join_redirect_url_path
from etsin_finder.app_config import get_app_config
from etsin_finder.app import app
from etsin_finder.log import log
from etsin_finder.localization import get_language, translate

# REACT APP RELATED

@app.route('/login/etsin')
def login_etsin():
    """Endpoint which the frontend calls when wanting to perform a login as Etsin

    Returns:
        Redirect the login.

    """
    # Check how to login, SSO, SSO (forced), or SAML
    sso_authentication_force = request.cookies.get('sso_authentication')
    sso_is_enabled = get_app_config(app.testing).get('SSO_AUTHORIZATION') or sso_authentication_force
    redirect_url = quote(request.args.get('relay', '/'))

    if sso_is_enabled:
        log.info('SSO is enabled, logging in to Etsin using SSO')
        login_url = get_app_config(app.testing).get('SSO_LOGIN_ETSIN')
    elif not sso_is_enabled:
        log.info('SSO is disabled, logging in to Etsin using SAML auth')
        auth = get_saml_auth(request, '_ETSIN')
        login_url = auth.login(redirect_url)

    login_url = join_redirect_url_path(login_url, redirect_url)
    session['logged_in_through'] = 'etsin'
    return redirect(login_url)

@app.route('/login/qvain')
def login_qvain():
    """Endpoint which the frontend calls when wanting to perform a login as Qvain

    Returns:
        Redirect the login

    """
    # Check how to login, SSO, SSO (forced), or SAML
    sso_authentication_force = request.cookies.get('sso_authentication')
    sso_is_enabled = get_app_config(app.testing).get('SSO_AUTHORIZATION') or sso_authentication_force
    redirect_url = quote(request.args.get('relay', '/'))

    if sso_is_enabled:
        log.info('SSO is enabled, logging in to Qvain using SSO')
        login_url = get_app_config(app.testing).get('SSO_LOGIN_QVAIN')
    elif not sso_is_enabled:
        log.info('SSO is disabled, logging in to Qvain using SAML auth')
        auth = get_saml_auth(request, '_QVAIN')
        login_url = auth.login(redirect_url)

    login_url = join_redirect_url_path(login_url, redirect_url)
    session['logged_in_through'] = 'qvain'
    return redirect(login_url)

@app.route('/logout/etsin')
def logout_etsin():
    """Endpoint which frontend calls when wanting to perform a logout from Etsin

    Returns:
        Redirect the logout.

    """
    # Check how to logout, SSO, SSO (forced), or SAML
    sso_authentication_force = request.cookies.get('sso_authentication')
    sso_is_enabled = get_app_config(app.testing).get('SSO_AUTHORIZATION') or sso_authentication_force

    if sso_is_enabled:
        log.info('SSO is enabled, logging out from Etsin using SSO')
        logout_url = get_app_config(app.testing).get('SSO_LOGOUT_ETSIN')
        resp = make_response(redirect(logout_url))

        # Delete forced SSO cookie
        resp.set_cookie('sso_authentication', '', expires=0)
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

@app.route('/logout/qvain')
def logout_qvain():
    """Endpoint which the frontend calls when wanting to perform a logout from Qvain

    Returns:
        Redirect the logout.

    """
    # Check how to logout, SSO, SSO (forced), or SAML
    sso_authentication_force = request.cookies.get('sso_authentication')
    sso_is_enabled = get_app_config(app.testing).get('SSO_AUTHORIZATION') or sso_authentication_force

    if sso_is_enabled:
        log.info('SSO is enabled..., logging out from Qvain using SSO')
        logout_url = get_app_config(app.testing).get('SSO_LOGOUT_QVAIN')
        resp = make_response(redirect(logout_url))

        # Delete forced SSO cookie
        resp.set_cookie('sso_authentication', '', expires=0)
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


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def frontend_app(path):
    """All other requests to the app should be routed via here. Renders the base file for the frontend app.

    Args:
        path (str): path

    Returns:
        Render the frontend.

    """
    # Check if URL endpoint force enabling SSO has been visited
    sso_enabled_through_url = request.args.get('sso_authentication', default='false', type=str)
    resp = make_response(_render_index_template())

    if sso_enabled_through_url == 'true':
        # Force enable SSO cookie for entire domain (Etsin + Qvain)
        cookie_domain = get_app_config(app.testing).get('SHARED_DOMAIN_NAME')
        resp.set_cookie('sso_authentication', 'true', domain=cookie_domain)

    return resp

def _render_index_template(saml_errors=[], slo_success=False):
    """Load saml attributes if logged in through old proxy, and log values

    Args:
        saml_errors (list): List of SAML errors
        slo_success (bool): SLO status

    Returns:
        index.html rendered template

    """
    is_auth = is_authenticated()
    if is_auth:
        if is_authenticated_through_direct_proxy():
            log.info(session.get('samlUserdata').items())
        if is_authenticated_through_fairdata_sso():
            log_sso_values()

    lang = get_language()
    if request.headers.get('X-Etsin-App', None) == 'qvain':
        app_title = translate(lang, 'qvain.title')
        app_description = translate(lang, 'qvain.description')
    else:
        app_title = translate(lang, 'etsin.title')
        app_description = translate(lang, 'etsin.description')

    return render_template('index.html', lang=lang, app_title=app_title, app_description=app_description)


# SAML authentication functions (not relevant for SSO)

@app.route('/saml_metadata/')
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

@app.route('/acs/', methods=['GET', 'POST'])
def saml_attribute_consumer_service_legacy():
    """The endpoint which is used by the saml library on auth.login call for both Etsin & Qvain"""
    # Workaround for local_development + old proxy
    host = request.headers.get('X-Forwarded-Host')
    if host == '30.30.30.30':
        return redirect('https://' + get_app_config(app.testing).get('SERVER_ETSIN_DOMAIN_NAME') + '/acs/', 307)

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
                redirect_url = 'https://' + app.config.get('SERVER_QVAIN_DOMAIN_NAME')

            # Redirect for Etsin
            if (logged_in_through == 'etsin'):
                redirect_url = 'https://' + app.config.get('SERVER_ETSIN_DOMAIN_NAME')

            if redirect_url:
                if 'RelayState' in request.form:
                    redirect_url = urljoin(redirect_url, unquote(request.form.get('RelayState')))
                return redirect(redirect_url)

        if 'RelayState' in request.form and self_url != request.form.get('RelayState'):
            return redirect(auth.redirect_to(unquote(request.form.get('RelayState'))))

    return _render_index_template(saml_errors=errors)

@app.route('/sls/', methods=['GET', 'POST'])
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
