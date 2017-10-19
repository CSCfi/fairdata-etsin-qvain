import pytest


class BaseTest():

    @pytest.fixture
    def app(self):
        from etsin_finder.finder import app
        app.config.update(self._get_test_app_config())
        return app

    @pytest.fixture
    def client(self, app):
        client = app.test_client()
        return client

    def _get_test_app_config(self):
        return {
            'TESTING': True
        }

    if __name__ == '__main__':
        pytest.main()
