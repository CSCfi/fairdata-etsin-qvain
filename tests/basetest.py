# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Base functionalities for tests."""

import os
import jwt
from werkzeug import http
import pytest
import logging
import jinja2

from etsin_finder.utils.flags import initialize_supported_flags
from etsin_finder.app import create_app
from flask_mail import email_dispatched

from .utils import get_test_catalog_record


def make_sso_user_cookie(user):
    """Create a sso user cookie for tests."""
    encrypted_session = jwt.encode({"authenticated_user": user}, "fake key")
    return http.dump_cookie("fd_test_csc_fi_fd_sso_session", encrypted_session, path=None)


def make_sso_cookie(cookie):
    """Create a sso user cookie for tests."""
    encrypted_session = jwt.encode(cookie, "fake key")
    return http.dump_cookie("fd_test_csc_fi_fd_sso_session", encrypted_session, path=None)


class FakeLoader(jinja2.BaseLoader):
    """Fake loader to avoid depending on index.html in tests."""

    def get_source(self, environment, template):
        """Return dummy template."""
        return "hello test", None, lambda: False


class BaseTest:
    """Use as base class for any tests. Contains fixtures and monkeypatched methods."""

    @pytest.fixture
    def app(self):
        """
        Create app in testing mode.

        :return:
        """
        test_app = create_app(True)
        test_app.jinja_loader = FakeLoader()
        return test_app

    @pytest.fixture
    def capture_mail(self, app):
        """Keep track of sent emails"""
        messages = []

        def sent(app, message):
            messages.append(message)

        email_dispatched.connect(sent, weak=True)
        yield messages  # yield instead of return to keep signal alive until teardown

    @pytest.fixture
    def authd_client(self, app, monkeypatch):
        """
        User-authenticated Flask test client, CSC user.

        :param app:
        :param monkeypatch:
        :return:
        """
        from etsin_finder.auth import authentication

        monkeypatch.setattr(authentication, "is_authenticated", lambda: True)
        monkeypatch.setattr(authentication, "is_authenticated_CSC_user", lambda: True)

        client = app.test_client()
        with client as c:
            with c.session_transaction() as sess:
                sess["samlUserdata"] = {
                    "urn:oid:1.3.6.1.4.1.16161.4.0.53": ["teppo_testaaja"],
                    "urn:oid:2.5.4.42": ["Teppo"],
                    "urn:oid:2.5.4.4": ["Testaaja"],
                    "urn:oid:0.9.2342.19200300.100.1.3": ["teppo@yliopisto.fi"],
                }
        return client

    @pytest.fixture
    def session_lang_en(self, app, monkeypatch):
        """
        User-authenticated Flask test client, CSC user.

        :param app:
        :param monkeypatch:
        :return:
        """
        from etsin_finder.auth import authentication

        monkeypatch.setattr(authentication, "is_authenticated", lambda: True)
        monkeypatch.setattr(authentication, "is_authenticated_CSC_user", lambda: True)

        client = app.test_client()
        with client as c:
            with c.session_transaction() as sess:
                sess["language"] = "en"
        return client

    @pytest.fixture
    def authd_no_user_name(self, monkeypatch):
        """
        User-authenticated Flask test client, CSC user.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.auth import authentication

        monkeypatch.setattr(authentication, "is_authenticated", lambda: True)
        monkeypatch.setattr(authentication, "get_user_csc_name", lambda: None)

    @pytest.fixture
    def user_details(self, monkeypatch):
        """
          CSC user details.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.auth import authentication

        monkeypatch.setattr(authentication, "is_authenticated", lambda: True)
        monkeypatch.setattr(
            authentication, "get_user_csc_name", lambda: "teppo_testaaja"
        )
        monkeypatch.setattr(
            authentication, "get_user_email", lambda: "teppo@yliopisto.fi"
        )
        monkeypatch.setattr(authentication, "get_user_firstname", lambda: "Teppo")
        monkeypatch.setattr(authentication, "get_user_lastname", lambda: "Testaaja")

        return {
            "userid": "teppo_testaaja",
            "email": "teppo@yliopisto.fi",
            "name": "Teppo Testaaja",
        }

    @pytest.fixture
    def user_123_details(self, monkeypatch):
        """
          CSC abc-user-123 details. The user is creator of test data.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.auth import authentication

        monkeypatch.setattr(authentication, "is_authenticated", lambda: True)
        monkeypatch.setattr(authentication, "get_user_csc_name", lambda: "abc-user-123")
        monkeypatch.setattr(
            authentication, "get_user_email", lambda: "test.user.123@yliopisto.fi"
        )
        monkeypatch.setattr(authentication, "get_user_firstname", lambda: "Test")
        monkeypatch.setattr(authentication, "get_user_lastname", lambda: "User")

        return {
            "userid": "abc-user-123",
            "email": "test.user.123@yliopisto.fi",
            "name": "Test User",
        }

    @pytest.fixture
    def no_IDA_projects(self, monkeypatch):
        """User with no IDA projects."""
        from etsin_finder.auth import authentication

        monkeypatch.setattr(authentication, "get_user_ida_projects", lambda: None)

    @pytest.fixture
    def IDA_project_info_missing(self, monkeypatch):
        """User with IDA projects information missing/faulty."""
        from etsin_finder.auth import authentication

        monkeypatch.setattr(authentication, "get_user_ida_projects", lambda: False)

    @pytest.fixture
    def IDA_projects_dont_match(self, monkeypatch):
        """User with IDA projects that don't match with files and directories."""
        from etsin_finder.auth import authentication

        monkeypatch.setattr(
            authentication, "get_user_ida_projects", lambda: ["project_y"]
        )

    @pytest.fixture
    def IDA_projects_ok(self, monkeypatch):
        """User with correct IDA project."""
        from etsin_finder.auth import authentication

        monkeypatch.setattr(
            authentication, "get_user_ida_projects", lambda: ["project_x"]
        )

    @pytest.fixture
    def unauthd_client(self, app, monkeypatch):
        """
        Non-User-authenticated Flask test client.

        :param app:
        :param monkeypatch:
        :return:
        """
        from etsin_finder.auth import authentication

        monkeypatch.setattr(authentication, "is_authenticated", lambda: False)
        monkeypatch.setattr(authentication, "is_authenticated_CSC_user", lambda: False)

        client = app.test_client()
        return client

    @pytest.fixture
    def nonexisting_catalog_record(self, monkeypatch):
        """
        Nonexisting catalog record.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service

        monkeypatch.setattr(cr_service, "get_catalog_record", lambda x, y, z=None: None)

    @pytest.fixture
    def open_catalog_record(self, monkeypatch):
        """
        Open access_type catalog record.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service

        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda x, y, z=None: get_test_catalog_record("open"),
        )

    @pytest.fixture
    def draft_catalog_record(self, monkeypatch):
        """
        Draft catalog record.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service

        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda x, y, z=None: get_test_catalog_record("open", draft=True),
        )

    @pytest.fixture
    def login_catalog_record(self, monkeypatch):
        """
        Login access_type catalog record.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service

        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda x, y, z: get_test_catalog_record("login"),
        )

    @pytest.fixture
    def permit_catalog_record(self, monkeypatch):
        """
        Permit access_type catalog record.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service

        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda x, y, z: get_test_catalog_record("permit"),
        )

    @pytest.fixture
    def embargo_passed_catalog_record(self, monkeypatch):
        """
        Embargo access_type catalog record with embargo date passed.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service

        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda x, y, z: get_test_catalog_record("embargo", True),
        )

    @pytest.fixture
    def embargo_not_passed_catalog_record(self, monkeypatch):
        """
        Embargo access_type catalog record with embargo date not passed.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service

        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda x, y, z: get_test_catalog_record("embargo", False),
        )

    @pytest.fixture
    def restricted_catalog_record(self, monkeypatch):
        """
        Restricted access_type catalog record.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service

        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda x, y, z: get_test_catalog_record("restricted"),
        )

    @pytest.fixture
    def nonstandard_catalog_record(self, monkeypatch):
        """
        Nonstandard catalog record.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service

        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda x, y, z=None: {
                "metadata_provider_user": "teppo_testaaja",
                "data_catalog": {"catalog_json": {"identifier": "nonstandard"}},
            },
        )

    @pytest.fixture
    def has_rems_permit(self, monkeypatch):
        """
        Rems entitlement given.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import rems_service

        monkeypatch.setattr(
            rems_service,
            "get_user_rems_permission_for_catalog_record",
            lambda x, y: True,
        )
        from etsin_finder.auth import authorization

        monkeypatch.setattr(
            authorization, "user_has_rems_permission_for_catalog_record", lambda x: True
        )

    @pytest.fixture
    def no_rems_permit(self, monkeypatch):
        """
        No Rems entitlement given.

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import rems_service

        monkeypatch.setattr(
            rems_service,
            "get_user_rems_permission_for_catalog_record",
            lambda x, y: False,
        )
        from etsin_finder.auth import authorization

        monkeypatch.setattr(
            authorization,
            "user_has_rems_permission_for_catalog_record",
            lambda x: False,
        )

    if __name__ == "__main__":
        pytest.main()

    @pytest.fixture
    def expect_log(self, caplog):
        """
        Expect specific warnings and errors to be logged.

        The number logged warnings and errors of must match
        the length of the supplied warnings/errors lists, and
        each log must contain the matching substring.

        E.g. with warnings=['something happened'], there must be exactly
        one warning and it must contain the substring 'something happened'.
        When called with no parameters, there must be no logged warnings or errors.

        Args:
            warnings (list of str): Substrings expected in warnings
            errors (list of str): Substrings expected in errors

        """

        def check(warnings=None, errors=None):
            warnings = warnings or []
            errors = errors or []

            records = caplog.get_records("call")

            log_warnings = [x.message for x in records if x.levelno == logging.WARNING]
            assert len(warnings) == len(log_warnings)
            for (expected, logged) in zip(warnings, log_warnings):
                assert expected in logged

            log_errors = [x.message for x in records if x.levelno == logging.ERROR]
            for (expected, logged) in zip(errors, log_errors):
                assert expected in logged
            assert len(errors) == len(log_errors)

        return check
