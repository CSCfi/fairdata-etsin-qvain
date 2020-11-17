# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Basic app tests"""

import logging
import pytest
import requests
from requests_mock import ANY

from .basetest import BaseTest
from etsin_finder.request_utils import get_request_url, make_request

class TestMakeRequest(BaseTest):
    """Tests for request_utils functions"""

    @pytest.fixture
    def expect_log(self, caplog):
        """
        Expect specific warnings and errors to be logged

        The number logged warnings and errors of must match
        the length of the supplied warnings/errors lists, and
        each log must contain the matching substring.

        E.g. with warnings=['something happened'], there must be exactly
        one warning and it must contain the substring 'something happened'.

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
