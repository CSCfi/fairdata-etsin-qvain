"""Test suite for Qvain resources."""

import pytest
import requests
from datetime import date
from etsin_finder.resources.qvain_resources import (
    FileCharacteristics,
    QvainDataset,
    QvainDatasetFiles,
    QvainDatasets,
)
from etsin_finder.utils.flags import set_flags
from werkzeug.exceptions import HTTPException

from .basetest import BaseTest, make_sso_cookie
from .test_ldap import createMockLDAPIdmService, MockLDAPIdmServiceFail


def sso_cookie_login():
    """Return default test sso cookie."""
    return make_sso_cookie(
        {
            "services": {"IDA": {"projects": ["test-1234"]}},
            "authenticated_user": {
                "id": "teppo",
                "organization": {"id": "Testers inc."},
            },
        }
    )


default_cr_response = (
    {
        "metadata_provider_user": "teppo",
        "data_catalog": {
            "catalog_json": {"identifier": "urn:nbn:fi:att:data-catalog-ida"}
        },
    },
    200,
    True,
)


default_file_characteristics_call_args = {
    "url": "https://mock-metax/rest/v2/files/file_id",
    "auth": ("qvain", "test-qvain"),
    "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    "proxies": None,
    "timeout": 30,
    "verify": True,
}

default_datasets_call_args = {
    "url": "https://mock-metax/rest/v2/datasets",
    "auth": ("qvain", "test-qvain"),
    "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
    "proxies": None,
    "timeout": 30,
    "verify": True,
}

MockLDAPIdmService = createMockLDAPIdmService(
    users=[
        (
            "teppo_testaaja",
            "Teppo",
            "Testaaja",
            "teppo@example.com",
        ),
        ("jasen", "Projen", "Jäsen", "jasen@example.com"),
        ("editori", "Edi", "Tori", "editori@example.com"),
        ("not_member", "Not", "Member", "not_member@example.com"),
    ],
    projects=[("project_x", ["teppo_testaaja", "jasen"])],
)


class TestQvainDatasetsGet(BaseTest):
    """Tests for Qvain Datasets GET."""

    @pytest.fixture
    def sso_cookie(self):
        """Return default test sso cookie."""
        return make_sso_cookie(
            {
                "services": {"IDA": {"projects": ["test-1234"]}},
                "authenticated_user": {
                    "id": "teppo",
                    "organization": {"id": "Testers inc."},
                },
            }
        )

    @pytest.fixture
    def request_no_login(self, app):
        """Open test requst ocntext without login."""
        with app.test_request_context(
            headers={"content-type": "application/json"}
        ) as context:
            yield context

    @pytest.fixture
    def request_login(self, app, sso_cookie):
        """Open test requst ocntext without login."""
        with app.test_request_context(
            headers={"COOKIE": sso_cookie, "content-type": "application/json"}
        ) as context:
            yield context

    @pytest.fixture
    def unauthd_datasets_client(self, app, unauthd_client):
        """Set up unauthenticated client."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": True}, app)
        return unauthd_client

    @pytest.fixture
    def datasets_client(
        self,
        app,
        user_details,
        IDA_projects_ok,
        authd_client,
    ):
        """Set up authenticated client with user details and projects."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": True}, app)
        return authd_client

    user_dataset = {
        "id": "user_dataset",
        "date_created": "2020-01-03T01:02:03",
        "metadata_provider_user": "teppo_testaaja",
    }
    user_project_dataset = {
        "id": "user_project_dataset",
        "date_created": "2020-01-02T01:02:03",
        "metadata_provider_user": "teppo_testaaja",
    }
    project_dataset = {"id": "project_dataset", "date_created": "2020-01-01T01:02:03"}

    user_datasets_url = (
        "https://mock-metax/rest/v2/datasets?editor_permissions_user=teppo_testaaja"
    )

    project_datasets_url = "https://mock-metax/rest/v2/datasets?projects=project_x"

    @pytest.fixture
    def no_user_datasets(self, requests_mock):
        """User has not created any datasets."""
        requests_mock.get(
            self.user_datasets_url,
            json=[],
            status_code=200,
        )

    @pytest.fixture
    def fail_user_datasets(self, requests_mock):
        """Fetch user datasets fails."""
        requests_mock.get(
            self.user_datasets_url,
            json="user fail",
            status_code=500,
        )

    @pytest.fixture
    def user_datasets(self, requests_mock):
        """User has created datasets."""
        requests_mock.get(
            self.user_datasets_url,
            json=[
                self.user_dataset,
                self.user_project_dataset,
            ],
            status_code=200,
        )

    @pytest.fixture
    def no_project_datasets(self, requests_mock):
        """Project has no datasets."""
        requests_mock.get(
            self.project_datasets_url,
            json=[],
            status_code=200,
        )

    @pytest.fixture
    def fail_project_datasets(self, requests_mock):
        """Fetch project datasets fails."""
        requests_mock.get(
            self.project_datasets_url,
            json="project fail",
            status_code=500,
        )

    @pytest.fixture
    def project_datasets(self, requests_mock):
        """Project has datasets."""
        requests_mock.get(
            self.project_datasets_url,
            json=[
                self.project_dataset,
                self.user_project_dataset,
            ],
            status_code=200,
        )

    def test_no_datasets(self, datasets_client, no_user_datasets, no_project_datasets):
        """Test that datasets returns empty array with 200."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 200
        assert r.json == []

    def test_user_datasets(self, datasets_client, user_datasets, no_project_datasets):
        """Test that datasets returns user datasets with 'creator' source."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 200
        assert r.json == [
            {**self.user_dataset, "sources": ["creator"]},
            {**self.user_project_dataset, "sources": ["creator"]},
        ]

    def test_project_datasets(
        self, datasets_client, no_user_datasets, project_datasets
    ):
        """Test that datasets returns user datasets with 'project' source."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 200
        assert r.json == [
            {**self.user_project_dataset, "sources": ["project"]},
            {**self.project_dataset, "sources": ["project"]},
        ]

    def test_user_project_datasets(
        self, datasets_client, user_datasets, project_datasets
    ):
        """Test that datasets returns datasets with multiple sources."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 200
        assert r.json == [
            {**self.user_dataset, "sources": ["creator"]},
            {**self.user_project_dataset, "sources": ["creator", "project"]},
            {**self.project_dataset, "sources": ["project"]},
        ]

    def test_user_project_datasets_error(
        self, datasets_client, user_datasets, project_datasets
    ):
        """Test that datasets returns empty array with 200."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 200
        assert r.json == [
            {**self.user_dataset, "sources": ["creator"]},
            {**self.user_project_dataset, "sources": ["creator", "project"]},
            {**self.project_dataset, "sources": ["project"]},
        ]

    @pytest.mark.parametrize(
        "user_data, project_data",
        [
            ("user_datasets", "fail_project_datasets"),
            ("fail_user_datasets", "project_datasets"),
            ("fail_user_datasets", "fail_project_datasets"),
        ],
    )
    def test_fail_datasets(self, datasets_client, user_data, project_data, request):
        """Test that datasets returns error when fetching user or project datasets fails."""
        request.getfixturevalue(user_data)
        request.getfixturevalue(project_data)
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 500
        assert r.json == {"message": "Failed to get datasets"}

    def test_no_auth(
        self, unauthd_datasets_client, no_user_datasets, no_project_datasets
    ):
        """Test that datasets returns 401 for unauthenticated user."""
        r = unauthd_datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 401
        assert r.json == {"PermissionError": "User not logged in."}


class TestQvainDatasetsGetLegacy(BaseTest):
    """Tests for Qvain Datasets GET based on metadata_provider_user."""

    @pytest.fixture
    def unauthd_datasets_client(self, app, unauthd_client):
        """Set up unauthenticated client."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": False}, app)
        return unauthd_client

    @pytest.fixture
    def datasets_client(
        self,
        app,
        user_details,
        IDA_projects_ok,
        authd_client,
    ):
        """Set up authenticated client with user details and projects."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": False}, app)
        return authd_client

    user_dataset = {
        "id": "user_dataset",
        "date_created": "2020-01-03",
        "metadata_provider_user": "teppo_testaaja",
    }

    user_datasets_url = (
        "https://mock-metax/rest/v2/datasets?metadata_provider_user=teppo_testaaja"
    )

    project_datasets_url = "https://mock-metax/rest/v2/datasets?projects=project_x"

    @pytest.fixture
    def no_user_datasets(self, requests_mock):
        """User has not created any datasets."""
        requests_mock.get(
            self.user_datasets_url,
            json=[],
            status_code=200,
        )

    @pytest.fixture
    def fail_user_datasets(self, requests_mock):
        """Fetch of user datasets fails."""
        requests_mock.get(
            self.user_datasets_url,
            json="user fail",
            status_code=500,
        )

    @pytest.fixture
    def user_datasets(self, requests_mock):
        """User has created datasets."""
        requests_mock.get(
            self.user_datasets_url,
            json=[
                self.user_dataset,
            ],
            status_code=200,
        )

    def test_no_datasets(self, datasets_client, no_user_datasets):
        """Test that datasets returns empty array with 200."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 200
        assert r.json == []

    def test_user_datasets(self, datasets_client, user_datasets):
        """Test that datasets returns user datasets with 'creator' source."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 200
        assert r.json == [
            {**self.user_dataset, "sources": ["creator"]},
        ]

    def test_fail_datasets(self, datasets_client, fail_user_datasets):
        """Test that datasets returns error when fetching user datasets fails."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 500
        assert r.json == {"message": "Failed to get datasets"}

    def test_no_auth(self, unauthd_datasets_client, no_user_datasets):
        """Test that datasets returns 401 for unauthenticated user."""
        r = unauthd_datasets_client.get("/api/qvain/datasets?no_pagination=true")
        assert r.status_code == 401
        assert r.json == {"PermissionError": "User not logged in."}

    @pytest.mark.parametrize(
        "test_details, context_details, mock_requests, expected",
        [
            (
                {
                    "call": lambda: FileCharacteristics().put("file_id"),
                },
                {"headers": {"content-type": "text/html"}},
                {},
                {
                    "response": "Expected content-type application/json",
                    "status": 403,
                },
            ),
            (
                {
                    "call": lambda: FileCharacteristics().put("file_id"),
                },
                {"headers": {"content-type": "application/json"}},
                {
                    "metax_responses": [(None, 200, True)],
                    "metax_calls": [
                        {
                            "request": requests.get,
                            **default_file_characteristics_call_args,
                        }
                    ],
                },
                {
                    "response": "Access denied or file not found",
                    "status": 404,
                },
            ),
            (
                {
                    "call": lambda: FileCharacteristics().put("file_id"),
                },
                {"headers": {"content-type": "application/json"}},
                {
                    "metax_responses": [(None, 200, True)],
                    "metax_calls": [
                        {
                            "request": requests.get,
                            **default_file_characteristics_call_args,
                        }
                    ],
                },
                {
                    "response": "Access denied or file not found",
                    "status": 404,
                },
            ),
            (
                {
                    "call": lambda: FileCharacteristics().put("file_id"),
                },
                {"headers": {"content-type": "application/json"}},
                {"metax_responses": [({"project_identifier": "test-1234"}, 200, True)]},
                {
                    "response": "Project missing from user or user is not authenticated",
                    "status": 403,
                },
            ),
            (
                {
                    "call": lambda: FileCharacteristics().put("file_id"),
                },
                {
                    "headers": {
                        "content-type": "application/json",
                        "COOKIE": sso_cookie_login(),
                    }
                },
                {"metax_responses": [({"project_identifier": "test-1234"}, 200, True)]},
                {
                    "response": "400 Bad Request: Failed to decode JSON object: Expecting value: line 1 column 1 (char 0)",
                    "status": 400,
                },
            ),
            (
                {
                    "call": lambda: FileCharacteristics().put("file_id"),
                },
                {
                    "headers": {
                        "content-type": "application/json",
                        "COOKIE": sso_cookie_login(),
                    },
                    "json": {"illegal_key": "very illegal"},
                },
                {"metax_responses": [({"project_identifier": "test-1234"}, 200, True)]},
                {
                    "response": "Changing field illegal_key is not allowed",
                    "status": 400,
                },
            ),
            (
                {
                    "call": lambda: FileCharacteristics().put("file_id"),
                },
                {
                    "headers": {
                        "content-type": "application/json",
                        "COOKIE": sso_cookie_login(),
                    },
                    "json": {"encoding": "H.264"},
                },
                {
                    "metax_responses": [
                        (
                            {
                                "project_identifier": "test-1234",
                                "characteristics": {
                                    "encoding": "SHA256",
                                    "csv_delimiter": True,
                                },
                            },
                            200,
                            True,
                        ),
                        ("patched", 200, True),
                    ],
                    "metax_calls": [
                        {
                            "request": requests.patch,
                            "json": {"file_characteristics": {"encoding": "H.264"}},
                            **default_file_characteristics_call_args,
                        },
                    ],
                },
                {"response": "patched", "status": 200},
            ),
            (
                {
                    "call": lambda: QvainDatasets().get(),
                },
                {},
                {},
                {
                    "response": {"PermissionError": "User not logged in."},
                    "status": 401,
                },
            ),
            (
                {
                    "call": lambda: QvainDatasets().get(),
                },
                {"headers": {"COOKIE": sso_cookie_login()}},
                {"metax_responses": [([], 200, True)]},
                {"response": [], "status": 200},
            ),
            (
                {
                    "call": lambda: QvainDatasets().get(),
                },
                {"headers": {"COOKIE": sso_cookie_login()}},
                {"metax_responses": [([{"test": "test"}], 200, True)]},
                {"response": [{"test": "test", "sources": ["creator"]}], "status": 200},
            ),
            (
                {
                    "call": lambda: QvainDatasets().post(),
                },
                {},
                {},
                {"response": {"PermissionError": "User not logged in."}, "status": 401},
            ),
            (
                {
                    "call": lambda: QvainDatasets().post(),
                },
                {"headers": {"COOKIE": sso_cookie_login()}, "json": {}},
                {},
                {
                    "response": {
                        "title": ["Missing data for required field."],
                    },
                    "status": 400,
                },
            ),
            (
                {
                    "call": lambda: QvainDatasets().post(),
                },
                {
                    "headers": {"COOKIE": sso_cookie_login()},
                    "json": {
                        "title": {"fi": "Otsikko", "en": "Title"},
                        "illegal": "field",
                    },
                },
                {},
                {
                    "response": {
                        "illegal": ["Unknown field."],
                    },
                    "status": 400,
                },
            ),
            (
                {
                    "call": lambda: QvainDatasets().post(),
                },
                {
                    "headers": {"COOKIE": sso_cookie_login()},
                    "json": {
                        "title": {"fi": "Otsikko", "en": "Title"},
                        "use_doi": False,
                    },
                },
                {"metax_responses": [(None, 123, False)]},
                {
                    "response": None,
                    "status": 123,
                },
            ),
            (
                {
                    "call": lambda: QvainDatasets().post(),
                },
                {
                    "headers": {"COOKIE": sso_cookie_login()},
                    "json": {
                        "title": {"fi": "Otsikko", "en": "Title"},
                        "use_doi": False,
                    },
                },
                {
                    "metax_responses": [({"identifier": "test-1234"}, 200, True)],
                    "metax_calls": [
                        {
                            "request": requests.post,
                            **default_datasets_call_args,
                            "params": {},
                            "json": {
                                "metadata_provider_org": "Testers inc.",
                                "metadata_provider_user": "teppo",
                                "research_dataset": {
                                    "title": {"en": "Title", "fi": "Otsikko"},
                                    "issued": date.today().strftime("%Y-%m-%d"),
                                },
                                "access_granter": {
                                    "userid": "teppo",
                                    "email": None,
                                    "name": "None None",
                                },
                            },
                        },
                    ],
                },
                {
                    "response": {"identifier": "test-1234"},
                    "status": 200,
                },
            ),
            (
                {
                    "call": lambda: QvainDataset().get("test-1234"),
                },
                {},
                {},
                {"response": {"PermissionError": "User not logged in."}, "status": 401},
            ),
            (
                {
                    "call": lambda: QvainDataset().get("test-1234"),
                },
                {"headers": {"COOKIE": sso_cookie_login()}},
                {},
                {
                    "response": {
                        "PermissionError": "Dataset does not exist or user is not allowed to edit the dataset."
                    },
                    "status": 403,
                },
            ),
            (
                {
                    "call": lambda: QvainDataset().get("test-1234"),
                },
                {"headers": {"COOKIE": sso_cookie_login()}},
                {
                    "cr_responses": [default_cr_response, default_cr_response],
                    "metax_responses": [
                        ({"catalog": "record"}, 200, True),
                    ],
                    "metax_calls": [
                        {
                            "request": requests.get,
                            **default_datasets_call_args,
                            "url": "https://mock-metax/rest/v2/datasets/test-1234",
                        }
                    ],
                },
                {
                    "response": {"catalog": "record"},
                    "status": 200,
                },
            ),
            (
                {
                    "call": lambda: QvainDataset().patch("test-1234"),
                },
                {},
                {},
                {"response": {"PermissionError": "User not logged in."}, "status": 401},
            ),
            (
                {
                    "call": lambda: QvainDataset().patch("test-1234"),
                },
                {"headers": {"COOKIE": sso_cookie_login()}},
                {},
                {
                    "response": {
                        "PermissionError": "Dataset does not exist or user is not allowed to edit the dataset."
                    },
                    "status": 403,
                },
            ),
            (
                {
                    "call": lambda: QvainDataset().patch("test-1234"),
                },
                {"headers": {"COOKIE": sso_cookie_login()}, "json": {}},
                {"cr_responses": [default_cr_response, default_cr_response]},
                {
                    "response": {"title": ["Missing data for required field."]},
                    "status": 400,
                },
            ),
            (
                {
                    "call": lambda: QvainDataset().patch("test-1234"),
                },
                {
                    "headers": {"COOKIE": sso_cookie_login()},
                    "json": {"title": {"fi": "Otsikko", "en": "Title"}},
                },
                {"cr_responses": [default_cr_response, default_cr_response]},
                {
                    "response": {"Error": "Missing original dataset."},
                    "status": 400,
                },
            ),
            (
                {
                    "call": lambda: QvainDataset().patch("test-1234"),
                },
                {
                    "headers": {"COOKIE": sso_cookie_login()},
                    "json": {
                        "title": {"fi": "Otsikko", "en": "Title"},
                        "original": {
                            "identifier": "test-1234",
                            "date_created": "2020-01-03T01:02:03Z",
                            "research_dataset": {},
                        },
                    },
                },
                {
                    "cr_responses": [default_cr_response, default_cr_response],
                    "metax_responses": [({"catalog": "record"}, 200, True)],
                    "metax_calls": [
                        {
                            "request": requests.patch,
                            "url": "https://mock-metax/rest/v2/datasets/test-1234",
                            "auth": ("qvain", "test-qvain"),
                            "headers": {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "If-Unmodified-Since": "Fri, 03 Jan 2020 01:02:03 GMT",
                            },
                            "json": {
                                "access_granter": {
                                    "email": None,
                                    "name": "None None",
                                    "userid": "teppo",
                                },
                                "research_dataset": {
                                    "issued": date.today().strftime("%Y-%m-%d"),
                                    "title": {"en": "Title", "fi": "Otsikko"},
                                },
                            },
                            "params": {},
                            "proxies": None,
                            "timeout": 30,
                            "verify": True,
                        }
                    ],
                },
                {
                    "response": {"catalog": "record"},
                    "status": 200,
                },
            ),
            (
                {
                    "call": lambda: QvainDataset().delete("test-1234"),
                },
                {},
                {},
                {"response": {"PermissionError": "User not logged in."}, "status": 401},
            ),
            (
                {
                    "call": lambda: QvainDataset().delete("test-1234"),
                },
                {"headers": {"COOKIE": sso_cookie_login()}},
                {},
                {
                    "response": {
                        "PermissionError": "Dataset does not exist or user is not allowed to edit the dataset."
                    },
                    "status": 403,
                },
            ),
            (
                {
                    "call": lambda: QvainDataset().delete("test-1234"),
                },
                {"headers": {"COOKIE": sso_cookie_login()}},
                {
                    "cr_responses": [default_cr_response, default_cr_response],
                    "metax_responses": [
                        (None, 200, True),
                    ],
                    "metax_calls": [
                        {
                            "request": requests.delete,
                            "url": "https://mock-metax/rest/v2/datasets/test-1234",
                            "auth": ("qvain", "test-qvain"),
                            "headers": {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                            "proxies": None,
                            "timeout": 30,
                            "verify": True,
                        },
                    ],
                },
                {
                    "response": None,
                    "status": 200,
                },
            ),
            (
                {
                    "call": lambda: QvainDatasetFiles().post("test-1234"),
                },
                {},
                {},
                {"response": {"PermissionError": "User not logged in."}, "status": 401},
            ),
            (
                {
                    "call": lambda: QvainDatasetFiles().post("test-1234"),
                },
                {"headers": {"COOKIE": sso_cookie_login()}},
                {},
                {
                    "response": {
                        "PermissionError": "Dataset does not exist or user is not allowed to edit the dataset."
                    },
                    "status": 403,
                },
            ),
            (
                {
                    "call": lambda: QvainDatasetFiles().post("test-1234"),
                },
                {"headers": {"COOKIE": sso_cookie_login()}, "json": {}},
                {
                    "cr_responses": [default_cr_response, default_cr_response],
                    "metax_responses": [("metax_error", 123, True)],
                    "metax_calls": [
                        {
                            "request": requests.post,
                            "url": "https://mock-metax/rest/v2/datasets/test-1234/files",
                            "auth": ("qvain", "test-qvain"),
                            "headers": {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                            "proxies": None,
                            "timeout": 30,
                            "verify": True,
                            "json": {},
                            "params": {"allowed_projects": "test-1234"},
                        },
                    ],
                },
                {
                    "response": "metax_error",
                    "status": 123,
                },
            ),
            (
                {
                    "call": lambda: QvainDatasetFiles().post("test-1234"),
                },
                {"headers": {"COOKIE": sso_cookie_login()}, "json": {}},
                {
                    "cr_responses": [default_cr_response, default_cr_response],
                    "metax_responses": [("response", 200, True)],
                    "metax_calls": [
                        {
                            "request": requests.post,
                            "url": "https://mock-metax/rest/v2/datasets/test-1234/files",
                            "auth": ("qvain", "test-qvain"),
                            "headers": {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                            "proxies": None,
                            "timeout": 30,
                            "verify": True,
                            "json": {},
                            "params": {"allowed_projects": "test-1234"},
                        },
                    ],
                },
                {
                    "response": "response",
                    "status": 200,
                },
            ),
        ],
    )
    def test_qvain_resources(
        self, app, mocker, test_details, context_details, mock_requests, expected
    ):
        """Test qvain resources."""
        if test_details.get("flags", False) is True:
            mocker.patch(
                "etsin_finder.resources.qvain_resources.flag_enabled", return_value=True
            )

        metax_make_request = None
        if mock_requests.get("metax_responses") is not None:
            metax_make_request = mocker.patch(
                "etsin_finder.services.qvain_service.make_request",
                side_effect=mock_requests["metax_responses"],
            )

        cr_make_request = None
        if mock_requests.get("cr_responses") is not None:
            cr_make_request = mocker.patch(
                "etsin_finder.services.cr_service.make_request",
                side_effect=mock_requests["cr_responses"],
            )

        with app.test_request_context(**context_details):
            try:
                response, status = test_details.get("call")()
            except HTTPException as e:
                response, status = e.response.json, e.response.status_code

            assert response == expected.get("response")
            assert status == expected.get("status")
            for call in mock_requests.get("metax_calls", []):
                request = call["request"]
                del call["request"]
                url = call["url"]
                del call["url"]
                metax_make_request.assert_any_call(request, url, **call)

            for call in mock_requests.get("cr_calls", []):
                request = call["request"]
                del call["request"]
                url = call["url"]
                del call["url"]
                cr_make_request.assert_called_with(request, url, **call)


class TestQvainDatasetsEditorPermissions(BaseTest):
    """Tests for dataset editor permissions."""

    @pytest.fixture
    def mocks(self, requests_mock, mocker, app):
        """Mock editor permissions."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": True}, app)

        mocker.patch(
            "etsin_finder.resources.qvain_resources.LDAPIdmService", MockLDAPIdmService
        )
        mocker.patch("pymemcache.client.base.Client.set", return_value=None)
        mocker.patch("pymemcache.client.base.Client.get", return_value=None)

        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/1",
            json={
                "identifier": "1",
                "metadata_provider_user": "teppo_testaaja",
                "data_catalog": {
                    "catalog_json": {"identifier": "urn:nbn:fi:att:data-catalog-ida"}
                },
                "research_dataset": {"title": {"en": "This is the title of dataset 1"}},
            },
            status_code=200,
        )

        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/1/projects",
            json=["project_x"],
            status_code=200,
        )

        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/1/editor_permissions/users",
            json=[
                {"user_id": "teppo_testaaja", "role": "creator"},
                {"user_id": "editori", "role": "editor"},
                {"user_id": "user_no_longer_in_ldap", "role": "editor"},
            ],
            status_code=200,
        )

        requests_mock.post(
            "https://mock-metax/rest/v2/datasets/1/editor_permissions/users",
            status_code=201,
        )

        requests_mock.delete(
            "https://mock-metax/rest/v2/datasets/1/editor_permissions/users/editori",
            status_code=200,
        )

    def test_get_user_editor_permissions_flag_required(self, authd_client, app):
        """Test that editor permissions require feature flag."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": False}, app)
        r = authd_client.get("/api/qvain/datasets/1/editor_permissions")
        assert r.status_code == 405

    def test_get_user_editor_permissions(
        self, mocks, authd_client, user_details, IDA_projects_ok
    ):
        """Test that editor permissions are collected from Metax and LDAP."""
        r = authd_client.get("/api/qvain/datasets/1/editor_permissions")
        assert r.status_code == 200
        assert r.json == {
            "project": "project_x",
            "users": [
                {  # editor, not project member
                    "uid": "editori",
                    "name": "Edi Tori",
                    "role": "editor",
                    "is_project_member": False,
                    "email": "editori@example.com",
                },
                {  # no role, project member
                    "uid": "jasen",
                    "name": "Projen Jäsen",
                    "is_project_member": True,
                    "email": "jasen@example.com",
                },
                {  # creator, project member
                    "uid": "teppo_testaaja",
                    "name": "Teppo Testaaja",
                    "role": "creator",
                    "is_project_member": True,
                    "email": "teppo@example.com",
                },
                {  # editor, user does not exist in ldap
                    "uid": "user_no_longer_in_ldap",
                    "role": "editor",
                    "is_project_member": False,
                },
            ],
        }

    def test_get_user_editor_permissions_fail_search(
        self, mocks, authd_client, user_details, IDA_projects_ok, mocker
    ):
        """Test that an error is returned if LDAP search fails."""
        mocker.patch(
            "etsin_finder.resources.qvain_resources.LDAPIdmService",
            MockLDAPIdmServiceFail,
        )
        r = authd_client.get("/api/qvain/datasets/1/editor_permissions")
        assert r.status_code == 500
        assert r.json == {"message": "Search failed due to an error."}

    def test_post_user_editor_permissions(
        self, mocks, authd_client, user_details, IDA_projects_ok, capture_mail
    ):
        """Test that editor permissions are collected from Metax and LDAP."""
        data = {"users": ["not_member", "jasen"], "message": "Hello, this is dataset."}
        r = authd_client.post("/api/qvain/datasets/1/editor_permissions", json=data)
        assert r.status_code == 200
        assert r.json == {
            "users": [
                {
                    "name": "Projen Jäsen",
                    "uid": "jasen",
                    "email": "jasen@example.com",
                    "success": True,
                    "status": 201,
                },
                {
                    "name": "Not Member",
                    "uid": "not_member",
                    "email": "not_member@example.com",
                    "success": True,
                    "status": 201,
                },
            ],
            "email": {"success": True},
        }

        # check that correct emails are sent
        assert len(capture_mail) == 2
        msg = capture_mail[0]
        assert msg.send_to == {
            "jasen@example.com",
        }
        assert msg.subject == "You have new editing rights in Fairdata Qvain"
        assert msg.body == (
            'User Teppo Testaaja has given you (jasen) editing rights in Fairdata Qvain, dataset "This is the title of dataset 1":\n\n'
            "Hello, this is dataset.\n"
            "https://qvain/dataset/1\n"
        )

        msg = capture_mail[1]
        assert msg.send_to == {
            "not_member@example.com",
        }
        assert msg.subject == "You have new editing rights in Fairdata Qvain"
        assert msg.body == (
            'User Teppo Testaaja has given you (not_member) editing rights in Fairdata Qvain, dataset "This is the title of dataset 1":\n\n'
            "Hello, this is dataset.\n"
            "https://qvain/dataset/1\n"
        )

    def test_post_user_editor_permissions_metax_fail(
        self, mocks, authd_client, user_details, IDA_projects_ok, requests_mock
    ):
        """Test that editor permissions are collected from Metax and LDAP."""
        requests_mock.post(
            "https://mock-metax/rest/v2/datasets/1/editor_permissions/users",
            json={"user_id": "User_id already exists"},
            status_code=400,
        )
        data = {"users": ["not_member"]}
        r = authd_client.post("/api/qvain/datasets/1/editor_permissions", json=data)
        assert r.status_code == 200
        assert r.json == {
            "users": [
                {
                    "email": "not_member@example.com",
                    "name": "Not Member",
                    "status": 400,
                    "success": False,
                    "uid": "not_member",
                }
            ],
            "email": {"success": False},
        }

    def test_post_user_editor_permissions_not_in_ldap(
        self, mocks, authd_client, user_details, IDA_projects_ok
    ):
        """Test that editor permissions are collected from Metax and LDAP."""
        data = {"users": ["not_member", "not_in_ldap", "this_also_not_in_ldap"]}
        r = authd_client.post("/api/qvain/datasets/1/editor_permissions", json=data)
        assert r.status_code == 400
        assert r.json == {
            "message": "Users not found: not_in_ldap, this_also_not_in_ldap"
        }

    def test_delete_user_editor_permissions_user(
        self, mocks, authd_client, user_details, IDA_projects_ok
    ):
        """Test that editor permissions are collected from Metax and LDAP."""
        data = {"users": ["not_member", "not_in_ldap", "this_also_not_in_ldap"]}
        r = authd_client.delete(
            "/api/qvain/datasets/1/editor_permissions/editori", json=data
        )
        assert r.json is None
        assert r.status_code == 200
