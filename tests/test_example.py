from .basetest import BaseTest


class TestExample(BaseTest):

    def test_flask_application_is_up_and_running(self, client):
        r = client.get('/')
        assert r.status_code == 200
