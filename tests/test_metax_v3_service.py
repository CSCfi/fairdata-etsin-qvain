"""Test suite for Metax V3 service."""

from .basetest import BaseTest, make_sso_user_cookie
from werkzeug.http import dump_cookie, parse_cookie
from etsin_finder.services.metax_v3_service import MetaxV3APIService

dataset_id = "10000000-2000-3000-4000-500000000001"


class TestMetaxV3Service(BaseTest):
    def get_request_headers(self):
        sso_cookie = make_sso_user_cookie({"id": "teppo"})
        csrf_cookie = dump_cookie("metax_csrftoken", "csrfsecret", path=None)
        cookies = "; ".join([sso_cookie, csrf_cookie])
        referer = f"https://etsin-test/dataset/{dataset_id}"
        return {
            "COOKIE": cookies,
            "X-CSRFToken": "csrfsecret",
            "Referer": referer,
        }

    def test_headers(self, app, requests_mock):
        """Test that Metax V3 requests are sent with correct headers forwarded."""
        mock = requests_mock.get(
            f"https://fake-metax-v3:443/v3/datasets/{dataset_id}",
            json={"title": {"en": "Cool dataset"}},
        )
        headers = self.get_request_headers()
        with app.test_request_context(headers=headers):
            service = MetaxV3APIService()
            dataset = service.get_dataset(dataset_id)
            assert dataset["title"] == {"en": "Cool dataset"}

        # Check request was made with correct headers
        assert mock.call_count == 1
        request = mock.request_history[0]
        assert request.headers["Referer"] == headers["Referer"]
        assert request.headers["X-CSRFToken"] == headers["X-CSRFToken"]

        # Check cookie was passed correctly
        metax_cookie = dict(parse_cookie(request.headers["Cookie"]))
        assert metax_cookie == dict(parse_cookie(headers["COOKIE"]))

    def test_headers_no_auth(self, app, requests_mock):
        """Test that Metax V3 request works without auth headers."""
        mock = requests_mock.get(
            f"https://fake-metax-v3:443/v3/datasets/{dataset_id}",
            json={"title": {"en": "Cool dataset"}},
        )
        with app.test_request_context():
            service = MetaxV3APIService()
            dataset = service.get_dataset(dataset_id)
            assert dataset["title"] == {"en": "Cool dataset"}

        # Check request was made with correct headers
        assert mock.call_count == 1
        request = mock.request_history[0]
        assert request.headers.get("Referer") is None
        assert request.headers.get("X-CSRFToken") is None
        assert request.headers.get("Cookie") is None
