"""Qvain dataset write lock tests"""

import pytest

from .basetest import BaseTest
from etsin_finder.utils.flags import set_flags, get_flags
from etsin_finder.app import add_restful_resources


class BaseLockTest(BaseTest):
    """Base utilities for lock tests"""

    @pytest.fixture(autouse=True)
    def _lock_app(self, app, mocker):
        """Config common for all tests."""
        set_flags({"PERMISSIONS.WRITE_LOCK": True}, app)  # enable write lock by default
        mocker.patch(
            "etsin_finder.resources.qvain_resources.check_dataset_edit_permission"
        )

    @pytest.fixture
    def no_lock(self, mocker):
        """Lock is not set."""
        return mocker.patch(
            "pymemcache.client.base.Client.gets", return_value=(None, None)
        )

    success_lock_data = {"cr_id": "1337", "user_id": "teppo_testaaja"}
    unavailable_lock_data = {"cr_id": "1337", "user_id": "someone_else"}
    cas_token = "101"

    @pytest.fixture
    def existing_lock(self, mocker):
        """User has existing lock."""
        return mocker.patch(
            "pymemcache.client.base.Client.gets",
            return_value=(
                self.success_lock_data,
                self.cas_token,
            ),
        )

    @pytest.fixture
    def unavailable_lock(self, mocker):
        """Another user has lock."""
        return mocker.patch(
            "pymemcache.client.base.Client.gets",
            return_value=(
                self.unavailable_lock_data,
                self.cas_token,
            ),
        )

    @pytest.fixture
    def add_success(self, mocker):
        """Cache.add is successful."""
        return mocker.patch("pymemcache.client.base.Client.add", return_value=True)

    @pytest.fixture
    def cas_success(self, mocker):
        """Cache.cas is successful."""
        return mocker.patch("pymemcache.client.base.Client.cas", return_value=True)

    @pytest.fixture
    def cas_fail(self, mocker):
        """Cache.cas fails."""
        return mocker.patch("pymemcache.client.base.Client.cas", return_value=False)


class TestQvainLockRequest(BaseLockTest):
    """Tests for requesting locks."""

    def test_new_lock(self, authd_client, no_lock, add_success):
        """Request new lock."""
        r = authd_client.put("/api/qvain/datasets/1337/lock")
        assert r.json == self.success_lock_data
        assert r.status_code == 200

    def test_refresh_lock(self, authd_client, existing_lock, cas_success):
        """Refresh existing lock."""
        r = authd_client.put("/api/qvain/datasets/1337/lock")
        assert r.json == self.success_lock_data
        assert r.status_code == 200

    def test_refresh_fails(self, authd_client, existing_lock, cas_fail):
        """Refreshing existing lock fails."""
        r = authd_client.put("/api/qvain/datasets/1337/lock")
        assert r.json == self.success_lock_data
        assert r.status_code == 409

    def test_lock_unavailable(self, authd_client, unavailable_lock, add_success):
        """Another user has lock, refreshing should fail."""
        r = authd_client.put("/api/qvain/datasets/1337/lock")
        assert r.json == self.unavailable_lock_data
        assert r.status_code == 409

    def test_flag(self, app, authd_client):
        """Flag is disabled, request should fail."""
        set_flags({"PERMISSIONS.WRITE_LOCK": False}, app)
        r = authd_client.put("/api/qvain/datasets/1337/lock")
        assert r.status_code == 405


class TestQvainLockRelease(BaseLockTest):
    """Tests for releasing locks."""

    def test_release_lock(self, authd_client, existing_lock, cas_success):
        """Lock value should be set to None."""
        r = authd_client.delete("/api/qvain/datasets/1337/lock")
        cas_success.assert_called_once_with(
            "cr_lock_1337", None, self.cas_token, expire=60, noreply=False
        )
        assert r.status_code == 200

    def test_released_already(self, authd_client, no_lock, cas_success):
        """Lock is already released, lock should not be changed."""
        authd_client.delete("/api/qvain/datasets/1337/lock")
        cas_success.assert_not_called()

    def test_release_lock_unavailable(
        self, authd_client, unavailable_lock, cas_success
    ):
        """Someone else has lock, lock should not be changed."""
        r = authd_client.delete("/api/qvain/datasets/1337/lock")
        unavailable_lock.assert_called_once_with("cr_lock_1337")
        cas_success.assert_not_called()
        assert r.status_code == 200
