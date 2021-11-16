"""Test suite for Qvain resources."""

import pytest
from etsin_finder.utils.flags import set_flags

from .basetest import BaseTest
from .test_ldap import createMockLDAPIdmService, MockLDAPIdmServiceFail

"Test Qvain resources"

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
    def unauthd_datasets_client(self, app, unauthd_client):
        """Setup unauthenticated client."""
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
        """Setup authenticated client with user details and projects."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": True}, app)
        return authd_client

    user_dataset = {"id": "user_dataset", "date_created": "2020-01-03"}
    user_project_dataset = {"id": "user_project_dataset", "date_created": "2020-01-02"}
    project_dataset = {"id": "project_dataset", "date_created": "2020-01-01"}

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
        """Fetching user datasets fails."""
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
        """Fetching project datasets fails."""
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
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true&shared=true")
        assert r.status_code == 200
        assert r.json == []

    def test_user_datasets(self, datasets_client, user_datasets, no_project_datasets):
        """Test that datasets returns user datasets with 'creator' source."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true&shared=true")
        assert r.status_code == 200
        assert r.json == [
            {**self.user_dataset, "sources": ["creator"]},
            {**self.user_project_dataset, "sources": ["creator"]},
        ]

    def test_project_datasets(
        self, datasets_client, no_user_datasets, project_datasets
    ):
        """Test that datasets returns user datasets with 'project' source."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true&shared=true")
        assert r.status_code == 200
        assert r.json == [
            {**self.user_project_dataset, "sources": ["project"]},
            {**self.project_dataset, "sources": ["project"]},
        ]

    def test_user_project_datasets(
        self, datasets_client, user_datasets, project_datasets
    ):
        """Test that datasets returns datasets with multiple sources."""
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true&shared=true")
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
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true&shared=true")
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
        r = datasets_client.get("/api/qvain/datasets?no_pagination=true&shared=true")
        assert r.status_code == 500
        assert r.json == {"message": "Failed to get datasets"}

    def test_no_auth(
        self, unauthd_datasets_client, no_user_datasets, no_project_datasets
    ):
        """Test that datasets returns 401 for unauthenticated user."""
        r = unauthd_datasets_client.get(
            "/api/qvain/datasets?no_pagination=true&shared=true"
        )
        assert r.status_code == 401
        assert r.json == {"PermissionError": "User not logged in."}


class TestQvainDatasetsGetEditorPermissions(BaseTest):
    """Tests for dataset editor permissions."""

    @pytest.fixture
    def mocks(self, requests_mock, mocker, app):
        """Mocks for editor permissions."""
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
        self, mocks, authd_client, user_details, IDA_projects_ok
    ):
        """Test that editor permissions are collected from Metax and LDAP."""
        data = {"users": ["not_member"]}
        r = authd_client.post("/api/qvain/datasets/1/editor_permissions", json=data)
        assert r.status_code == 201
        assert r.json == ""

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
        assert r.status_code == 400
        assert r.json == {"user_id": "User_id already exists"}

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
        assert r.status_code == 200
        assert r.json == ""
