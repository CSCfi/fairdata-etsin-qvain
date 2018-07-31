# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

import json

import requests
from requests import HTTPError

from etsin_finder.cr_service import get_catalog_record_preferred_identifier
from etsin_finder.finder import app
from etsin_finder.utils import get_rems_config

log = app.logger


class RemsAPIService:

    def __init__(self):
        rems_config = get_rems_config(app.config)
        if rems_config:
            self.REMS_URL = 'REMS_URL'

    def get_rems_permission(self, user_id, rems_catalog_id):
        return False


def get_user_rems_permission_for_catalog_record(catalog_record, user_eppn, is_authd):
    if not is_authd or not user_eppn or not catalog_record:
        return False

    pref_id = get_catalog_record_preferred_identifier(catalog_record)
    if not pref_id:
        return False

    rems_service = RemsAPIService()
    return rems_service.get_rems_permission(user_eppn, pref_id)
