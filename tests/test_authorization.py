# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Test authorization methods"""

from .basetest import BaseTest
import json

from etsin_finder.auth import authorization
from etsin_finder.utils.constants import ACCESS_DENIED_REASON


class TestDownloadDeniedReason(BaseTest):
    """Test user_is_allowed_to_download_from_ida denial reason"""

    def test_open_dataset(self, unauthd_client, open_catalog_record):
        """Test open dataset"""
        r = unauthd_client.get('/api/dataset/123')
        cr = json.loads(r.get_data()).get('catalog_record')
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is True
        assert reason is None

    def test_login_dataset(self, unauthd_client, login_catalog_record):
        """Test login dataset"""
        r = unauthd_client.get('/api/dataset/123')
        cr = json.loads(r.get_data()).get('catalog_record')
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is False
        assert reason is ACCESS_DENIED_REASON['NEED_LOGIN']

    def test_embargo_dataset(self, unauthd_client, embargo_not_passed_catalog_record):
        """Test embargoed dataset"""
        r = unauthd_client.get('/api/dataset/123')
        cr = json.loads(r.get_data()).get('catalog_record')
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is False
        assert reason is ACCESS_DENIED_REASON['EMBARGO']

    def test_permit_dataset(self, unauthd_client, permit_catalog_record, no_rems_permit):
        """Test permit dataset"""
        r = unauthd_client.get('/api/dataset/123')
        cr = json.loads(r.get_data()).get('catalog_record')
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is False
        assert reason is ACCESS_DENIED_REASON['NEED_REMS_PERMISSION']

    def test_restricted_dataset(self, unauthd_client, restricted_catalog_record):
        """Test restricted dataset"""
        r = unauthd_client.get('/api/dataset/123')
        cr = json.loads(r.get_data()).get('catalog_record')
        allow, reason = authorization.user_is_allowed_to_download_from_ida(cr, False)
        assert allow is False
        assert reason is ACCESS_DENIED_REASON['RESTRICTED']
