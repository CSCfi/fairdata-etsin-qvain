# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""
Test Download v2 restpoints

Uses the requests_mock fixture provided by the requests-mock
library for mocking the Download API endpoints.
"""

import json
import pytest
import requests

from .basetest import BaseTest

fakePackage = {
    'package': 'x.zip',
    'status': 'SUCCESS',
}

fakeNoActiveTasks = {
    'error': 'no active package generation tasks',
}

fakeNoDataset = {
    'error': 'dataset not found in metax',
}

fakeToken = {
    'token': 'abcdf00f',
}

fakePackageDownloadUrl = {
    'url': f"https://mock-download-public:2/download?token={fakeToken['token']}&dataset=1&package=x.zip",
}

fakeFileDownloadUrl = {
    'url': f"https://mock-download-public:2/download?token={fakeToken['token']}&dataset=1&file=/folder/filename.gif",
}


def match_dataset(dataset):
    """Matcher that requires supplied dataset parameter to match."""
    def matcher(request):
        return request.json().get('dataset') == str(dataset)
    return matcher

class TestDownloadResourcesRequests(BaseTest):
    """Test Download API v2 /requests endpoint"""

    # GET requests

    def test_requests_get_ok(self, unauthd_client, open_catalog_record, requests_mock):
        """Successful GET"""
        requests_mock.get('https://mock-download:1/requests?dataset=1', json=fakePackage, status_code=200)
        r = unauthd_client.get('/api/v2/dl/requests?cr_id=1')
        assert r.status_code == 200
        assert r.json == fakePackage

    def test_requests_get_missing_param(self, unauthd_client):
        """Failed GET, missing parameter"""
        r = unauthd_client.get('/api/v2/dl/requests')
        assert r.status_code == 400

    def test_requests_get_invalid_param(self, unauthd_client, open_catalog_record):
        """Failed GET, unknown parameter"""
        r = unauthd_client.get('/api/v2/dl/requests?cr_id=1&unknown_parameter=217')
        assert r.status_code == 400

    def test_requests_get_forbidden(self, unauthd_client, login_catalog_record):
        """Failed GET, dataset requires login"""
        r = unauthd_client.get('/api/v2/dl/requests?cr_id=1')
        assert r.status_code == 403

    def test_requests_get_logged_in_ok(self, authd_client, login_catalog_record, requests_mock):
        """Succesful GET for dataset requiring login"""
        requests_mock.get('https://mock-download:1/requests?dataset=1', json=fakePackage, status_code=200)
        r = authd_client.get('/api/v2/dl/requests?cr_id=1')
        assert r.status_code == 200

    def test_requests_get_requests_not_found(self, unauthd_client, open_catalog_record, requests_mock):
        """Failed GET, no packages exist for dataset"""
        requests_mock.get('https://mock-download:1/requests?dataset=1', json=fakeNoActiveTasks, status_code=404)
        r = unauthd_client.get('/api/v2/dl/requests?cr_id=1')
        assert r.status_code == 200
        assert r.json == {}

    def test_requests_get_dataset_not_found(self, unauthd_client, open_catalog_record, requests_mock):
        """Failed GET, no packages exist for dataset"""
        requests_mock.get('https://mock-download:1/requests?dataset=1', json=fakeNoDataset, status_code=404)
        r = unauthd_client.get('/api/v2/dl/requests?cr_id=1')
        assert r.status_code == 404
        assert r.json == fakeNoDataset

    def test_requests_get_error(self, unauthd_client, open_catalog_record, requests_mock):
        """Failed GET, connection timeout"""
        requests_mock.get('https://mock-download:1/requests?dataset=1', exc=requests.exceptions.ConnectTimeout)
        r = unauthd_client.get('/api/v2/dl/requests?cr_id=1')
        assert r.status_code == 503

    # POST requests

    def test_requests_post_ok(self, unauthd_client, open_catalog_record, requests_mock):
        """Successful POST"""
        requests_mock.post('https://mock-download:1/requests', additional_matcher=match_dataset(1), json=fakePackage, status_code=200)
        r = unauthd_client.post('/api/v2/dl/requests', json={ 'cr_id': 1})
        assert r.status_code == 200
        assert r.json == fakePackage

    def test_requests_post_scope_ok(self, unauthd_client, open_catalog_record, requests_mock):
        """Successful POST with scope"""
        requests_mock.post('https://mock-download:1/requests', additional_matcher=match_dataset(1), json=fakePackage, status_code=200)
        r = unauthd_client.post('/api/v2/dl/requests', json={ 'cr_id': 1, 'scope': ['/hei', '/moro']})
        assert r.status_code == 200
        assert r.json == fakePackage

    def test_requests_post_invalid_param(self, unauthd_client, open_catalog_record):
        """Failed POST with unknown parameter"""
        r = unauthd_client.post('/api/v2/dl/requests', json={ 'cr_id': 1, 'sadness': True })
        assert r.status_code == 400

    def test_requests_post_forbidden(self, unauthd_client, login_catalog_record):
        """Failed POST, login required"""
        r = unauthd_client.post('/api/v2/dl/requests', json={ 'cr_id': 1})
        assert r.status_code == 403

    def test_requests_post_logged_in_ok(self, authd_client, login_catalog_record, requests_mock):
        """Succesful POST for dataset requiring login"""
        requests_mock.post('https://mock-download:1/requests', additional_matcher=match_dataset(1), json=fakePackage, status_code=200)
        r = authd_client.post('/api/v2/dl/requests', json={ 'cr_id': 1})
        assert r.status_code == 200

    def test_requests_post_not_found(self, unauthd_client, open_catalog_record, requests_mock):
        """Failed POST, dataset not found"""
        requests_mock.post('https://mock-download:1/requests', status_code=404)
        r = unauthd_client.post('/api/v2/dl/requests', json={ 'cr_id': 1})
        assert r.status_code == 404

    def test_requests_post_error(self, unauthd_client, open_catalog_record, requests_mock):
        """Failed POST, connection timeout"""
        requests_mock.post('https://mock-download:1/requests', exc=requests.exceptions.ConnectTimeout)
        r = unauthd_client.post('/api/v2/dl/requests', json={ 'cr_id': 1})
        assert r.status_code == 503


class TestDownloadResourcesAuthorize(BaseTest):
    """Test Download API v2 /authorize endpoint"""

    @pytest.fixture
    def authorize_mock(self, requests_mock):
        """Helper fixture for mocking authorization endpoint"""
        requests_mock.post('https://mock-download:1/authorize', additional_matcher=match_dataset(1), json=fakeToken, status_code=200)

    def test_authorize_file_ok(self, unauthd_client, open_catalog_record, authorize_mock):
        """Authorize file"""
        r = unauthd_client.post('/api/v2/dl/authorize', json={ 'cr_id': 1, 'file': '/folder/filename.gif'})
        assert r.status_code == 200
        assert r.json == fakeFileDownloadUrl

    def test_authorize_package_ok(self, unauthd_client, open_catalog_record, authorize_mock):
        """Authorize package"""
        r = unauthd_client.post('/api/v2/dl/authorize', json={ 'cr_id': 1, 'package': 'x.zip'})
        assert r.status_code == 200
        assert r.json == fakePackageDownloadUrl

    def test_authorize_package_invalid_param(self, unauthd_client, open_catalog_record):
        """Fail due to unknown parameter"""
        r = unauthd_client.post('/api/v2/dl/authorize', json={ 'cr_id': 1, 'package': 'x.zip', 'extra': True})
        assert r.status_code == 400

    def test_authorize_package_conflicting_params(self, unauthd_client, open_catalog_record):
        """Fail due to mutually exclusive parameters"""
        r = unauthd_client.post('/api/v2/dl/authorize',
                                json={ 'cr_id': 1, 'file': '/folder/filename.gif', 'package': 'x.zip'}
                                )
        assert r.status_code == 400

    def test_authorize_forbidden(self, unauthd_client, login_catalog_record):
        """Require login"""
        r = unauthd_client.post('/api/v2/dl/authorize', json={ 'cr_id': 1, 'file': '/folder/filename.gif'})
        assert r.status_code == 403

    def test_authorize_logged_in_ok(self, authd_client, login_catalog_record, authorize_mock):
        """User logged in, can access dataset"""
        r = authd_client.post('/api/v2/dl/authorize', json={ 'cr_id': 1, 'file': '/folder/filename.gif'})
        assert r.status_code == 200

    def test_authorize_error(self, unauthd_client, open_catalog_record, requests_mock):
        """Connection timeout"""
        requests_mock.post('https://mock-download:1/authorize', exc=requests.exceptions.ConnectTimeout)
        r = unauthd_client.post('/api/v2/dl/authorize', json={ 'cr_id': 1, 'package': 'x.zip'})
        assert r.status_code == 503
