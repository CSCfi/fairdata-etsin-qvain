# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Utilities for tests"""

import json
import os

from etsin_finder.utils.constants import ACCESS_TYPES

dir_path = os.path.dirname(os.path.realpath(__file__))


def get_test_catalog_record(access_type, embargo_passed=None):
    """
    Get test catalog record from file

    :param access_type:
    :return:
    """
    if access_type not in ACCESS_TYPES.keys():
        return None

    with open(dir_path + '/test_data.json') as f:
        cr_json = json.load(f)

    cr_json['research_dataset']['access_rights']['access_type']['identifier'] = ACCESS_TYPES[access_type]

    if access_type == 'embargo' and embargo_passed is not None:
        cr_json['research_dataset']['access_rights']['available'] = '2018-01-01' if embargo_passed else '2100-01-01'
    return cr_json
