# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Basic app tests"""

import pytest
import requests
from requests_mock import ANY

from .basetest import BaseTest
from etsin_finder.utils.request_utils import get_request_url, make_request

class TestMakeRequest(BaseTest):
    """Tests for request_utils functions"""

    def test_ok_text(self, app, expect_log, requests_mock):
        """GET request with text response"""
        requests_mock.get(ANY, text='jee')
        with app.app_context():
            resp, status, success = make_request(requests.get, 'https://mock/endpoint', params={'some': 'stuff'})
            assert success is True
            assert status == 200
            expect_log()
            assert resp == 'jee'

    def test_ok_json(self, app, expect_log, requests_mock):
        """GET request with JSON response"""
        requests_mock.get(ANY, json={'message': 'jee'})
        with app.app_context():
            resp, status, success = make_request(requests.get, 'https://mock/endpoint', params={'some': 'stuff'})
            assert success is True
            assert status == 200
            expect_log()
            assert resp == {'message': 'jee'}

    def test_post(self, app, expect_log, requests_mock):
        """POST request"""
        requests_mock.post(ANY, text='jee')
        with app.app_context():
            resp, status, success = make_request(requests.post, 'https://mock/endpoint', params={'some': 'stuff'})
            assert success is True
            assert status == 200
            expect_log()
            assert resp == 'jee'

    def test_not_found(self, app, expect_log, requests_mock):
        """404 response"""
        requests_mock.get(ANY, text='not found', status_code=404)
        with app.app_context():
            resp, status, success = make_request(requests.get, 'https://mock/endpoint', params={'some': 'stuff'})
            assert success is False
            assert status == 404
            expect_log(warnings=['not found'])
            assert resp == 'not found'

    def test_bad_request(self, app, expect_log, requests_mock):
        """400"""
        requests_mock.get(ANY, text='bad request', status_code=400)
        with app.app_context():
            resp, status, success = make_request(requests.get, 'https://mock/endpoint', params={'some': 'stuff'})
            assert success is False
            assert status == 400
            expect_log(warnings=['bad request'])
            assert resp == 'bad request'

    def test_timeout(self, app, expect_log, requests_mock):
        """Connection timeout"""
        requests_mock.get(ANY, exc=requests.exceptions.ConnectTimeout)
        with app.app_context():
            _, status, success = make_request(requests.get, 'https://mock/endpoint', params={'some': 'stuff'})
            assert success is False
            assert status == 503
            expect_log(errors=['timed out'])

    def test_connection_error(self, app, expect_log, requests_mock):
        """Connection error"""
        requests_mock.get(ANY, exc=requests.exceptions.ConnectionError)
        with app.app_context():
            _, status, success = make_request(requests.get, 'https://mock/endpoint', params={'some': 'stuff'})
            assert success is False
            assert status == 503
            expect_log(errors=['Unable to connect'])
