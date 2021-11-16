"""Tests for utils.py."""
from datetime import datetime, timedelta
import pytest
import json
import pytz
from flask import current_app
from .utils_test import UtilsTestSuite
from .utils_test_data import expected_log_config
from etsin_finder.utils.utils import (
    FlaskService,
    datetime_to_header,
    ensure_app,
    executing_cicd,
    format_url,
    get_log_config,
    json_or_empty,
    json_or_text,
    leave_keys_in_dict,
    remove_keys_recursively,
    sort_array_of_obj_by_key,
    tz_now_is_later_than_timestamp_str,
)

from .frontend_test_data import original_complete_dataset


class TestUtils(UtilsTestSuite):
    """Tests from Utils."""

    def test_get_log_config_no_log_file_path(self):
        """Return False when log_file_path is None."""
        result = get_log_config(None, 5)
        assert result is False

    def test_get_log_config_no_log_lvl(self, log_file_path):
        """Return False when log_lvl is 0."""
        result = get_log_config(log_file_path, 0)
        assert result is False

    def test_get_log_config(self, log_file_path, log_lvl):
        """Return log config when log_file_path and log_lvl."""
        result = get_log_config(log_file_path, log_lvl)
        assert result == expected_log_config

    def test_executing_cicd_not_cicd(self, env_TEST):
        """Return False when env is not CICD."""
        assert executing_cicd() is False

    def test_executing_cicd_is_cicd(self, env_CICD):
        """Return False when env is not CICD."""
        assert executing_cicd() is True

    def test_json_or_empty_invalid_response(self):
        """Return empty dict when response is invalid."""
        assert json_or_empty({}) == {}

    def test_json_or_empty_empty_response(self, empty_json_response):
        """Return empty dict when response is empty."""
        result = json_or_empty(empty_json_response)
        assert result == {}

    def test_json_or_empty_full_response(self, full_json_response):
        """Return dict when response is full.

        Write json file first, so that it can be used as test material.
        """
        result = json_or_empty(full_json_response)
        assert result == original_complete_dataset

    def test_json_or_text_empty_response(self, empty_json_response):
        """Return requests.Response.text when response is empty."""
        result = json_or_text(empty_json_response)
        assert result == {}

    def test_json_or_text_invalid_response(self, invalid_json_response):
        """Return Response.text when response has no json()."""
        result = json_or_text(invalid_json_response)
        assert result == "text"

    def test_json_or_text_full_response(self, full_json_response):
        """Return dict when response is full.

        Write json file first, so that it can be used as test material.
        """
        result = json_or_text(full_json_response)
        assert result == original_complete_dataset

    def test_remove_keys_recursively(self):
        """Return obj without specific key."""
        obj = {
            "data": {
                "subdata": "subdata",
                "preservable": {"subdata": "subdata"},
                "sublist": ["subdata", {"subdata": "subdata"}, "preservable"],
            },
            "list": ["subdata", "preservable"],
        }

        expected_result = {
            "data": {
                "preservable": {},
                "sublist": [{}, "preservable"],
            },
            "list": ["preservable"],
        }

        result = remove_keys_recursively(obj, ["subdata"])

        assert result == expected_result

    def test_leave_keys_in_dict(self):
        """Return obj only with specific key."""
        obj = {
            "data": {
                "subdata": "subdata",
                "preservable": {"subdata": "subdata"},
                "sublist": ["subdata", {"subdata": "subdata"}, "preservable"],
            },
            "list": ["subdata", "preservable"],
        }

        expected_result = {
            "data": {
                "subdata": "subdata",
                "preservable": {"subdata": "subdata"},
                "sublist": ["subdata", {"subdata": "subdata"}, "preservable"],
            },
        }

        leave_keys_in_dict(obj, ["data"])

        assert obj == expected_result

    def test_tz_now_is_later_than_timestamp_str_invalid_time(self):
        """Throw error when invalid timestamp (non-string)."""
        with pytest.raises(ValueError, match="Timestamp must be a string"):
            tz_now_is_later_than_timestamp_str(1234)

    def test_tz_now_is_later_than_timestamp_str_invalid_time_str(self):
        """Throw error when invalid timestamp (string)."""
        with pytest.raises(ValueError, match="Unable to parse timestamp"):
            tz_now_is_later_than_timestamp_str("not a timestamp")

    def test_tz_now_is_later_than_timestamp_str_future(self, future_timestamp):
        """Return False when timestamp is from the future."""
        assert tz_now_is_later_than_timestamp_str(future_timestamp) is False

    def test_tz_now_is_later_than_timestamp_str_past(self, past_timestamp):
        """Return True when timestamp is from the past."""
        assert tz_now_is_later_than_timestamp_str(past_timestamp) is True

    def test_datetime_to_header(self, timestamp_iso_format):
        """Return HTTP datetime of 1.1.1970."""
        assert (
            datetime_to_header(timestamp_iso_format) == "Thu, 01 Jan 1970 00:00:00 GMT"
        )

    def test_datetime_to_header_invalid_date(self):
        """Return False when invalid date is given."""
        assert datetime_to_header(1234) is False

    def test_sort_array_of_obj_by_key(self):
        """Sort a given list based on a given key."""
        unsorted_list = [{"key": "c"}, {"key": "b"}, {"key": "a"}]
        expected_list = [{"key": "a"}, {"key": "b"}, {"key": "c"}]
        sort_array_of_obj_by_key(unsorted_list, "key")
        assert unsorted_list == expected_list

    def test_sort_array_of_obj_by_key_invalid_obj_array(self):
        """Fail silently."""
        try:
            invalid_list = "this is not a list."
            sort_array_of_obj_by_key(invalid_list, "key")
        except Exception:
            pytest.fail()

    def test_format_url(self):
        """Return formatted string."""
        url = "https://doi.com/{0}"
        arg = "äidin tytöt"
        formatted_url = format_url(url, arg)
        assert formatted_url == "https://doi.com/%C3%A4idin%20tyt%C3%B6t"

    def test_ensure_app(self, app):
        """Return app when there's one."""
        assert ensure_app(app) == app

    def test_ensure_app_no_app(self, app):
        """Return current_app when argument is None."""
        with app.app_context():
            assert ensure_app(None) == current_app

    def test_ensure_app_no_app_or_context(self, app):
        """Raise error when argument is None and no app context."""
        with pytest.raises(
            ValueError, match="Missing app parameter and no app context available"
        ):
            ensure_app(None)

    def test_FlaskService_non_testing(self, mock_app, env_TEST):
        """Set is_testing to False."""
        flask_service = FlaskService(mock_app)
        assert flask_service.is_testing is False
