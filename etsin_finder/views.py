from urllib.parse import urlparse, quote

from flask import make_response, render_template, redirect, request, session
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from onelogin.saml2.utils import OneLogin_Saml2_Utils

from etsin_finder.finder import app
from etsin_finder.utils import executing_travis

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


def get_saml_auth(flask_request):
    return OneLogin_Saml2_Auth(prepare_flask_request_for_saml(flask_request), custom_base_path=app.config['SAML_PATH'])


def init_saml_auth(saml_prepared_flask_request):
    return OneLogin_Saml2_Auth(saml_prepared_flask_request, custom_base_path=app.config['SAML_PATH'])


def is_authenticated():
    if executing_travis():
        return False
    auth = get_saml_auth(request)
    return True if auth.is_authenticated and 'samlUserdata' in session and len(session['samlUserdata']) > 0 else False


def prepare_flask_request_for_saml(request):
    # If server is behind proxys or balancers use the HTTP_X_FORWARDED fields
    url_data = urlparse(request.url)
    return {
        'https': 'on' if request.scheme == 'https' else 'off',
        'http_host': request.host,
        'server_port': url_data.port,
        'script_name': request.path,
        'get_data': request.args.copy(),
        'post_data': request.form.copy()
        # "lowercase_urlencoding": "",
        # "request_uri": "",
        # "query_string": ""

    }


def reset_flask_session_on_login():
    session.clear()
    session.permanent = True


def reset_flask_session_on_logout():
    session.clear()
