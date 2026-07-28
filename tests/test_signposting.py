"""Tests for signposting functionality, including Link headers and the _pid_to_url helper."""

import requests

from etsin_finder.utils.signposting import _pid_to_url

from .basetest import BaseTest


class TestPidToUrl:
    """Unit tests for _pid_to_url."""

    def test_converts_doi_to_resolvable_url(self):
        assert (
            _pid_to_url("doi:10.234567/test-123")
            == "https://doi.org/10.234567/test-123"
        )

    def test_converts_urn_to_resolvable_url(self):
        assert (
            _pid_to_url("urn:nbn:fi:att:test-123")
            == "https://urn.fi/urn:nbn:fi:att:test-123"
        )

    def test_handles_urn_case_insensitively(self):
        assert (
            _pid_to_url("URN:NBN:FI:att:test-123")
            == "https://urn.fi/urn:nbn:fi:att:test-123"
        )

    def test_preserves_https_url(self):
        assert _pid_to_url("https://example.com/pid") == "https://example.com/pid"

    def test_preserves_http_url(self):
        assert (
            _pid_to_url("https://example.org/something")
            == "https://example.org/something"
        )

    def test_strips_url_prefix(self):
        assert _pid_to_url("url:https://example.org") == "https://example.org"

    def test_adds_https_to_reportronic_url(self):
        assert (
            _pid_to_url("reportronic.fi/aineisto") == "https://reportronic.fi/aineisto"
        )

    def test_strips_url_prefix_from_reportronic_url(self):
        assert (
            _pid_to_url("url:reportronic.fi/aineisto")
            == "https://reportronic.fi/aineisto"
        )

    def test_returns_empty_for_unknown_identifier(self):
        assert _pid_to_url("some-identifier") == ""

    def test_returns_empty_string_for_empty_input(self):
        assert _pid_to_url("") == ""

    def test_returns_empty_string_for_none_input(self):
        assert _pid_to_url(None) == ""


DATASET_ID = "10000000-2000-3000-4000-500000000001"
METAX_DATASET_URL = f"https://fake-metax-v3:443/v3/datasets/{DATASET_ID}"


class TestLinkHeader(BaseTest):
    """Tests for the Link header on dataset pages."""

    def test_generates_link_header_for_doi_dataset(self, requests_mock, unauthd_client):
        requests_mock.get(
            METAX_DATASET_URL,
            json={
                "id": DATASET_ID,
                "state": "published",
                "persistent_identifier": "doi:10.234567/test-123",
                "access_rights": {
                    "license": [
                        {
                            "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0"
                        }
                    ]
                },
                "actors": [
                    {
                        "roles": ["creator"],
                        "organization": {"url": "https://example.org"},
                    }
                ],
            },
        )
        response = unauthd_client.get(f"/dataset/{DATASET_ID}")
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://doi.org/10.234567/test-123", "rel": "cite-as"},
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://example.org", "rel": "author"},
            {
                "url": METAX_DATASET_URL,
                "rel": "describedby",
                "type": "application/json",
            },
            {
                "url": "https://doi.org/10.234567/test-123",
                "rel": "describedby",
                "type": "application/ld+json",
            },
            {
                "url": "https://doi.org/10.234567/test-123",
                "rel": "describedby",
                "type": "application/vnd.datacite.datacite+json",
            },
            {
                "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0",
                "rel": "license",
            },
        ]

    def test_generates_link_header_for_urn_dataset(self, requests_mock, unauthd_client):
        requests_mock.get(
            METAX_DATASET_URL,
            json={
                "id": DATASET_ID,
                "state": "published",
                "persistent_identifier": "urn:nbn:fi:att:test-123",
                "access_rights": {
                    "license": [
                        {
                            "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0"
                        }
                    ]
                },
                "actors": [
                    {
                        "roles": ["creator"],
                        "organization": {"url": "https://example.org"},
                    }
                ],
            },
        )
        response = unauthd_client.get(f"/dataset/{DATASET_ID}")
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://urn.fi/urn:nbn:fi:att:test-123", "rel": "cite-as"},
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://example.org", "rel": "author"},
            {
                "url": METAX_DATASET_URL,
                "rel": "describedby",
                "type": "application/json",
            },
            {
                "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0",
                "rel": "license",
            },
        ]

        assert {
            "url": "https://urn.fi/urn:nbn:fi:att:test-123>",
            "rel": "describedby",
            "type": "application/ld+json",
        } not in links

    def test_only_first_creator_with_url_is_included(
        self, requests_mock, unauthd_client
    ):
        requests_mock.get(
            METAX_DATASET_URL,
            json={
                "id": DATASET_ID,
                "state": "published",
                "actors": [
                    {
                        "roles": ["creator"],
                        "organization": {"url": "https://example.org"},
                    },
                    {
                        "roles": ["creator", "publisher"],
                        "organization": {
                            "id": "0e14427c-6e75-4a37-8bf6-89c30ea9880b",
                            "pref_label": {
                                "en": "CSC – IT Center for Science",
                                "fi": "CSC – Tieteen tietotekniikan keskus Oy",
                                "sv": "CSC – IT Center for Science",
                                "und": "CSC – Tieteen tietotekniikan keskus Oy",
                            },
                            "url": "http://uri.suomi.fi/codelist/fairdata/organization/code/09206320",
                            "in_scheme": "http://uri.suomi.fi/codelist/fairdata/organization",
                        },
                    },
                ],
            },
        )

        response = unauthd_client.get(f"/dataset/{DATASET_ID}")
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://example.org", "rel": "author"},
            {
                "url": METAX_DATASET_URL,
                "rel": "describedby",
                "type": "application/json",
            },
        ]

    def test_prefers_creator_with_url(self, requests_mock, unauthd_client):
        requests_mock.get(
            METAX_DATASET_URL,
            json={
                "id": DATASET_ID,
                "state": "published",
                "actors": [
                    {
                        "roles": ["creator"],
                        "organization": {"pref_label": {"en": "Example organization"}},
                    },
                    {
                        "roles": ["creator", "publisher"],
                        "organization": {
                            "id": "0e14427c-6e75-4a37-8bf6-89c30ea9880b",
                            "pref_label": {
                                "en": "CSC – IT Center for Science",
                                "fi": "CSC – Tieteen tietotekniikan keskus Oy",
                                "sv": "CSC – IT Center for Science",
                                "und": "CSC – Tieteen tietotekniikan keskus Oy",
                            },
                            "url": "http://uri.suomi.fi/codelist/fairdata/organization/code/09206320",
                            "in_scheme": "http://uri.suomi.fi/codelist/fairdata/organization",
                        },
                    },
                ],
            },
        )

        response = unauthd_client.get(f"/dataset/{DATASET_ID}")
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {
                "url": "http://uri.suomi.fi/codelist/fairdata/organization/code/09206320",
                "rel": "author",
            },
            {
                "url": METAX_DATASET_URL,
                "rel": "describedby",
                "type": "application/json",
            },
        ]

    def test_adds_multiple_license_links(self, requests_mock, unauthd_client):
        requests_mock.get(
            METAX_DATASET_URL,
            json={
                "id": DATASET_ID,
                "state": "published",
                "access_rights": {
                    "license": [
                        {
                            "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0"
                        },
                        {
                            "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-2.0",
                        },
                    ]
                },
            },
        )
        response = unauthd_client.get(f"/dataset/{DATASET_ID}")
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {
                "url": METAX_DATASET_URL,
                "rel": "describedby",
                "type": "application/json",
            },
            {
                "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0",
                "rel": "license",
            },
            {
                "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-2.0",
                "rel": "license",
            },
        ]

    def test_ignores_license_without_url(self, requests_mock, unauthd_client):
        requests_mock.get(
            METAX_DATASET_URL,
            json={
                "id": DATASET_ID,
                "state": "published",
                "access_rights": {
                    "license": [
                        {"in_scheme": "http://uri.suomi.fi/codelist/fairdata/license"},
                        {
                            "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-2.0",
                        },
                    ]
                },
            },
        )
        response = unauthd_client.get(f"/dataset/{DATASET_ID}")
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {
                "url": METAX_DATASET_URL,
                "rel": "describedby",
                "type": "application/json",
            },
            {
                "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-2.0",
                "rel": "license",
            },
        ]

    def test_does_not_add_link_header_to_non_dataset_page(
        self, requests_mock, unauthd_client
    ):
        """Non-dataset pages do not get a Link header."""
        requests_mock.get(
            METAX_DATASET_URL,
            json={
                "persistent_identifier": "doi:10.234567/test-123",
                "access_rights": {
                    "license": [
                        {
                            "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0"
                        }
                    ]
                },
                "actors": [
                    {
                        "roles": ["creator"],
                        "organization": {"url": "https://example.org"},
                    }
                ],
            },
        )
        response = unauthd_client.get(f"/datasets")
        assert response.status_code == 200
        assert "Link" not in response.headers
