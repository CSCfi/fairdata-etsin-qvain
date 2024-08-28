# This file is part of the Etsin service
#
# Copyright 2017-2021 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""
Test Download endpoints

Uses the requests_mock fixture provided by the requests-mock
library for mocking the Download API endpoints.
"""

from etsin_finder.services.download_service import DownloadAPIService
import json
import pytest
import requests

from .basetest import BaseTest

fakePackage = {
    "package": "x.zip",
    "status": "SUCCESS",
}

fakeProjects = ["project_x"]

fakeByteSizeCheck = {"results": {"byte_size": 4000000}}

fakeNoActiveTasks = {
    "error": "no active package generation tasks",
}

fakeNoDataset = {
    "error": "dataset not found in metax",
}

fakeToken = {
    "token": "abcdf00f",
}

fakePackageDownloadUrl = {
    "url": f"https://mock-download-public:2/download?token={fakeToken['token']}",
}

fakeFileDownloadUrl = {
    "url": f"https://mock-download-public:2/download?token={fakeToken['token']}",
}


def match_dataset(dataset):
    """Matcher that requires supplied dataset parameter to match."""

    def matcher(request):
        return request.json().get("dataset") == str(dataset)

    return matcher


class RequestMocks(BaseTest):
    """Request mocks test suite."""

    @pytest.fixture
    def mock_requests(self, requests_mock):
        """Make basic mocks for requests."""
        requests_mock.get(
            "https://mock-download:1/requests?dataset=1",
            json=fakePackage,
            status_code=200,
        )
        requests_mock.post(
            "https://mock-download:1/requests", json=fakePackage, status_code=200
        )
        requests_mock.get(
            "https://mock-metax/rest/v2/datasets/1/projects",
            json=fakeProjects,
            status_code=200,
        )

    @pytest.fixture
    def mock_byte_size_root(self, requests_mock):
        """Mock byte size check when using root directory."""
        requests_mock.get(
            "https://mock-metax/rest/v2/directories/files?cr_identifier=1&project=project_x&path=%2F&include_parent&pagination&limit=1",
            json=fakeByteSizeCheck,
            status_code=200,
        )

    @pytest.fixture
    def mock_byte_size_scope(self, requests_mock):
        """Mock byte size check when using 'hei' directory."""
        requests_mock.get(
            "https://mock-metax/rest/v2/directories/files?cr_identifier=1&project=project_x&path=%2Fhei&include_parent&pagination&limit=1",
            json=fakeByteSizeCheck,
            status_code=200,
        )


class TestDownloadResourcesRequests(RequestMocks):
    """Test Download API /requests endpoint."""

    # GET requests
    def test_requests_get_ok(
        self,
        unauthd_client,
        open_catalog_record,
        mock_requests,
        requests_mock,
        mock_byte_size_root,
    ):
        """Successful GET."""
        r = unauthd_client.get("/api/download/requests?cr_id=1")

        assert r.status_code == 200
        assert r.json == fakePackage

    def test_requests_get_missing_param(self, unauthd_client):
        """Failed GET, missing parameter"""
        r = unauthd_client.get("/api/download/requests")
        assert r.status_code == 400

    def test_requests_get_invalid_param(self, unauthd_client, open_catalog_record):
        """Failed GET, unknown parameter"""
        r = unauthd_client.get("/api/download/requests?cr_id=1&unknown_parameter=217")
        assert r.status_code == 400

    def test_requests_get_forbidden(self, unauthd_client, login_catalog_record):
        """Failed GET, dataset requires login"""
        r = unauthd_client.get("/api/download/requests?cr_id=1")
        assert r.status_code == 403

    def test_requests_get_logged_in_ok(
        self, authd_client, login_catalog_record, requests_mock
    ):
        """Succesful GET for dataset requiring login"""
        requests_mock.get(
            "https://mock-download:1/requests?dataset=1",
            json=fakePackage,
            status_code=200,
        )
        r = authd_client.get("/api/download/requests?cr_id=1")
        assert r.status_code == 200

    def test_requests_get_requests_not_found(
        self, unauthd_client, open_catalog_record, requests_mock
    ):
        """Failed GET, no packages exist for dataset"""
        requests_mock.get(
            "https://mock-download:1/requests?dataset=1",
            json=fakeNoActiveTasks,
            status_code=404,
        )
        r = unauthd_client.get("/api/download/requests?cr_id=1")
        assert r.status_code == 200
        assert r.json == {}

    def test_requests_get_dataset_not_found(
        self, unauthd_client, open_catalog_record, requests_mock
    ):
        """Failed GET, no packages exist for dataset"""
        requests_mock.get(
            "https://mock-download:1/requests?dataset=1",
            json=fakeNoDataset,
            status_code=404,
        )
        r = unauthd_client.get("/api/download/requests?cr_id=1")
        assert r.status_code == 404
        assert r.json == fakeNoDataset

    def test_requests_get_error(
        self, unauthd_client, open_catalog_record, requests_mock
    ):
        """Failed GET, connection timeout"""
        requests_mock.get(
            "https://mock-download:1/requests?dataset=1",
            exc=requests.exceptions.ConnectTimeout,
        )
        r = unauthd_client.get("/api/download/requests?cr_id=1")
        assert r.status_code == 503

    # POST requests

    def test_requests_post_ok(
        self, unauthd_client, open_catalog_record, mock_requests, mock_byte_size_root
    ):
        """Successful POST."""
        r = unauthd_client.post("/api/download/requests", json={"cr_id": "1"})

        assert r.status_code == 200
        assert r.json == fakePackage

    def test_requests_post_scope_ok(
        self, unauthd_client, open_catalog_record, mock_requests, mock_byte_size_scope
    ):
        """Successful POST with scope."""
        r = unauthd_client.post(
            "/api/download/requests", json={"cr_id": "1", "scope": ["/hei", "/moro"]}
        )
        assert r.status_code == 200
        assert r.json == fakePackage

    def test_requests_post_invalid_cr_type(self, unauthd_client, open_catalog_record):
        """Failed POST with unknown parameter"""
        r = unauthd_client.post(
            "/api/download/requests", json={"cr_id": "1", "sadness": True}
        )
        assert r.status_code == 400

    def test_requests_post_invalid_param(self, unauthd_client, open_catalog_record):
        """Failed POST with unknown parameter"""
        r = unauthd_client.post(
            "/api/download/requests", json={"cr_id": "1", "sadness": True}
        )
        assert r.status_code == 400

    def test_requests_post_forbidden(self, unauthd_client, login_catalog_record):
        """Failed POST, login required"""
        r = unauthd_client.post("/api/download/requests", json={"cr_id": "1"})
        assert r.status_code == 403

    def test_requests_post_logged_in_ok(
        self, authd_client, login_catalog_record, mock_requests, mock_byte_size_root
    ):
        """Succesful POST for dataset requiring login"""
        r = authd_client.post("/api/download/requests", json={"cr_id": "1"})
        assert r.status_code == 200

    def test_requests_post_not_found(
        self,
        unauthd_client,
        open_catalog_record,
        mock_requests,
        requests_mock,
        mock_byte_size_root,
    ):
        """Failed POST, dataset not found"""
        requests_mock.post("https://mock-download:1/requests", status_code=404)
        r = unauthd_client.post("/api/download/requests", json={"cr_id": "1"})
        assert r.status_code == 404

    def test_requests_post_error(
        self,
        unauthd_client,
        open_catalog_record,
        mock_requests,
        requests_mock,
        mock_byte_size_root,
    ):
        """Failed POST, connection timeout"""
        requests_mock.post(
            "https://mock-download:1/requests", exc=requests.exceptions.ConnectTimeout
        )
        r = unauthd_client.post("/api/download/requests", json={"cr_id": "1"})
        assert r.status_code == 503


class TestDownloadResourcesAuthorize(RequestMocks):
    """Test Download API /authorize endpoint"""

    @pytest.fixture
    def authorize_mock(self, requests_mock):
        """Helper fixture for mocking authorization endpoint"""
        requests_mock.post(
            "https://mock-download:1/authorize",
            additional_matcher=match_dataset(1),
            json=fakeToken,
            status_code=200,
        )

    def test_authorize_file_ok(
        self, unauthd_client, open_catalog_record, authorize_mock
    ):
        """Authorize file"""
        r = unauthd_client.post(
            "/api/download/authorize",
            json={"cr_id": "1", "file": "/folder/filename.gif"},
        )
        assert r.status_code == 200
        assert r.json == fakeFileDownloadUrl

    def test_authorize_package_ok(
        self, unauthd_client, open_catalog_record, authorize_mock
    ):
        """Authorize package"""
        r = unauthd_client.post(
            "/api/download/authorize", json={"cr_id": "1", "package": "x.zip"}
        )
        assert r.status_code == 200
        assert r.json == fakePackageDownloadUrl

    def test_authorize_package_invalid_param(self, unauthd_client, open_catalog_record):
        """Fail due to unknown parameter"""
        r = unauthd_client.post(
            "/api/download/authorize",
            json={"cr_id": "1", "package": "x.zip", "extra": True},
        )
        assert r.status_code == 400

    def test_authorize_package_conflicting_params(
        self, unauthd_client, open_catalog_record
    ):
        """Fail due to mutually exclusive parameters"""
        r = unauthd_client.post(
            "/api/download/authorize",
            json={"cr_id": "1", "file": "/folder/filename.gif", "package": "x.zip"},
        )
        assert r.status_code == 400

    def test_authorize_forbidden(self, unauthd_client, login_catalog_record):
        """Require login"""
        r = unauthd_client.post(
            "/api/download/authorize",
            json={"cr_id": "1", "file": "/folder/filename.gif"},
        )
        assert r.status_code == 403

    def test_authorize_logged_in_ok(
        self, authd_client, login_catalog_record, authorize_mock, requests_mock
    ):
        """User logged in, can access dataset"""
        r = authd_client.post(
            "/api/download/authorize",
            json={"cr_id": "1", "file": "/folder/filename.gif"},
        )
        assert r.status_code == 200

    def test_authorize_error(self, unauthd_client, open_catalog_record, requests_mock):
        """Connection timeout"""
        requests_mock.post(
            "https://mock-download:1/authorize", exc=requests.exceptions.ConnectTimeout
        )
        r = unauthd_client.post(
            "/api/download/authorize", json={"cr_id": "1", "package": "x.zip"}
        )
        assert r.status_code == 503


class TestDownloadResourcesStatus(RequestMocks):
    """Test Download API /status endpoint"""

    def test_status_ok(self, unauthd_client, requests_mock):
        """Test ok status"""
        mock = requests_mock.get(
            "https://mock-download:1/status", json="", status_code=200
        )
        r = unauthd_client.get("/api/download/status")
        assert r.status_code == 200
        assert mock.call_count == 1

    def test_status_fail(self, unauthd_client, requests_mock):
        """Teste fail status"""
        mock = requests_mock.get(
            "https://mock-download:1/status", json="", status_code=500
        )
        r = unauthd_client.get("/api/download/status")
        assert r.status_code == 503
        assert mock.call_count == 1


class TestDownloadResourcesSubscriptions(BaseTest):
    """Test Download API /subscriptions endpoint"""

    @pytest.fixture
    def subscribe_mock(self, requests_mock):
        """Helper fixture for mocking subscribe endpoint"""
        return requests_mock.post("https://mock-download:1/subscribe", status_code=200)

    def test_subscribe(self, authd_client, login_catalog_record, subscribe_mock):
        """Subscribe to email notification"""
        r = authd_client.post(
            "/api/download/subscriptions",
            json={"email": "email@example.com", "cr_id": "1"},
        )
        assert r.status_code == 200
        assert subscribe_mock.called

    def test_subscribe_scope(self, authd_client, login_catalog_record, subscribe_mock):
        """Subscribe to email notification with scope"""
        r = authd_client.post(
            "/api/download/subscriptions",
            json={"email": "email@example.com", "cr_id": "1", "scope": ["/path"]},
        )
        assert r.status_code == 200
        assert subscribe_mock.called

    def test_subscribe_no_email(
        self, authd_client, login_catalog_record, subscribe_mock
    ):
        """Fail to subscribe to email notification, missing email"""
        r = authd_client.post("/api/download/subscriptions", json={"cr_id": "1"})
        assert r.status_code == 400

    def test_subscribe_no_cr(self, authd_client, login_catalog_record, subscribe_mock):
        """Fail to subscribe to email notification, missing dataset"""
        r = authd_client.post(
            "/api/download/subscriptions", json={"email": "email@example.com"}
        )
        assert r.status_code == 400


class TestDownloadResourcesNotifications(BaseTest):
    """Test Download API /notifications endpoint"""

    @pytest.fixture
    def subscribe_mock(self, requests_mock):
        """Helper fixture for mocking subscribe endpoint"""
        return requests_mock.post("https://mock-download:1/subscribe", status_code=200)

    def test_notify(
        self, app, authd_client, login_catalog_record, subscribe_mock, capture_mail
    ):
        """Send email notification"""
        authd_client.post(
            "/api/download/subscriptions",
            json={"email": "email@example.com", "cr_id": "1"},
        )
        req_json = subscribe_mock.request_history[0].json()
        notification = {"subscriptionData": req_json["subscriptionData"]}

        r = authd_client.post("/api/download/notifications", json=notification)
        assert r.status_code == 200
        assert len(capture_mail) == 1

    def test_notify_fail(
        self, app, authd_client, login_catalog_record, subscribe_mock, capture_mail
    ):
        """Fail to send email notification, invalid subscriptionData"""
        authd_client.post(
            "/api/download/subscriptions",
            json={"email": "email@example.com", "cr_id": "1"},
        )
        req_json = subscribe_mock.request_history[0].json()

        assert len(capture_mail) == 0
        notification = {"subscriptionData": "foof" + req_json["subscriptionData"][4:]}
        r = authd_client.post("/api/download/notifications", json=notification)
        assert r.status_code == 400
        assert len(capture_mail) == 0


class TestAuthToken(BaseTest):
    """Test AUTH_TOKEN"""

    def test_args_without_token(self, app):
        """Given no AUTH_TOKEN, request should not have Authorization header"""
        del app.config["DOWNLOAD_API"]["AUTH_TOKEN"]
        service = DownloadAPIService(app)
        args = service._get_args()
        assert "Authorization" not in args["headers"]

    def test_args_with_token(self, app):
        """Given AUTH_TOKEN, request should have Authorization header"""
        service = DownloadAPIService(app)
        args = service._get_args()
        assert args["headers"].get("Authorization") == "Bearer testtoken"
