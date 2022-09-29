# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Test authorization methods"""

import pytest
from .basetest import BaseTest
import json

from etsin_finder.auth import authorization
from etsin_finder.services import cr_service
from etsin_finder.utils.constants import ACCESS_DENIED_REASON
from etsin_finder.utils.flags import set_flags


class UserAccessBaseTest(BaseTest):
    """Fixtures for testing dataset user access."""

    @pytest.fixture
    def mock_app(self, app, requests_mock):
        """Mock requests and setup app."""
        # dataset belongs to project_x, there are no editors
        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/project_dataset/projects",
            json=["project_x"],
            status_code=200,
        )
        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/project_dataset/editor_permissions/users",
            json=[],
            status_code=200,
        )
        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/no_dataset/editor_permissions/users",
            json={"detail": "Not found."},
            status_code=404,
        )

        # dataset doesn't belong to a project, teppo_testaaja has editor permission
        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/editor_dataset/projects",
            json=[],
            status_code=200,
        )
        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/editor_dataset/editor_permissions/users",
            json=[{"user_id": "random_user"}, {"user_id": "teppo_testaaja"}],
            status_code=200,
        )
        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/no_dataset/editor_permissions/users",
            json={"detail": "Not found."},
            status_code=404,
        )
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": True}, app)
        with app.app_context():
            yield app

    @pytest.fixture
    def cr_published(self, mocker):
        """Published dataset"""
        mocker.patch(
            "etsin_finder.services.cr_service.get_catalog_record",
            return_value={
                "state": "published",
                "metadata_provider_user": "teppo_testaaja",
            },
        )

    @pytest.fixture
    def cr_draft(self, mocker):
        """Draft dataset"""
        mocker.patch(
            "etsin_finder.services.cr_service.get_catalog_record",
            return_value={
                "state": "draft",
                "metadata_provider_user": "teppo_testaaja",
            },
        )

    @pytest.fixture
    def cr_none(self, mocker):
        """Draft dataset"""
        mocker.patch(
            "etsin_finder.services.cr_service.get_catalog_record", return_value=None
        )

    @pytest.fixture
    def unflagged_app(self, mock_app):
        """Setup mock app with editor rights flag disabled."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": False}, mock_app)


class TestUserHasDatasetProject(UserAccessBaseTest):
    """Tests for authorization.user_has_dataset_project"""

    def test_matching_project(self, mock_app, user_details, IDA_projects_ok):
        """Return True when user is a member of dataset project."""
        assert authorization.user_has_dataset_project("project_dataset") is True

    def test_wrong_project(self, mock_app, user_details, IDA_projects_dont_match):
        """Return False when user is not a member of dataset project."""
        assert authorization.user_has_dataset_project("project_dataset") is False

    def test_no_ida_projects(self, mock_app, user_details, no_IDA_projects):
        """Return False when user has no projects."""
        assert authorization.user_has_dataset_project("project_dataset") is False

    def test_unauthd(self, mock_app, unauthd_client, no_IDA_projects):
        """Return True when user is a member of dataset project."""
        assert authorization.user_has_dataset_project("project_dataset") is False

    def test_missing_dataset(self, mock_app, user_details, IDA_projects_ok):
        """Return True when user is a member of dataset project."""
        assert authorization.user_has_dataset_project("no_dataset") is False

    def test_flag_disabled(self, unflagged_app, user_details, IDA_projects_ok):
        """Return False when editor rights flag is disabled."""
        assert authorization.user_has_dataset_project("project_dataset") is False


class TestUserHasDatasetEditorPermission(UserAccessBaseTest):
    """Tests for user_has_dataset_editor_permission."""

    def test_user_is_editor(self, mock_app, user_details, no_IDA_projects):
        """Return True when user has editor permission."""
        assert (
            authorization.user_has_dataset_editor_permission("editor_dataset") is True
        )

    def test_user_is_not_editor(self, mock_app, user_123_details, no_IDA_projects):
        """Return False when user has no editor permission."""
        assert (
            authorization.user_has_dataset_editor_permission("editor_dataset") is False
        )

    def test_unauhtd(self, mock_app, unauthd_client, no_IDA_projects):
        """Return False when user is not authenticated."""
        assert (
            authorization.user_has_dataset_editor_permission("editor_dataset") is False
        )

    def test_missing_dataset(self, mock_app, user_details, no_IDA_projects):
        """Return False when dataset does not exist."""
        assert authorization.user_has_dataset_editor_permission("no_dataset") is False

    def test_flag_disabled(self, unflagged_app, user_details, no_IDA_projects):
        """Return False when editor rights flag is disabled."""
        assert (
            authorization.user_has_dataset_editor_permission("editor_dataset") is False
        )


class TestUserHasEditAccess(UserAccessBaseTest):
    """Tests for user_has_edit_access."""

    def test_user_is_editor(self, mock_app, user_details, no_IDA_projects):
        """Return True when user has editor permission."""
        assert authorization.user_has_edit_access("editor_dataset") is True

    def test_user_is_not_editor(self, mock_app, user_123_details, no_IDA_projects):
        """Return False when user has no editor permission."""
        assert authorization.user_has_edit_access("editor_dataset") is False

    def test_matching_project(self, mock_app, user_details, IDA_projects_ok):
        """Return True when user is a member of dataset project."""
        assert authorization.user_has_edit_access("project_dataset") is True

    def test_wrong_project(self, mock_app, user_details, IDA_projects_dont_match):
        """Return False when user is not a member of dataset project."""
        assert authorization.user_has_edit_access("project_dataset") is False

    def test_no_ida_projects(self, mock_app, user_details, no_IDA_projects):
        """Return False when user has no projects."""
        assert authorization.user_has_edit_access("project_dataset") is False

    def test_unauthd(self, mock_app, unauthd_client, no_IDA_projects):
        """Return False when user is not authenticated."""
        assert authorization.user_has_edit_access("project_dataset") is False

    def test_missing_dataset(self, mock_app, unauthd_client, no_IDA_projects):
        """Return False when dataset does not exist."""
        assert authorization.user_has_edit_access("no_dataset") is False


class TestUserCanViewDataset(UserAccessBaseTest):
    """Tests for checking if user can view dataset."""

    def test_user_is_editor(self, mock_app, cr_draft, user_details, no_IDA_projects):
        """Return True when user has editor permission."""
        assert authorization.user_can_view_dataset("editor_dataset") is True

    def test_user_is_not_editor(
        self, mock_app, cr_draft, user_123_details, no_IDA_projects
    ):
        """Return False when user has no editor permission."""
        assert authorization.user_can_view_dataset("editor_dataset") is False

    def test_matching_project(self, mock_app, cr_draft, user_details, IDA_projects_ok):
        """Return True when user is a member of dataset project."""
        assert authorization.user_can_view_dataset("project_dataset") is True

    def test_wrong_project(
        self, mock_app, cr_draft, user_details, IDA_projects_dont_match
    ):
        """Return False when user is not a member of dataset project."""
        assert authorization.user_can_view_dataset("project_dataset") is False

    def test_no_ida_projects(self, mock_app, cr_draft, user_details, no_IDA_projects):
        """Return False when user has no projects."""
        assert authorization.user_can_view_dataset("project_dataset") is False

    def test_unauthd(self, mock_app, cr_draft, unauthd_client, no_IDA_projects):
        """Return False when user is not authenticated."""
        assert authorization.user_can_view_dataset("project_dataset") is False

    def test_unauthd_published(
        self, mock_app, cr_published, unauthd_client, no_IDA_projects
    ):
        """Return True for unauthenticated users if dataset is published."""
        assert authorization.user_can_view_dataset("project_dataset") is True

    def test_missing_dataset(self, mock_app, cr_none, unauthd_client, no_IDA_projects):
        """Return False for missing dataset."""
        assert authorization.user_can_view_dataset("no_dataset") is False


class TestUserCanViewOrEditDatasetUnflagged(UserAccessBaseTest):
    """Tests for view and edit access based on metadata_provider_user."""

    def test_user_is_metadata_provider_user(
        self, unflagged_app, cr_draft, user_details, no_IDA_projects
    ):
        """User who is metadata_provider_user should see dataset."""
        assert authorization.user_can_view_dataset("editor_dataset") is True
        assert authorization.user_has_edit_access("editor_dataset") is True

    def test_user_is_not_metadata_provider_user(
        self, unflagged_app, cr_draft, user_123_details, no_IDA_projects
    ):
        """User who is not metadata_provider_user should not see dataset."""
        assert authorization.user_can_view_dataset("editor_dataset") is False
        assert authorization.user_has_edit_access("editor_dataset") is False

    def test_user_is_not_metadata_provider_user_but_in_project(
        self, unflagged_app, cr_draft, user_123_details, IDA_projects_ok
    ):
        """Project membership should not affect access."""
        assert authorization.user_can_view_dataset("project_dataset") is False
        assert authorization.user_has_edit_access("project_dataset") is False

    def test_unauthd(self, unflagged_app, cr_draft, unauthd_client, no_IDA_projects):
        """Unauthenticated user should not be able to access draft."""
        assert authorization.user_can_view_dataset("project_dataset") is False
        assert authorization.user_has_edit_access("project_dataset") is False

    def test_unauthd_published(
        self, unflagged_app, cr_published, unauthd_client, no_IDA_projects
    ):
        """Published dataset should be viewable but not editable by unauthenticated users."""
        assert authorization.user_can_view_dataset("project_dataset") is True
        assert authorization.user_has_edit_access("project_dataset") is False

    def test_missing_dataset(
        self, unflagged_app, cr_none, user_details, IDA_projects_ok
    ):
        """Nonexistent dataset should not be available."""
        assert authorization.user_can_view_dataset("no_dataset") is False
        assert authorization.user_has_edit_access("no_dataset") is False


class TestDownloadDeniedReason(BaseTest):
    """Test user_is_allowed_to_download_from_ida denial reason"""

    def test_open_dataset(self, unauthd_client, open_catalog_record):
        """Test open dataset"""
        r = unauthd_client.get("/api/dataset/123")
        cr = json.loads(r.get_data()).get("catalog_record")
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is True
        assert reason is None

    def test_login_dataset(self, unauthd_client, login_catalog_record):
        """Test login dataset"""
        r = unauthd_client.get("/api/dataset/123")
        cr = json.loads(r.get_data()).get("catalog_record")
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is False
        assert reason is ACCESS_DENIED_REASON["NEED_LOGIN"]

    def test_embargo_dataset(self, unauthd_client, embargo_not_passed_catalog_record):
        """Test embargoed dataset"""
        r = unauthd_client.get("/api/dataset/123")
        cr = json.loads(r.get_data()).get("catalog_record")
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is False
        assert reason is ACCESS_DENIED_REASON["EMBARGO"]

    def test_permit_dataset(
        self, unauthd_client, permit_catalog_record, no_rems_permit
    ):
        """Test permit dataset"""
        r = unauthd_client.get("/api/dataset/123")
        cr = json.loads(r.get_data()).get("catalog_record")
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is False
        assert reason is ACCESS_DENIED_REASON["NEED_REMS_PERMISSION"]

    def test_restricted_dataset(self, unauthd_client, restricted_catalog_record):
        """Test restricted dataset"""
        r = unauthd_client.get("/api/dataset/123")
        cr = json.loads(r.get_data()).get("catalog_record")
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is False
        assert reason is ACCESS_DENIED_REASON["RESTRICTED"]
