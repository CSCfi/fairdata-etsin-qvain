"""Test suite for authentication.

Test suite should cover at least:
    - views/auth_views.py
    - auth/authentication.py
    - auth/authentication_direct_proxy.py
    - auth/authentication_fairdata_sso.py
"""

from flask.globals import session
import jwt
import json
from werkzeug import http
from etsin_finder.auth.authentication import (
    get_user_csc_name,
    get_user_email,
    get_user_firstname,
    get_user_haka_identifier,
    get_user_home_organization_id,
    get_user_home_organization_name,
    get_user_id,
    get_user_ida_projects,
    get_user_lastname,
    is_authenticated,
    is_authenticated_CSC_user,
)
from etsin_finder.auth.authentication_fairdata_sso import join_redirect_url_path
from etsin_finder.utils.constants import SAML_ATTRIBUTES
from etsin_finder.views.auth_views import (
    sso_login_url,
    sso_logout_url,
    login_etsin,
    login_qvain,
)
from .basetest import BaseTest


class MockSamlAuth:
    """Mock auth class."""

    def login(self, url):
        """Saml auth fake login."""
        return "fake url"


def make_sso_user_cookie(user):
    """Create a sso user cookie for tests."""
    encrypted_session = jwt.encode({"authenticated_user": user}, "fake key")
    return http.dump_cookie("fd_test_csc_fi_fd_sso_session", encrypted_session)


def make_sso_cookie(cookie):
    """Create a sso user cookie for tests."""
    encrypted_session = jwt.encode(cookie, "fake key")
    return http.dump_cookie("fd_test_csc_fi_fd_sso_session", encrypted_session)


class TestAuth(BaseTest):
    """Test class for auth."""

    def test_sso_login_url(self, session_lang_en, app):
        """Return SSO login url for service."""
        with app.test_request_context():
            test_service = "FAKE_SERVICE"
            query = sso_login_url(test_service)
            assert (
                query
                == "sso_fake_host/login?service=FAKE_SERVICE&redirect_url=https%3A%2F%2Fface_service&language=en"
            )

    def test_sso_logout_url(self, session_lang_en, app):
        """Return SSO logout url for service."""
        with app.test_request_context():
            test_service = "FAKE_SERVICE"
            query = sso_logout_url(test_service)
            assert (
                query
                == "sso_fake_host/logout?service=FAKE_SERVICE&redirect_url=https%3A%2F%2Fface_service&language=en"
            )

    def test_login_etsin_force_sso(self, app, session_lang_en, mocker):
        """Return SSO login url for etsin."""
        sso_cookie = http.dump_cookie("sso_authentication", "True")
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            redirect = mocker.patch(
                "etsin_finder.views.auth_views.redirect",
            )
            login_etsin()
            redirect.assert_called_once_with(
                "sso_fake_host/login?service=ETSIN&redirect_url=https%3A%2F%2Fetsin&language=en"
            )

    def test_login_etsin_saml(self, app, session_lang_en, mocker):
        """Return SAML login url."""
        with app.test_request_context() as cxt:
            saml_auth = mocker.patch(
                "etsin_finder.views.auth_views.get_saml_auth",
                return_value=MockSamlAuth(),
            )
            redirect = mocker.patch(
                "etsin_finder.views.auth_views.redirect",
            )
            login_etsin()
            saml_auth.assert_called_once_with(cxt.request, "_ETSIN")
            redirect.assert_called_once_with("fake url")

    def test_login_qvain_force_sso(self, app, session_lang_en, mocker):
        """Return SSO login url for qvain."""
        sso_cookie = http.dump_cookie("sso_authentication", "True")
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            redirect = mocker.patch(
                "etsin_finder.views.auth_views.redirect",
            )
            login_qvain()
            redirect.assert_called_once_with(
                "sso_fake_host/login?service=QVAIN&redirect_url=https%3A%2F%2Fqvain&language=en"
            )

    def test_login_qvain_saml(self, app, session_lang_en, mocker):
        """Return SAML login url."""
        with app.test_request_context() as cxt:
            saml_auth = mocker.patch(
                "etsin_finder.views.auth_views.get_saml_auth",
                return_value=MockSamlAuth(),
            )
            redirect = mocker.patch(
                "etsin_finder.views.auth_views.redirect",
            )
            login_qvain()
            saml_auth.assert_called_once_with(cxt.request, "_QVAIN")
            redirect.assert_called_once_with("fake url")

    def test_is_authenticated_sso(self, app):
        """Return True."""
        sso_cookie = make_sso_user_cookie({"id": "teppo"})
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            auth = is_authenticated()
            assert auth is True

    def test_is_authenticated_proxy(self, app):
        """Return True."""
        with app.test_request_context():
            session["samlUserdata"] = "anything"
            auth = is_authenticated()
            assert auth is True

    def test_is_authenticated_CSC_user_sso(self, app):
        """Return True."""
        sso_cookie = make_sso_user_cookie({"id": "teppo"})
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            auth = is_authenticated_CSC_user()
            assert auth is True

    def test_is_authenticated_CSC_user_proxy(self, app):
        """Return True."""
        with app.test_request_context():
            session["samlUserdata"] = {SAML_ATTRIBUTES.get("CSC_username"): ["teppo"]}
            auth = is_authenticated_CSC_user()
            assert auth is True

    def test_is_authenticated_fail(self, app):
        """Return False."""
        with app.test_request_context():
            auth = is_authenticated_CSC_user()
            assert auth is False

    def test_get_user_csc_name_proxy(self, app):
        """Return teppo."""
        with app.test_request_context():
            session["samlUserdata"] = {SAML_ATTRIBUTES.get("CSC_username"): ["teppo"]}
            name = get_user_csc_name()
            assert name == "teppo"

    def test_get_user_csc_name_sso(self, app):
        """Return teppo."""
        sso_cookie = make_sso_user_cookie({"id": "teppo"})
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            name = get_user_csc_name()
            assert name == "teppo"

    def test_get_user_id_sso(self, app):
        """Return teppo."""
        sso_cookie = make_sso_user_cookie({"id": "teppo"})
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            id = get_user_id()
            assert id == "teppo"

    def test_get_user_csc_id_haka(self, app):
        """Return teppo."""
        with app.test_request_context():
            session["samlUserdata"] = {
                SAML_ATTRIBUTES.get("haka_id"): ["teppo"],
            }
            id = get_user_id()
            assert id == "teppo"

    def test_get_user_email_not_authenticated(self, app):
        """Return None."""
        with app.test_request_context():
            email = get_user_email()
            assert email is None

    def test_get_user_email_proxy(self, app):
        """Return teppo@testaa.fi."""
        value = "teppo@testaa.fi"
        with app.test_request_context():
            session["samlUserdata"] = {
                SAML_ATTRIBUTES.get("CSC_username"): ["teppo"],
                SAML_ATTRIBUTES.get("email"): [value],
            }
            email = get_user_email()
            assert email == value

    def test_get_user_email_sso(self, app):
        """Return teppo@testaa.fi."""
        value = "teppo@testaa.fi"
        sso_cookie = make_sso_user_cookie({"id": "teppo", "email": value})
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            email = get_user_email()
            assert email == value

    def test_get_user_firstname_proxy(self, app):
        """Return Teppo."""
        value = "Teppo"
        with app.test_request_context():
            session["samlUserdata"] = {
                SAML_ATTRIBUTES.get("CSC_username"): ["teppo"],
                SAML_ATTRIBUTES.get("first_name"): [value],
            }
            name = get_user_firstname()
            assert name == value

    def test_get_user_firstname_sso(self, app):
        """Return Teppo."""
        value = "Teppo"
        sso_cookie = make_sso_user_cookie({"id": "teppo", "firstname": value})
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            name = get_user_firstname()
            assert name == value

    def test_get_user_lastname_proxy(self, app):
        """Return Testaaja."""
        value = "Testaaja"
        with app.test_request_context():
            session["samlUserdata"] = {
                SAML_ATTRIBUTES.get("CSC_username"): ["teppo"],
                SAML_ATTRIBUTES.get("last_name"): [value],
            }
            name = get_user_lastname()
            assert name == value

    def test_get_user_lasttname_sso(self, app):
        """Return Testaaja."""
        value = "Testaaja"
        sso_cookie = make_sso_user_cookie({"id": "teppo", "lastname": "Testaaja"})
        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            name = get_user_lastname()
            assert name == value

    def test_get_user_ida_projects_no_auth(self, app):
        """Return None."""
        with app.test_request_context():
            returnValue = get_user_ida_projects()
            assert returnValue is None

    def test_get_user_ida_projects_proxy(self, app):
        """Return array containing ida group."""
        value = "IDA01:group"
        with app.test_request_context():
            session["samlUserdata"] = {
                SAML_ATTRIBUTES.get("CSC_username"): ["teppo"],
                SAML_ATTRIBUTES.get("idm_groups"): [value],
            }
            returnValue = get_user_ida_projects()
            assert returnValue == ["group"]

    def test_get_user_ida_projects_sso(self, app):
        """Return array containing ida group."""
        value = ["IDA01:group"]
        sso_cookie = make_sso_cookie(
            {
                "authenticated_user": {"id": "teppo"},
                "services": {"IDA": {"projects": value}},
            }
        )

        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            name = get_user_ida_projects()
            assert name == value

    def test_get_user_ida_projects_no_ida_sso(self, app):
        """Return None."""
        value = None
        sso_cookie = make_sso_cookie(
            {
                "authenticated_user": {"id": "teppo"},
                "services": {},
            }
        )

        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            name = get_user_ida_projects()
            assert name == value

    def test_get_user_ida_projects_no_projects_sso(self, app):
        """Return None."""
        value = None
        sso_cookie = make_sso_cookie(
            {
                "authenticated_user": {"id": "teppo"},
                "services": {"IDA": {}},
            }
        )

        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            name = get_user_ida_projects()
            assert name == value

    def test_get_user_home_organization_id_no_auth(self, app):
        """Return None."""
        with app.test_request_context():
            returnValue = get_user_home_organization_id()
            assert returnValue is None

    def test_get_user_home_organization_id_proxy(self, app):
        """Return Home organization (TGI)."""
        value = "TGI"
        with app.test_request_context():
            session["samlUserdata"] = {
                SAML_ATTRIBUTES.get("CSC_username"): ["teppo"],
                SAML_ATTRIBUTES.get("haka_org_id"): [value],
            }
            returnValue = get_user_home_organization_id()
            assert returnValue == value

    def test_get_user_home_organization_id_sso(self, app):
        """Return Home organisation id (TGI)."""
        value = "TGI"
        sso_cookie = make_sso_user_cookie(
            {"id": "teppo", "organization": {"id": value}}
        )

        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            name = get_user_home_organization_id()
            assert name == value

    def test_get_user_home_organization_name_no_auth(self, app):
        """Return None."""
        with app.test_request_context():
            returnValue = get_user_home_organization_name()
            assert returnValue is None

    def test_get_user_home_organization_name_proxy(self, app):
        """Return Home organization (Test Group Inc)."""
        value = "Test Group Inc"
        with app.test_request_context():
            session["samlUserdata"] = {
                SAML_ATTRIBUTES.get("CSC_username"): ["teppo"],
                SAML_ATTRIBUTES.get("haka_org_name"): [value],
            }
            returnValue = get_user_home_organization_name()
            assert returnValue == value

    def test_get_user_home_organization_name_sso(self, app):
        """Return Home organisation id (Test Group Inc)."""
        value = "Test Group Inc"
        sso_cookie = make_sso_user_cookie(
            {"id": "teppo", "organization": {"name": value}}
        )

        with app.test_request_context(headers={"COOKIE": sso_cookie}):
            name = get_user_home_organization_name()
            assert name == value

    def test_get_user_haka_id(self, app):
        """Return haka id (testaaja)."""
        value = "testaaja"
        with app.test_request_context():
            session["samlUserdata"] = {
                SAML_ATTRIBUTES.get("CSC_username"): ["teppo"],
                SAML_ATTRIBUTES.get("haka_id"): [value],
            }
            returnValue = get_user_haka_identifier()
            assert returnValue == value

    def test_join_redirect_path_not_a_redirect(self):
        """Return url."""
        base_url = "some Weird s**t.com/"
        query = 'films/top100?search="Hollywood\'s most wanted!"&filter_moomoos'
        expected_value = base_url
        result = join_redirect_url_path(base_url, query)
        assert result == expected_value

    def test_join_redirect_path(self):
        """Return url."""
        base_url = "https://test.com/?redirect_url=https://hollywood.com"
        path = '/films&search="silverstone"'
        expected_value = "https://test.com/?redirect_url=https%3A%2F%2Fhollywood.com%2Ffilms%26search%3D%22silverstone%22"
        result = join_redirect_url_path(base_url, path)
        assert result == expected_value
