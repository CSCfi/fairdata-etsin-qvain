# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Base functionalities for tests"""

import os

import pytest
import logging

from etsin_finder.utils.flags import initialize_supported_flags
from etsin_finder.app import create_app

from .utils import get_test_catalog_record

class BaseTest():
    """Use as base class for any tests. Contains fixtures and monkeypatched methods"""

    @pytest.fixture
    def app(self):
        """
        Create app in testing mode

        :return:
        """
        test_app = create_app(True)
        return test_app

    @pytest.fixture
    def authd_client(self, app, monkeypatch):
        """
        User-authenticated Flask test client, CSC user

        :param app:
        :param monkeypatch:
        :return:
        """
        from etsin_finder.auth import authentication
        monkeypatch.setattr(authentication, 'is_authenticated', lambda: True)
        monkeypatch.setattr(authentication, 'is_authenticated_CSC_user', lambda: True)

        client = app.test_client()
        with client as c:
            with c.session_transaction() as sess:
                sess['samlUserdata'] = {
                    'urn:oid:1.3.6.1.4.1.16161.4.0.53': ['teppo_testaaja'],
                    'urn:oid:2.5.4.42': ['Teppo'],
                    'urn:oid:2.5.4.4': ['Testaaja'],
                    'urn:oid:0.9.2342.19200300.100.1.3': ['teppo@yliopisto.fi']
                }
        return client

    @pytest.fixture
    def unauthd_client(self, app, monkeypatch):
        """
        Non-User-authenticated Flask test client

        :param app:
        :param monkeypatch:
        :return:
        """
        from etsin_finder.auth import authentication
        monkeypatch.setattr(authentication, 'is_authenticated', lambda: False)
        monkeypatch.setattr(authentication, 'is_authenticated_CSC_user', lambda: False)

        client = app.test_client()
        return client

    @pytest.fixture
    def nonexisting_catalog_record(self, monkeypatch):
        """
        Nonexisting catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: None)

    @pytest.fixture
    def open_catalog_record(self, monkeypatch):
        """
        Open access_type catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('open'))

    @pytest.fixture
    def login_catalog_record(self, monkeypatch):
        """
        Login access_type catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('login'))

    @pytest.fixture
    def permit_catalog_record(self, monkeypatch):
        """
        Permit access_type catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('permit'))

    @pytest.fixture
    def embargo_passed_catalog_record(self, monkeypatch):
        """
        Embargo access_type catalog record with embargo date passed

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('embargo', True))

    @pytest.fixture
    def embargo_not_passed_catalog_record(self, monkeypatch):
        """
        Embargo access_type catalog record with embargo date not passed

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('embargo', False))

    @pytest.fixture
    def restricted_catalog_record(self, monkeypatch):
        """
        Restricted access_type catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('restricted'))

    @pytest.fixture
    def has_rems_permit(self, monkeypatch):
        """
        Rems entitlement given

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import rems_service
        monkeypatch.setattr(rems_service, 'get_user_rems_permission_for_catalog_record', lambda x, y: True)

    @pytest.fixture
    def no_rems_permit(self, monkeypatch):
        """
        No Rems entitlement given

        :param monkeypatch:
        :return:
        """
        from etsin_finder.services import rems_service
        monkeypatch.setattr(rems_service, 'get_user_rems_permission_for_catalog_record', lambda x, y: False)

    if __name__ == '__main__':
        pytest.main()

    @pytest.fixture
    def expect_log(self, caplog):
        """
        Expect specific warnings and errors to be logged

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

            records = caplog.get_records('call')

            log_warnings = [x.message for x in records if x.levelno == logging.WARNING]
            assert len(warnings) == len(log_warnings)
            for (expected, logged) in zip(warnings, log_warnings):
                assert expected in logged

            log_errors = [x.message for x in records if x.levelno == logging.ERROR]
            for (expected, logged) in zip(errors, log_errors):
                assert expected in logged
            assert len(errors) == len(log_errors)

        return check
