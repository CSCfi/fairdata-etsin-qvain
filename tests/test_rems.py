"""Test suite for rems related elements."""
import pytest
import requests
from requests_mock import ANY
from requests.models import HTTPError
from etsin_finder.auth.authorization import user_has_dataset_project
from etsin_finder.services.rems_service import RemsAPIService
from .basetest import BaseTest


class TestRems(BaseTest):
    """Test class for rems related tests."""

    @pytest.fixture
    def rems_service(self, app):
        """Return default rems service."""
        user_id = "test_user_123"
        return RemsAPIService(app, user_id)

    def test_rems_service_init_test(self, app):
        """Return Rems API service."""
        user_id = "test_user_123"
        rems_service = RemsAPIService(app, user_id)
        assert rems_service.ENABLED is True
        assert rems_service.USER_ID == user_id
        assert rems_service.API_KEY == "1234"
        assert rems_service.HOST == "fake host"
        assert rems_service.HEADERS == {
            "Accept": "application/json",
            "x-rems-api-key": "1234",
            "x-rems-user-id": "RDowner@funet.fi",
        }
        assert (
            rems_service.REMS_URL == "https://fake host/api/entitlements?resource={0}"
        )
        assert rems_service.REMS_ENTITLEMENTS == "https://fake host/api/entitlements"
        assert rems_service.REMS_CREATE_USER == "https://fake host/api/users/create"
        assert (
            rems_service.REMS_GET_MY_APPLICATIONS
            == "https://fake host/api/my-applications/"
        )
        assert (
            rems_service.REMS_CATALOGUE_ITEMS
            == "https://fake host/api/catalogue-items?resource={0}"
        )
        assert (
            rems_service.REMS_CREATE_APPLICATION
            == "https://fake host/api/applications/create"
        )
        assert rems_service.proxies == {"https": "proxy"}

    def test_rems_request_json(self, app, requests_mock, rems_service):
        """Return response as json when json is True."""
        method = "GET"
        url = "https://localhost"
        requests_mock.register_uri(method, url, json='{"Success": True}')

        with app.app_context():
            response = rems_service.rems_request(method, url, "", json=True)
            assert response == '{"Success": True}'

    def test_rems_request(self, app, requests_mock, rems_service):
        """Return response."""
        method = "GET"
        url = "https://localhost"
        requests_mock.register_uri(method, url, text='{"Success": "True"}')

        with app.app_context():
            response = rems_service.rems_request(method, url, "")
            assert response == {"Success": "True"}

    def test_rems_request_Http_error(self, app, mocker, rems_service):
        """Log warning when http error."""
        mocker.patch("requests.request")
        requests.request.side_effect = HTTPError()

        with app.app_context():
            rems_service.rems_request("GET", "localhost", "test error")
            requests.request.called_once()

    def test_get_user_applications(self, app, rems_service, requests_mock):
        """Return response."""
        requests_mock.get(ANY, json='{"Success": True}')

        with app.app_context():
            response = rems_service.get_user_applications()
            assert response == '{"Success": True}'

    def test_create_applications(self, app, rems_service, requests_mock):
        """Return response."""
        requests_mock.post(ANY, json='{"Success": True}')

        with app.app_context():
            response = rems_service.create_application(1234)
            assert response == '{"Success": True}'
