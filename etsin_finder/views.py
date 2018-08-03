# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from urllib.parse import quote

from flask import make_response, render_template, redirect, request, session
from onelogin.saml2.utils import OneLogin_Saml2_Utils

from etsin_finder.authentication import \
    get_saml_auth, \
    is_authenticated, \
    init_saml_auth, \
    prepare_flask_request_for_saml, \
    reset_flask_session_on_login
from etsin_finder.finder import app

log = app.logger


# REACT APP RELATED

@app.route('/sso')
def login():
    auth = get_saml_auth(request)
    redirect_url = quote(request.args.get('relay', '/'))
    return redirect(auth.login(redirect_url))


@app.route('/slo')
def logout():
    auth = get_saml_auth(request)
    name_id = None
    session_index = None
    if 'samlNameId' in session:
        name_id = session['samlNameId']
    if 'samlSessionIndex' in session:
        session_index = session['samlSessionIndex']

    return redirect(auth.logout(name_id=name_id, session_index=session_index))


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def frontend_app(path):
    return _render_index_template()


def _render_index_template(saml_errors=[], slo_success=False):
    is_auth = is_authenticated()
    if is_auth:
        saml_attributes = session['samlUserdata'].items()
        log.debug("SAML attributes: {0}".format(saml_attributes))

    return render_template('index.html')


# SAML AUTHENTICATION RELATED

@app.route('/saml_metadata/')
def saml_metadata():
    auth = get_saml_auth(request)
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
def saml_attribute_consumer_service():
    reset_flask_session_on_login()
    req = prepare_flask_request_for_saml(request)
    auth = init_saml_auth(req)
    auth.process_response()
    errors = auth.get_errors()
    if len(errors) == 0 and auth.is_authenticated():
        session['samlUserdata'] = auth.get_attributes()
        session['samlNameId'] = auth.get_nameid()
        session['samlSessionIndex'] = auth.get_session_index()
        self_url = OneLogin_Saml2_Utils.get_self_url(req)
        log.debug("SESSION: {0}".format(session))
        if 'RelayState' in request.form and self_url != request.form['RelayState']:
            return redirect(auth.redirect_to(request.form['RelayState']))

    return _render_index_template(saml_errors=errors)


@app.route('/sls/', methods=['GET', 'POST'])
def saml_single_logout_service():
    auth = get_saml_auth(request)
    slo_success = False
    url = auth.process_slo(delete_session_cb=lambda: session.clear())
    errors = auth.get_errors()
    if len(errors) == 0:
        if url is not None:
            return redirect(url)
        else:
            slo_success = True

    return _render_index_template(saml_errors=errors, slo_success=slo_success)
