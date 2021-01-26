# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Development helper routes."""

from flask import Blueprint, session, redirect, request

from etsin_finder.auth.authentication_direct_proxy import reset_flask_session_on_login

dev_views = Blueprint('dev_views', __name__)

def fakelogin():
    """Create fake login session"""
    reset_flask_session_on_login()
    session['samlUserdata'] = {
        'urn:oid:1.3.6.1.4.1.8057.2.80.26': [
            "IDA01:research_project_112",
            "IDA01:string",
            "IDA01:project_x",
        ],
        'urn:oid:2.5.4.42': ["teppå"], # firstname
        'urn:oid:2.5.4.4': ["testaaja"], # lastname
        'urn:oid:2.5.4.3': ["teppå testaa taas"], # cn
        "urn:oid:1.3.6.1.4.1.16161.4.0.53": ["teppo"], # csc user id
        "urn:oid:1.3.6.1.4.1.8057.2.80.9": ["tepon_testi"],
        "urn:oid:1.3.6.1.4.1.25178.1.2.9": ["test.csc.fi"], # org id
        "urn:oid:1.3.6.1.4.1.16161.4.0.88": ["testi-organisaatio"], # org
        'urn:oid:0.9.2342.19200300.100.1.3': ["teponemail@example.com"]
    }
    session['samlNameId'] = "nameid"
    session['samlSessionIndex'] = "sessionindex"
    session.permanent = True

@dev_views.route('/sso/teppo')
def login_teppo():
    """Create login session without needing authentication"""
    fakelogin()
    host = request.headers.get('X-Forwarded-Host')
    return redirect(f'https://{host}/')
