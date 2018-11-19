# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Various utils"""

import json
import os
from datetime import datetime

import pytz
from dateutil import parser


def executing_travis():
    """Returns True whenever code is being executed by travis"""
    return True if os.getenv('TRAVIS', False) else False


def write_json_to_file(json_data, filename):
    """
    Write JSON data to file.

    :param json_data:
    :param filename:
    """
    with open(filename, "w") as output_file:
        json.dump(json_data, output_file)


def json_or_empty(response):
    """
    Return response JSON as python dict or empty dict.

    :param response:
    :return:
    """
    response_json = {}
    try:
        response_json = response.json()
    except Exception:
        pass
    return response_json


def remove_keys_recursively(obj, fields_to_remove):
    """
    Remove specified keys recursively from a python object (dict or list)

    :param obj:
    :param fields_to_remove:
    :return:
    """
    if isinstance(obj, dict):
        obj = {
            key: remove_keys_recursively(value, fields_to_remove) for key, value in obj.items()
            if key not in fields_to_remove
        }
    elif isinstance(obj, list):
        obj = [remove_keys_recursively(item, fields_to_remove) for item in obj if item not in fields_to_remove]

    return obj


def leave_keys_in_dict(dict_obj, fields_to_leave):
    """
    Removes the key-values from dict_obj, for which key is NOT listed in fields_to_leave.

    NOTE: Is not recursive

    :param dict_obj:
    :param fields_to_leave:
    :return:
    """
    for key in list(dict_obj):
        if key not in fields_to_leave:
            del dict_obj[key]


def _parse_timestamp_string_to_tz_aware_datetime(timestamp_str):
    if not isinstance(timestamp_str, str):
        raise ValueError("Timestamp must be a string")

    try:
        dt = parser.parse(timestamp_str)
        if dt.tzinfo is None or dt.tzinfo.utcoffset(dt) is None:
            dt = pytz.timezone('Europe/Helsinki').localize(dt)
        return dt
    except Exception:
        raise ValueError("Unable to parse timestamp: {0}".format(timestamp_str))


def tz_now_is_later_than_timestamp_str(timestamp_str):
    """
    Is timestamp_str later in time than current time.

    :param timestamp_str:
    :return:
    """
    datetime_obj = _parse_timestamp_string_to_tz_aware_datetime(timestamp_str)
    return datetime.now(tz=pytz.timezone('Europe/Helsinki')) >= datetime_obj
