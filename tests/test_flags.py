# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Test feature flags"""

import json
import pytest
import requests

from etsin_finder.utils.flags import set_flags, set_supported_flags, validate_flags, flag_enabled
from .basetest import BaseTest

supported_flags = {
    'SUPPORTED_FLAG',
    'SUPPORTED_FLAG_TRUE',
    'SUPPORTED_FLAG_FALSE',
    'SUPPORTED_GROUP',
    'SUPPORTED_GROUP.FLAG1',
    'SUPPORTED_GROUP.FLAG2',
    'ANOTHER_GROUP.FLAG1',
}

class TestFlags(BaseTest):
    """Test feature flags"""

    @pytest.fixture
    def flags_app(self, app):
        """Helper fixture that overrides default supported flags"""
        set_supported_flags(app, supported_flags)
        return app

    def test_unsupported_flag_set_warning(self, flags_app, expect_log):
        """Setting an unsupported flag should log a warning"""
        set_flags({
            'SUPPORTED_FLAG': True,
            'UNSUPPORTED_FLAG': True,
            'ANOTHER_GROUP': True,
        }, flags_app)
        validate_flags(flags_app)
        expect_log(warnings=['UNSUPPORTED_FLAG'])

    def test_flag_enabled(self, flags_app, expect_log):
        """Test enabling flag"""
        set_flags({
            'SUPPORTED_FLAG_TRUE': True,
            'UNSUPPORTED_FLAG_FALSE': False,
        }, flags_app)
        assert flag_enabled('SUPPORTED_FLAG_TRUE', flags_app) is True
        assert flag_enabled('SUPPORTED_FLAG_FALSE', flags_app) is False
        expect_log()

    def test_flag_enabled_default_false(self, flags_app, expect_log):
        """Test that flags are disabled by default"""
        set_flags({
            'SUPPORTED_FLAG_TRUE': True,
            'UNSUPPORTED_FLAG_FALSE': False,
        }, flags_app)
        assert flag_enabled('SUPPORTED_FLAG', flags_app) is False
        expect_log()

    def test_flag_enabled_group(self, flags_app, expect_log):
        """Test that flags in enabled group are enabled unless they are explicitly False"""
        set_flags({
            'SUPPORTED_GROUP': True,
            'SUPPORTED_GROUP.FLAG2': False,
        }, flags_app)
        assert flag_enabled('SUPPORTED_GROUP', flags_app) is True
        assert flag_enabled('SUPPORTED_GROUP.FLAG1', flags_app) is True
        assert flag_enabled('SUPPORTED_GROUP.FLAG2', flags_app) is False
        expect_log()

    def test_flag_disabled_group(self, flags_app, expect_log):
        """Test that flags in disabled group are disabled unless they are explicitly True"""
        set_flags({
            'SUPPORTED_GROUP': False,
            'SUPPORTED_GROUP.FLAG2': True,
        }, flags_app)
        assert flag_enabled('SUPPORTED_GROUP.FLAG1', flags_app) is False
        assert flag_enabled('SUPPORTED_GROUP.FLAG2', flags_app) is True
        expect_log()

    def test_flag_enabled_unsupported(self, flags_app, expect_log):
        """Test that flag_enabled for unsupported flag logs warning"""
        set_flags({
            'SUPPORTED_GROUP': True,
            'SUPPORTED_GROUP.FLAG2': False,
        }, flags_app)
        assert flag_enabled('SUPPORTED_GROUP.UNSUPPORTED_FLAG', flags_app) is True
        expect_log(warnings=['SUPPORTED_GROUP.UNSUPPORTED_FLAG'])

    def test_flag_enabled_unsupported_group(self, flags_app, expect_log):
        """Test that flag_enabled for group not explicitly in supported flags gives warning"""
        set_flags({
            'ANOTHER_GROUP': True
        }, flags_app)
        assert flag_enabled('ANOTHER_GROUP', flags_app) is True
        expect_log(warnings=['ANOTHER_GROUP'])
