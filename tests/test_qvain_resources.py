"""Test suite for Qvain resources."""

import pytest
from etsin_finder.utils.flags import set_flags

from .basetest import BaseTest

"Test Qvain resources"


class TestQvainDatasetsGet(BaseTest):
    """Tests for Qvain Datasets GET."""

    @pytest.fixture
    def unauthd_datasets_client(self, app, unauthd_client):
        """Setup unauthenticated client."""
        set_flags({"PERMISSIONS.SHARE_PROJECT": True}, app)
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
        set_flags({"PERMISSIONS.SHARE_PROJECT": True}, app)
        return authd_client

    @pytest.fixture
    def mock_requests(self, requests_mock):
        """Make basic mocks for requests."""

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
