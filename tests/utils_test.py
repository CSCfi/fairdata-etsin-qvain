"""Test suite for utils/utils.py tests."""

from flask.helpers import make_response
from flask.json import jsonify
import pytest
from datetime import datetime, timedelta
import pytz
from .basetest import BaseTest

from .frontend_test_data import original_complete_dataset


class MockResponse:
    """Mock version of requests.Response."""

    def __init__(self, data):
        """Init MockResponse."""
        self.data = data

    def json(self):
        """Return data that is given on creation."""
        return self.data


class InvalidMockResponse:
    """Mock version without json()."""

    @property
    def text(self):
        """Return trivial string."""
        return "text"


class MockApp:
    """Mock app for testin FlaskService class."""

    @property
    def testing(self):
        """Return False."""
        return False


class UtilsTestSuite(BaseTest):
    """Test suite for Utils."""

    @pytest.fixture
    def log_file_path(self):
        """Return default log_file_path."""
        return "log_file_path/file.log"

    @pytest.fixture
    def log_lvl(self):
        """Return default log_lvl."""
        return 3

    @pytest.fixture
    def env_TEST(self, monkeypatch):
        """Set getenv to TEST."""
        import os

        def getenv(isEnv, defaultReturn):
            return True if isEnv == "TEST" else defaultReturn

        monkeypatch.setattr(os, "getenv", getenv)

    @pytest.fixture
    def env_CICD(self, monkeypatch):
        """Set getenv to CICD"""
        import os

        def getenv(isEnv, defaultReturn):
            return True if isEnv == "CICD" else defaultReturn

        monkeypatch.setattr(os, "getenv", getenv)

    @pytest.fixture
    def empty_json_response(self):
        """Return mock version of empty requests.Response."""
        return MockResponse({})

    @pytest.fixture
    def invalid_json_response(self):
        """Return mock version of empty requests.Response without json() method."""
        return InvalidMockResponse()

    @pytest.fixture
    def full_json_response(self, app):
        """Return mock version of full requests.Response."""
        return MockResponse(original_complete_dataset)

    @pytest.fixture
    def future_timestamp(self):
        """Return future timestamp."""
        future_time = datetime.now(tz=pytz.timezone("Europe/Helsinki")) + timedelta(
            1000
        )
        return future_time.strftime("%Y%m%d")

    @pytest.fixture
    def past_timestamp(self):
        """Return past timestamp."""
        past_time = datetime.now(tz=pytz.timezone("Europe/Helsinki")) + timedelta(-1000)
        return past_time.strftime("%Y%m%d")

    @pytest.fixture
    def timestamp_iso_format(self):
        """Return ISO 8601 timestamp."""
        time = datetime.fromtimestamp(0)
        return time.isoformat()

    @pytest.fixture
    def mock_app(self):
        """Return mock app for FalskService."""
        return MockApp()
