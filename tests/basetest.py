# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Base functionalities for tests"""

import os

import pytest

from .utils import get_test_catalog_record


class BaseTest():
    """Use as base class for any tests. Contains fixtures and monkeypatched methods"""

    @pytest.fixture
    def app(self):
        """
        App fixture where testing flag is set as True

        :return:
        """
        os.environ['TESTING'] = 'True'
        from etsin_finder.finder import app
        return app

    @pytest.fixture
    def authd_client(self, app, monkeypatch):
        """
        User-authenticated Flask test client

        :param app:
        :param monkeypatch:
        :return:
        """
        from etsin_finder import authentication
        monkeypatch.setattr(authentication, 'is_authenticated', lambda: True)

        client = app.test_client()
        with client as c:
            with c.session_transaction() as sess:
                sess['samlUserdata'] = {
                    'urn:oid:2.5.4.3': ['Teppo Testaaja'],
                    'urn:oid:1.3.6.1.4.1.8057.2.80.9': ['teppo@yliopisto.fi']
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
        from etsin_finder import authentication
        monkeypatch.setattr(authentication, 'is_authenticated', lambda: False)

        client = app.test_client()
        return client

    @pytest.fixture
    def nonexisting_catalog_record(self, monkeypatch):
        """
        Nonexisting catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: None)

    @pytest.fixture
    def open_catalog_record(self, monkeypatch):
        """
        Open access_type catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('open'))

    @pytest.fixture
    def login_catalog_record(self, monkeypatch):
        """
        Login access_type catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('login'))

    @pytest.fixture
    def permit_catalog_record(self, monkeypatch):
        """
        Permit access_type catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('permit'))

    @pytest.fixture
    def embargo_passed_catalog_record(self, monkeypatch):
        """
        Embargo access_type catalog record with embargo date passed

        :param monkeypatch:
        :return:
        """
        from etsin_finder import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('embargo', True))

    @pytest.fixture
    def embargo_not_passed_catalog_record(self, monkeypatch):
        """
        Embargo access_type catalog record with embargo date not passed

        :param monkeypatch:
        :return:
        """
        from etsin_finder import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('embargo', False))

    @pytest.fixture
    def restricted_catalog_record(self, monkeypatch):
        """
        Restricted access_type catalog record

        :param monkeypatch:
        :return:
        """
        from etsin_finder import cr_service
        monkeypatch.setattr(cr_service, 'get_catalog_record', lambda x, y, z: get_test_catalog_record('restricted'))

    @pytest.fixture
    def has_rems_permit(self, monkeypatch):
        """
        Rems entitlement given

        :param monkeypatch:
        :return:
        """
        from etsin_finder import rems_service
        monkeypatch.setattr(rems_service, 'get_user_rems_permission_for_catalog_record', lambda x, y: True)

    @pytest.fixture
    def no_rems_permit(self, monkeypatch):
        """
        No Rems entitlement given

        :param monkeypatch:
        :return:
        """
        from etsin_finder import rems_service
        monkeypatch.setattr(rems_service, 'get_user_rems_permission_for_catalog_record', lambda x, y: False)

    if __name__ == '__main__':
        pytest.main()
