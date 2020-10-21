# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for routing traffic from Flask to frontend. Additionally handles authentication related routes."""
from urllib.parse import quote, unquote

from flask import make_response, render_template, redirect, request, session
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
from etsin_finder.app import app
from etsin_finder.log import log
from etsin_finder.localization import get_language, translate

# REACT APP RELATED

@app.route('/sso/etsin')
def login_etsin():
    """Endpoint which frontend should call when wanting to perform a login as Etsin

    Returns:
        Redirect the login.

    """
    auth = get_saml_auth(request, '_ETSIN')
    redirect_url = quote(request.args.get('relay', '/'))
    login_url = auth.login(redirect_url)
    login_url = join_redirect_url_path(login_url, redirect_url)
    return redirect(login_url)

@app.route('/sso/qvain')
def login_qvain():
    """Endpoint which frontend should call when wanting to perform a login as Qvain

    Returns:
        Redirect the login.

    """
    auth = get_saml_auth(request, '_QVAIN')
    redirect_url = quote(request.args.get('relay', '/'))
    login_url = auth.login(redirect_url)
    login_url = join_redirect_url_path(login_url, redirect_url)
    return redirect(login_url)

@app.route('/slo/etsin')
def logout_etsin():
    """Endpoint which frontend should call when wanting to perform a logout from Etsin

    Currently not working since Fairdata authentication service does not support SLO.

    Returns:
        Redirect the logout.

    """
    auth = get_saml_auth(request, '_ETSIN')
    name_id = None
    session_index = None
    if 'samlNameId' in session:
        name_id = session.get('samlNameId')
    if 'samlSessionIndex' in session:
        session_index = session.get('samlSessionIndex')
    log.debug("LOGOUT request to /slo/etsin")
    # Clear the flask session here because the idp doesnt seem to call the sls route.
    session.clear()
    return redirect(auth.logout(name_id=name_id, session_index=session_index))

@app.route('/slo/qvain')
def logout_qvain():
    """Endpoint which frontend should call when wanting to perform a logout from Qvain

    Currently not working since Fairdata authentication service does not support SLO.

    Returns:
        Redirect the logout.

    """
    auth = get_saml_auth(request, '_QVAIN')
    name_id = None
    session_index = None
    if 'samlNameId' in session:
        name_id = session.get('samlNameId')
    if 'samlSessionIndex' in session:
        session_index = session.get('samlSessionIndex')
    log.debug("LOGOUT request to /slo/qvain")
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
    return _render_index_template()

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


# SAML AUTHENTICATION RELATED

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
