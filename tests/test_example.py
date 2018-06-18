# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from .basetest import BaseTest


class TestExample(BaseTest):

    def test_flask_application_is_up_and_running(self, client):
        r = client.get('/')
        assert r.status_code == 200
