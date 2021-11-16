# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Test authorization methods"""

from etsin_finder import auth
import pytest
from .basetest import BaseTest
import json

from etsin_finder.auth import authorization
from etsin_finder.services import cr_service
from etsin_finder.utils.constants import ACCESS_DENIED_REASON
from etsin_finder.utils.flags import set_flags


class TestUserhasDatasetProject(BaseTest):
    """Tests for authorization.user_has_dataset_project"""

    def test_matching_project(self, app, IDA_projects_ok, requests_mock):
        """Return True when user is a member of dataset project"""
        with app.app_context():
            requests_mock.get(
                "https://mock-metax/rest/v2/datasets/1/projects",
                json=["project_x"],
                status_code=200,
            )
            assert authorization.user_has_dataset_project(1) is True

    def test_wrong_project(self, app, IDA_projects_dont_match, requests_mock):
        """Return False when user is not a member of dataset project"""
        with app.app_context():
            requests_mock.get(
                "https://mock-metax/rest/v2/datasets/1/projects",
                json=["project_x"],
                status_code=200,
            )
            assert authorization.user_has_dataset_project(1) is False

    def test_no_ida_projects(self, app, no_IDA_projects, requests_mock):
        """Return False when user has no projects"""
        with app.app_context():
            requests_mock.get(
                "https://mock-metax/rest/v2/datasets/1/projects",
                json=["project_x"],
                status_code=200,
            )
            assert authorization.user_has_dataset_project(1) is False


class TestUserCanViewDataset(BaseTest):
    """Tests for authorization.user_can_view_dataset"""

    @pytest.fixture
    def flagged_app(self, app):
        """App with PERMISSIONS.EDITOR_RIGHTS flag enabled"""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": True}, app)
        return app

    @pytest.fixture
    def cr_published(self, monkeypatch):
        """Published dataset"""
        monkeypatch.setattr(
            cr_service, "get_catalog_record", lambda *x: {"state": "published"}
        )

    @pytest.fixture
    def cr_draft(self, monkeypatch):
        """Draft dataset"""
        monkeypatch.setattr(
            cr_service, "get_catalog_record", lambda *x: {"state": "draft"}
        )

    @pytest.fixture
    def cr_draft_teppo(self, monkeypatch):
        """Draft dataset by teppo_testaaja"""
        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda *x: {"state": "draft", "metadata_provider_user": "teppo_testaaja"},
        )

    @pytest.fixture
    def cr_draft_otheruser(self, monkeypatch):
        """Draft dataset by other_user"""
        monkeypatch.setattr(
            cr_service,
            "get_catalog_record",
            lambda *x: {"state": "draft", "metadata_provider_user": "other_user"},
        )

    @pytest.fixture
    def cr_permissions_empty(self, monkeypatch):
        """Dataset without projects"""
        monkeypatch.setattr(
            cr_service, "get_catalog_record_permissions", lambda *x: {"projects": []}
        )

    @pytest.fixture
    def cr_permissions_project_x(self, monkeypatch):
        """Dataset in project_x"""
        monkeypatch.setattr(
            cr_service,
            "get_catalog_record_permissions",
            lambda *x: {"projects": ["project_x"]},
        )

    @pytest.fixture
    def cr_permissions_project_y(self, monkeypatch):
        """Dataset in project_y"""
        monkeypatch.setattr(
            cr_service,
            "get_catalog_record_permissions",
            lambda *x: {"projects": ["project_y"]},
        )

    def test_anonymous_view_published(self, cr_published):
        """Published dataset is available for everyone"""
        assert authorization.user_can_view_dataset(1) is True

    def test_anonymous_view_draft(self, flagged_app, cr_draft):
        """Draft dataset is not available for public"""
        with flagged_app.test_request_context():
            assert authorization.user_can_view_dataset(1) is False

    def test_loggedin_view_draft_ok_user(
        self, flagged_app, user_details, cr_draft_teppo, cr_permissions_empty
    ):
        """Creator of draft can view it"""
        with flagged_app.test_request_context():
            assert authorization.user_can_view_dataset(1) is True

    def test_loggedin_view_draft_ok_project(
        self,
        flagged_app,
        user_details,
        IDA_projects_ok,
        cr_draft,
        cr_permissions_project_x,
    ):
        """Non-creator project members can view draft"""
        with flagged_app.test_request_context():
            assert authorization.user_can_view_dataset(1) is True

    def test_loggedin_view_project_flag_disabled(
        self,
        flagged_app,
        user_details,
        IDA_projects_ok,
        cr_draft,
        cr_permissions_project_x,
    ):
        """Non-creator project members can't view draft if flag is disabled"""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": False}, flagged_app)
        with flagged_app.test_request_context():
            assert authorization.user_can_view_dataset(1) is False

    def test_loggedin_view_draft_denied(
        self,
        flagged_app,
        user_details,
        IDA_projects_ok,
        cr_draft_otheruser,
        cr_permissions_project_y,
    ):
        """Non-creator can't view draft if they are not project members"""
        with flagged_app.test_request_context():
            assert authorization.user_can_view_dataset(1) is False


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
