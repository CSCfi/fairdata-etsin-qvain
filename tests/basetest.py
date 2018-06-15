# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

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
