# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Test Flask Restful most relevant API endpoints"""

from .basetest import BaseTest
import json


class TestDatasetResources(BaseTest):
    """Test Dataset API endpoints"""

    def test_nonexisting_dataset(self, unauthd_client, authd_client, nonexisting_catalog_record):
        """
        Test dataset API response with nonexisting dataset

        :param unauthd_client:
        :param authd_client:
        :param nonexisting_catalog_record:
        :return:
        """
        r = unauthd_client.get('/api/dataset/nonexisting')
        assert r.status_code == 400

        r = authd_client.get('/api/dataset/nonexisting')
        assert r.status_code == 400

    def test_open_dataset_unauthd_get(self, unauthd_client, open_catalog_record):
        """
        Test dataset API response with open dataset as unauthenticated user

        :param unauthd_client:
        :param open_catalog_record:
        :return:
        """
        r = unauthd_client.get('/api/dataset/123')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        self._assert_catalog_record_basics(r_json)
        self._assert_catalog_record_not_stripped(r_json)

    def test_open_dataset_authd_get(self, authd_client, open_catalog_record):
        """
        Test dataset API response with open dataset as authenticated user

        :param authd_client:
        :param open_catalog_record:
        :return:
        """
        r = authd_client.get('/api/dataset/123')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        self._assert_catalog_record_basics(r_json)
        self._assert_catalog_record_not_stripped(r_json)

    def test_login_dataset_unauthd_get(self, unauthd_client, login_catalog_record):
        """
        Test dataset API response with login dataset as unauthenticated user

        :param unauthd_client:
        :param login_catalog_record:
        :return:
        """
        r = unauthd_client.get('/api/dataset/123')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        self._assert_catalog_record_basics(r_json)
        self._assert_catalog_record_is_stripped(r_json)

    def test_login_dataset_authd_get(self, authd_client, login_catalog_record):
        """
        Test dataset API response with login dataset as authenticated user

        :param authd_client:
        :param login_catalog_record:
        :return:
        """
        r = authd_client.get('/api/dataset/123')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        self._assert_catalog_record_basics(r_json)
        self._assert_catalog_record_not_stripped(r_json)

    # def test_permit_dataset_unauthd_get(self, unauthd_client, permit_catalog_record, has_rems_permit):
    #     """
    #     Test dataset API response with permitted dataset as unauthenticated user

    #     :param unauthd_client:
    #     :param permit_catalog_record:
    #     :param has_rems_permit:
    #     :return:
    #     """
    #     r = unauthd_client.get('/api/dataset/123')
    #     assert r.status_code == 200
    #     r_json = json.loads(r.get_data())
    #     self._assert_catalog_record_basics(r_json)
    #     self._assert_catalog_record_is_stripped(r_json)

    # def test_permit_dataset_authd_permit_get(self, authd_client, permit_catalog_record, has_rems_permit):
    #     """
    #     Test dataset API response with permitted dataset as authenticated user

    #     :param authd_client:
    #     :param permit_catalog_record:
    #     :param has_rems_permit:
    #     :return:
    #     """
    #     r = authd_client.get('/api/dataset/456')
    #     assert r.status_code == 200
    #     r_json = json.loads(r.get_data())
    #     self._assert_catalog_record_basics(r_json)
    #     self._assert_catalog_record_not_stripped(r_json)

    # def test_permit_dataset_authd_no_permit_get(self, authd_client, permit_catalog_record, no_rems_permit):
    #     """
    #     Test dataset API response with non-permitted dataset as authenticated user

    #     :param authd_client:
    #     :param permit_catalog_record:
    #     :param no_rems_permit:
    #     :return:
    #     """
    #     r = authd_client.get('/api/dataset/123')
    #     assert r.status_code == 200
    #     r_json = json.loads(r.get_data())
    #     self._assert_catalog_record_basics(r_json)
    #     self._assert_catalog_record_is_stripped(r_json)

    def test_embargo_passed_dataset_unauthd_get(self, unauthd_client, embargo_passed_catalog_record):
        """
        Test dataset API response with embargo passed dataset as unauthenticated user

        :param unauthd_client:
        :param embargo_passed_catalog_record:
        :return:
        """
        r = unauthd_client.get('/api/dataset/123')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        self._assert_catalog_record_basics(r_json)
        self._assert_catalog_record_not_stripped(r_json)

    def test_embargo_not_passed_dataset_unauthd_get(self, unauthd_client, embargo_not_passed_catalog_record):
        """
        Test dataset API response with embargo not passed dataset as unauthenticated user

        :param unauthd_client:
        :param embargo_not_passed_catalog_record:
        :return:
        """
        r = unauthd_client.get('/api/dataset/123')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        self._assert_catalog_record_basics(r_json)
        self._assert_catalog_record_is_stripped(r_json)

    def test_restricted_dataset_unauthd_get(self, unauthd_client, restricted_catalog_record):
        """
        Test dataset API response with restricted dataset as unauthenticated user

        :param unauthd_client:
        :param restricted_catalog_record:
        :return:
        """
        r = unauthd_client.get('/api/dataset/123')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        self._assert_catalog_record_basics(r_json)
        self._assert_catalog_record_is_stripped(r_json)

    def test_restricted_dataset_authd_get(self, authd_client, restricted_catalog_record):
        """
        Test dataset API response with restricted dataset as authenticated user

        :param authd_client:
        :param login_catalog_record:
        :return:
        """
        r = authd_client.get('/api/dataset/123')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        self._assert_catalog_record_basics(r_json)
        self._assert_catalog_record_is_stripped(r_json)

    def _assert_catalog_record_basics(self, cr_json):
        assert 'catalog_record' in cr_json
        assert 'research_dataset' in cr_json['catalog_record']

    def _assert_catalog_record_not_stripped(self, cr_json):
        assert 'files' in cr_json['catalog_record']['research_dataset']
        assert 'title' in cr_json['catalog_record']['research_dataset']['files'][0]
        assert 'description' in cr_json['catalog_record']['research_dataset']['files'][0]
        assert 'project_identifier' in cr_json['catalog_record']['research_dataset']['files'][0]['details']

        assert 'directories' in cr_json['catalog_record']['research_dataset']
        assert 'title' in cr_json['catalog_record']['research_dataset']['directories'][0]
        assert 'description' in cr_json['catalog_record']['research_dataset']['directories'][0]
        assert 'project_identifier' in cr_json['catalog_record']['research_dataset']['directories'][0]['details']

    def _assert_catalog_record_is_stripped(self, cr_json):
        assert 'files' in cr_json['catalog_record']['research_dataset']
        assert 'title' not in cr_json['catalog_record']['research_dataset']['files'][0]
        assert 'description' not in cr_json['catalog_record']['research_dataset']['files'][0]
        assert 'project_identifier' not in cr_json['catalog_record']['research_dataset']['files'][0]['details']

        assert 'directories' in cr_json['catalog_record']['research_dataset']
        assert 'title' not in cr_json['catalog_record']['research_dataset']['directories'][0]
        assert 'description' not in cr_json['catalog_record']['research_dataset']['directories'][0]
        assert 'project_identifier' not in cr_json['catalog_record']['research_dataset']['directories'][0]['details']


class TestUserResources(BaseTest):
    """Test User API endpoints"""

    def test_unauthd_get(self, unauthd_client):
        """
        Test user API when user not authenticated

        :param unauthd_client:
        :return:
        """
        r = unauthd_client.get('/api/user')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        assert 'is_authenticated' in r_json and not r_json['is_authenticated']

    def test_authd_get(self, authd_client):
        """
        Test user API when user is authenticated

        :param authd_client:
        :return:
        """
        r = authd_client.get('/api/user')
        assert r.status_code == 200
        r_json = json.loads(r.get_data())
        assert 'is_authenticated' in r_json
