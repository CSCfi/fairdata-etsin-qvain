# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Basic app tests"""

from .basetest import BaseTest
from etsin_finder.utils.utils import datetime_to_header


class TestFinderUtils(BaseTest):
    """Basic tests for util functions in Etsin Finder"""

    def test_datetime_to_header(self):
        """Test datetime_to_header function"""
        test_int = 123
        test_randome_string = "asd675634asd"
        test4_datetime_wrong_format = "2020/01/27T07:21:35+02:00"
        test_ISO_8601 = "2020-01-27T07:21:35+02:00"

        assert datetime_to_header(test_int) is False
        assert datetime_to_header(test_randome_string) is False
        assert datetime_to_header(test4_datetime_wrong_format) == "Mon, 27 Jan 2020 05:21:35 GMT"
        assert datetime_to_header(test_ISO_8601) == "Mon, 27 Jan 2020 05:21:35 GMT"
