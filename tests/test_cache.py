"""Test suite for cache.py."""
import pytest
from .basetest import BaseTest
from etsin_finder.cache import BaseCache, CatalogRecordCache, RemsCache
from pymemcache.client import base


class TestCache(BaseTest):
    """Tests for cache.py."""

    @pytest.fixture
    def base_cache(self, app):
        """Init base cache."""
        base_cache = BaseCache(app)
        base_cache.is_testing = False
        return base_cache

    @pytest.fixture
    def catalog_record_cache(self, app):
        """Init catalog record cache."""
        cr_cache = CatalogRecordCache(app)
        cr_cache.is_testing = False
        return cr_cache

    @pytest.fixture
    def rems_cache(self, app):
        """Init rems cache."""
        rems_cache = RemsCache(app)
        rems_cache.is_testing = False
        return rems_cache

    @pytest.fixture
    def mock_cache_set_error(self):
        """Mock cache.set to throw an error."""
        pass

        def raise_():
            raise Exception("set error.")

        base.Client.set = lambda a, b, c, expire, noreply: raise_()

    @pytest.fixture
    def mock_cache_set(self, mocker):
        """Mock cache.set function."""
        mocker.patch("pymemcache.client.base.Client.set")

    @pytest.fixture
    def mock_cache_get(self, mocker):
        """Mock cache.get function."""
        mocker.patch("pymemcache.client.base.Client.get")

    @pytest.fixture
    def mock_cache_add(self, mocker):
        """Mock cache.get function."""
        mocker.patch("pymemcache.client.base.Client.add", return_value=True)

    @pytest.fixture
    def mock_cache_gets(self, mocker):
        """Mock cache.gets function."""
        mocker.patch(
            "pymemcache.client.base.Client.gets", return_value=("data", "token")
        )

    @pytest.fixture
    def mock_cache_gets_fail(self, mocker):
        """Mock cache.gets function."""
        mocker.patch("pymemcache.client.base.Client.gets", return_value=(None, None))

    @pytest.fixture
    def mock_cache_get_error(self):
        """Mock cache.get to throw an error."""
        pass

        def raise_():
            raise Exception("set error.")

        base.Client.get = lambda a, b: raise_()

    @pytest.fixture
    def mock_cache_delete(self, mocker):
        """Mock cache.delete function."""
        mocker.patch("pymemcache.client.base.Client.delete")

    @pytest.fixture
    def mock_cache_delete_error(self):
        """Mock cache.delete to throw an error."""
        pass

        def raise_():
            raise Exception("set error.")

        base.Client.delete = lambda a, b: raise_()

    def test_base_cache_init(self, base_cache):
        """Create a cache on init."""
        assert isinstance(base_cache.cache, base.Client)

    def test_do_update(self, base_cache, mock_cache_set):
        """Call cache.set."""
        base_cache.do_update("key", "value", 60)
        base_cache.cache.set.assert_called_once_with(
            "key", "value", expire=60, noreply=None
        )

    def test_do_update_fail(self, app, base_cache, mock_cache_set_error, expect_log):
        """Call cache.set and catch warnings."""
        base_cache.do_update("key", "value", 60)
        expect_log(warnings=["Insert to cache failed", "set error."])

    def test_do_get(self, base_cache, mock_cache_get):
        """Call cache.get."""
        base_cache.do_get("key")
        base_cache.cache.get.assert_called_once_with("key", None)

    def test_do_gets(self, base_cache, mock_cache_gets):
        """Call cache.gets."""
        (data, token) = base_cache.do_gets("key")
        assert (data, token) == ("data", "token")
        base_cache.cache.gets.assert_called_once_with("key")

    def test_do_delete(self, base_cache, mock_cache_delete):
        """Call cache.delete."""
        base_cache.do_delete("key")
        base_cache.cache.delete.assert_called_once_with("key", noreply=None)

    def test_do_delete_fail(self, app, base_cache, mock_cache_delete_error):
        """Call cache.delete and fail."""
        result = base_cache.do_delete("key")
        assert result is False

    def test_cr_cache_init(self, catalog_record_cache):
        """Create a cache on init with default values."""
        assert isinstance(catalog_record_cache.cache, base.Client)
        assert catalog_record_cache.CACHE_ITEM_TTL == 1200
        assert catalog_record_cache.CACHE_KEY_PREFIX == "cr_"

    def test_cr_update(self, catalog_record_cache, mock_cache_set):
        """Call cache.set."""
        cr_id = "id"
        data = "value"

        catalog_record_cache.update(cr_id, data)
        catalog_record_cache.cache.set.assert_called_once_with(
            "cr_id", "value", expire=1200, noreply=None
        )

    def test_cr_update_cr_id_missing(self, catalog_record_cache):
        """Call cache.set."""
        cr_id = None
        data = "value"

        result = catalog_record_cache.update(cr_id, data)
        assert result == data

    def test_cr_get(self, catalog_record_cache, mock_cache_get):
        """Call cache.get."""
        cr_id = "id"

        catalog_record_cache.get(cr_id)
        catalog_record_cache.cache.get.assert_called_once_with("cr_id", None)

    def test_cr_delete(self, catalog_record_cache, mock_cache_delete):
        """Call cache.delete."""
        cr_id = "id"

        catalog_record_cache.delete(cr_id)
        catalog_record_cache.cache.delete.assert_called_once_with("cr_id", noreply=None)

    def test_cr_add_to_cache(self, catalog_record_cache, mock_cache_add):
        """Call cache.add."""
        cr_id = "id"

        catalog_record_cache.add(cr_id, "data")
        catalog_record_cache.cache.add.assert_called_once_with(
            "cr_id", "data", expire=1200, noreply=None
        )

    def test_cr_gets(self, catalog_record_cache, mock_cache_gets):
        """Call cache.add."""
        cr_id = "id"

        data, token = catalog_record_cache.gets(cr_id)
        assert (data, token) == ("data", "token")
        catalog_record_cache.cache.gets.assert_called_once_with("cr_id")

    def test_cr_gets_fail(self, catalog_record_cache, mock_cache_gets_fail):
        """Call cache.add."""
        cr_id = "id"

        data, token = catalog_record_cache.gets(cr_id)
        assert (data, token) == (None, None)
        catalog_record_cache.cache.gets.assert_called_once_with("cr_id")

    def test_rems_update(self, rems_cache, mock_cache_set):
        """Call cache.set."""
        cr_id = "cr_"
        user_id = "id"
        permission = True

        rems_cache.update(cr_id, user_id, permission)
        rems_cache.cache.set.assert_called_once_with(
            "cr_id", True, expire=300, noreply=None
        )

    def test_rems_update_cr_id_missing(self, rems_cache, mock_cache_set):
        """Call cache.set."""
        cr_id = None
        user_id = "id"
        permission = True

        result = rems_cache.update(cr_id, user_id, permission)
        assert result is True

    def test_rems_get(self, rems_cache, mock_cache_get):
        """Call cache.get."""
        cr_id = "cr_"
        user_id = "id"

        rems_cache.get(cr_id, user_id)
        rems_cache.cache.get.assert_called_once_with("cr_id", None)
