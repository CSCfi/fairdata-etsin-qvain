# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Basic app tests"""

from .basetest import BaseTest


class TestBasic(BaseTest):
    """Basic app tests"""

    def test_flask_application_responds(self, authd_client):
        """
        Test root endpoint responds

        :param authd_client:
        :return:
        """
        r = authd_client.get('/')
        assert r.status_code == 200
