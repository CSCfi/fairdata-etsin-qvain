# This file is part of the Etsin service
#
# Copyright 2017-2021 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""
Test Download Metadata Service

Uses the requests_mock fixture provided by the requests-mock
library for mocking the Download API endpoints.
"""

import json
import pytest
import requests
from flask_mail import email_dispatched

from .basetest import BaseTest


class TestDownloadMetadataService(BaseTest):
    """Test Download Metadata Service"""

    # GET requests
    @staticmethod
    def get_matcher(body, headers):
        """Gets matcher that returns specific response body and response"""

        def _matcher(request, context):
            context.headers = headers
            return body

        return _matcher

    def test_preserve_headers(self, unauthd_client, open_catalog_record, requests_mock):
        """Should preserve original Content-Type and Content-Disposition headers"""
        matcher = self.get_matcher(
            "<someXml>Hello</someXml>",
            {
                "Content-Type": "application/somefileformat",
                "Content-Disposition": "content-disposition",
                "Content-Length": "24",
            },
        )
        requests_mock.get(
            "https://mock-metax/rest/datasets/1.json", text=matcher, status_code=200
        )

        r = unauthd_client.get("/api/format?cr_id=1&format=metax")
        assert r.status_code == 200
        assert dict(r.headers) == {
            "Content-Type": "application/somefileformat",
            "Content-Disposition": "content-disposition",
            "Content-Length": "24",
        }

    def test_type_datacite_xml(
        self, unauthd_client, open_catalog_record, requests_mock
    ):
        """Should return metadata.xml for fairdata_datacite format"""
        matcher = self.get_matcher(
            "<someXml>Hello</someXml>",
            {
                "Content-Type": "application/xml",
            },
        )
        requests_mock.get(
            "https://mock-metax/rest/datasets/1?dataset_format=fairdata_datacite",
            text=matcher,
            status_code=200,
        )
        r = unauthd_client.get("/api/format?cr_id=1&format=fairdata_datacite")
        assert r.status_code == 200
        assert dict(r.headers) == {
            "Content-Type": "application/xml",
            "Content-Disposition": 'attachment; filename="metadata.xml"',
        }

    def test_type_xml(self, unauthd_client, open_catalog_record, requests_mock):
        """Should return metadata.xml for fairdata format"""
        matcher = self.get_matcher(
            "<someXml>Hello</someXml>",
            {
                "Content-Type": "application/xml",
            },
        )
        requests_mock.get(
            "https://mock-metax/rest/datasets/1?dataset_format=fairdata",
            text=matcher,
            status_code=200,
        )
        r = unauthd_client.get("/api/format?cr_id=1&format=fairdata")
        assert r.status_code == 200
        assert dict(r.headers) == {
            "Content-Type": "application/xml",
            "Content-Disposition": 'attachment; filename="metadata.xml"',
        }

    def test_type_json(self, unauthd_client, open_catalog_record, requests_mock):
        """Should return metadata.json for metax format"""
        matcher = self.get_matcher(
            '{ "content": "hello world"}',
            {
                "Content-Type": "application/json",
            },
        )
        requests_mock.get(
            "https://mock-metax/rest/datasets/1.json", text=matcher, status_code=200
        )
        r = unauthd_client.get("/api/format?cr_id=1&format=metax")
        assert r.status_code == 200
        assert dict(r.headers) == {
            "Content-Type": "application/json",
            "Content-Disposition": 'attachment; filename="metadata.json"',
        }

    def test_invalid_format(self, unauthd_client, open_catalog_record, requests_mock):
        """Should return _get_error_response(400)"""
        matcher = self.get_matcher(
            {"detail": ["Requested format 'thisformatdoesnotexist' is not available"]},
            {
                "Content-Type": "application/json",
            },
        )
        requests_mock.get(
            "https://mock-metax/rest/datasets/1?dataset_format=thisformatdoesnotexist",
            json=matcher,
            status_code=400,
        )
        r = unauthd_client.get("/api/format?cr_id=1&format=thisformatdoesnotexist")
        assert r.status_code == 400
        assert dict(r.headers) == {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": 'attachment; filename="error"',
            "Content-Length": "0",
        }
