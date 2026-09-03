"""Tests for signposting functionality, including Link headers and the _pid_to_url helper."""

import requests

from etsin_finder.utils.signposting import _orcid_to_url, _pid_to_url

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


class TestIdToOrcidUrl:
    """Unit tests for _orcid_to_url: validates and normalizes ORCIDs to URLs"""

    def test_returns_url_unchanged_for_http_orcid_url(self):
        assert (
            _orcid_to_url("http://orcid.org/0009-0000-0000-0000")
            == "http://orcid.org/0009-0000-0000-0000"
        )

    def test_returns_url_unchanged_for_https_orcid_url(self):
        assert (
            _orcid_to_url("https://orcid.org/0009-0000-0000-000X")
            == "https://orcid.org/0009-0000-0000-000X"
        )

    def test_returns_url_unchanged_for_https_orcid_url_with_trailing_slash(self):
        assert (
            _orcid_to_url("https://orcid.org/0009-0000-0000-0000/")
            == "https://orcid.org/0009-0000-0000-0000/"
        )

    def test_returns_url_unchanged_for_http_www_orcid_url(self):
        assert (
            _orcid_to_url("http://www.orcid.org/0009-0000-0000-0000")
            == "http://www.orcid.org/0009-0000-0000-0000"
        )

    def test_returns_url_unchanged_for_https_www_orcid_url(self):
        assert (
            _orcid_to_url("https://www.orcid.org/0009-0000-0000-000X")
            == "https://www.orcid.org/0009-0000-0000-000X"
        )

    def test_adds_https_to_www_orcid_url(self):
        assert (
            _orcid_to_url("www.orcid.org/0009-0000-0000-0000")
            == "https://www.orcid.org/0009-0000-0000-0000"
        )

    def test_adds_https_to_orcid_url_without_scheme(self):
        assert (
            _orcid_to_url("orcid.org/0000-0001-5000-0007")
            == "https://orcid.org/0000-0001-5000-0007"
        )

    def test_converts_bare_orcid_to_https_url(self):
        assert (
            _orcid_to_url("0009-0000-0000-0000")
            == "https://orcid.org/0009-0000-0000-0000"
        )

    def test_converts_orcid_prefix_with_bare_orcid_to_https_url(self):
        assert (
            _orcid_to_url("orcID:   0009-0000-0000-0000")
            == "https://orcid.org/0009-0000-0000-0000"
        )

    def test_converts_orcid_prefix_with_https_orcid_to_https_url(self):
        assert (
            _orcid_to_url("orcid:https://orcid.org/0009-0000-0000-0000")
            == "https://orcid.org/0009-0000-0000-0000"
        )

    def test_returns_empty_string_for_invalid_http_orcid_url(self):
        assert _orcid_to_url("http://orcid.org/0009-0000-0000-000x") == ""

    def test_returns_empty_string_for_invalid_https_orcid_url(self):
        assert _orcid_to_url("https://orcid.org/0009-0000-0000-000X11") == ""

    def test_returns_empty_string_for_orcid_prefix_with_invalid_orcid(self):
        assert _orcid_to_url("orcid: 0009-0000-0000-0000\n") == ""

    def test_returns_empty_string_for_invalid_bare_orcid(self):
        assert _orcid_to_url("0ab0-0000-0000-000X") == ""

    def test_returns_empty_string_for_non_orcid_url(self):
        assert _orcid_to_url("https://example.com/123") == ""

    def test_returns_empty_string_for_empty_input(self):
        assert _orcid_to_url("") == ""

    def test_returns_empty_string_for_none_input(self):
        assert _orcid_to_url(None) == ""

    def test_returns_empty_string_for_orcid_url_with_duplicate_domain(self):
        assert _orcid_to_url("https://orcid.org/orcid.org/0009-0000-0000-0000") == ""


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
                        "roles": ["creator", "publisher"],
                        "person": {
                            "name": "Matti Mehiläinen",
                            "external_identifier": "https://orcid.org/0009-0000-0000-0000",
                        },
                        "organization": {"url": "https://example.org"},
                    }
                ],
            },
        )
        response = unauthd_client.get(
            f"/dataset/{DATASET_ID}", headers={"X-Etsin-App": "lumi-aif.etsin"}
        )
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://doi.org/10.234567/test-123", "rel": "cite-as"},
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://schema.org/AboutPage", "rel": "type"},
            {"url": "https://orcid.org/0009-0000-0000-0000", "rel": "author"},
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
                        "roles": ["creator", "publisher"],
                        "person": {
                            "name": "Matti Mehiläinen",
                            "external_identifier": "https://orcid.org/0009-0000-0000-0000",
                        },
                        "organization": {"url": "https://example.org"},
                    }
                ],
            },
        )
        response = unauthd_client.get(
            f"/dataset/{DATASET_ID}", headers={"X-Etsin-App": "etsin"}
        )
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://urn.fi/urn:nbn:fi:att:test-123", "rel": "cite-as"},
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://schema.org/AboutPage", "rel": "type"},
            {"url": "https://orcid.org/0009-0000-0000-0000", "rel": "author"},
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

    def test_includes_only_first_person_creator_with_orcid(
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
                        "person": {
                            "name": "Matti Mehiläinen",
                            "external_identifier": "https://orcid.org/0009-0000-0000-0000",
                        },
                        "organization": {"url": "https://example.org"},
                    },
                    {
                        "roles": ["creator", "publisher"],
                        "person": {
                            "name": "Katti Matikainen",
                            "external_identifier": "https://orcid.org/0000-0001-5000-0007",
                        },
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

        response = unauthd_client.get(
            f"/dataset/{DATASET_ID}", headers={"X-Etsin-App": "lumi-aif.etsin"}
        )
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://schema.org/AboutPage", "rel": "type"},
            {"url": "https://orcid.org/0009-0000-0000-0000", "rel": "author"},
            {
                "url": METAX_DATASET_URL,
                "rel": "describedby",
                "type": "application/json",
            },
        ]

    def test_skips_person_creator_without_orcid(self, requests_mock, unauthd_client):
        requests_mock.get(
            METAX_DATASET_URL,
            json={
                "id": DATASET_ID,
                "state": "published",
                "actors": [
                    {
                        "roles": ["creator"],
                        "person": {"name": "Matti Mehiläinen"},
                        "organization": {"pref_label": {"en": "Example organization"}},
                    },
                    {
                        "roles": ["creator", "publisher"],
                        "person": {
                            "name": "Katti Matikainen",
                            "external_identifier": "https://orcid.org/0000-0001-5000-0007",
                        },
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

        response = unauthd_client.get(
            f"/dataset/{DATASET_ID}", headers={"X-Etsin-App": "etsin"}
        )
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://schema.org/AboutPage", "rel": "type"},
            {
                "url": "https://orcid.org/0000-0001-5000-0007",
                "rel": "author",
            },
            {
                "url": METAX_DATASET_URL,
                "rel": "describedby",
                "type": "application/json",
            },
        ]

    def test_skips_organization_creator(self, requests_mock, unauthd_client):
        requests_mock.get(
            METAX_DATASET_URL,
            json={
                "id": DATASET_ID,
                "state": "published",
                "actors": [
                    {
                        "roles": ["creator", "publisher"],
                        "organization": {
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

        response = unauthd_client.get(
            f"/dataset/{DATASET_ID}", headers={"X-Etsin-App": "etsin"}
        )
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://schema.org/AboutPage", "rel": "type"},
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
        response = unauthd_client.get(
            f"/dataset/{DATASET_ID}", headers={"X-Etsin-App": "lumi-aif.etsin"}
        )
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://schema.org/AboutPage", "rel": "type"},
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
        response = unauthd_client.get(
            f"/dataset/{DATASET_ID}", headers={"X-Etsin-App": "etsin"}
        )
        assert response.status_code == 200

        link_header = response.headers.get("Link")
        assert link_header is not None

        links = requests.utils.parse_header_links(link_header)
        assert links == [
            {"url": "https://schema.org/Dataset", "rel": "type"},
            {"url": "https://schema.org/AboutPage", "rel": "type"},
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
                        "roles": ["creator", "publisher"],
                        "organization": {"url": "https://example.org"},
                    }
                ],
            },
        )
        response = unauthd_client.get(
            "/datasets", headers={"X-Etsin-App": "lumi-aif.etsin"}
        )
        assert response.status_code == 200
        assert "Link" not in response.headers

    def test_does_not_add_link_header_to_qvain_dataset_page(
        self, requests_mock, unauthd_client
    ):
        """Qvain dataset pages do not get a Link header."""
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
                        "roles": ["creator", "publisher"],
                        "person": {
                            "name": "Matti Mehiläinen",
                            "external_identifier": "https://orcid.org/0009-0000-0000-0000",
                        },
                        "organization": {"url": "https://example.org"},
                    }
                ],
            },
        )
        response = unauthd_client.get("/datasets", headers={"X-Etsin-App": "qvain"})
        assert response.status_code == 200
        assert "Link" not in response.headers
