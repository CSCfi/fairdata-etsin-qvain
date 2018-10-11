# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from datetime import datetime
import json
import os

from dateutil import parser
import pytz


def executing_travis():
    """
    Returns True whenever code is being executed by travis
    """
    return True if os.getenv('TRAVIS', False) else False


def get_elasticsearch_config(config):
    if executing_travis():
        return None

    es_conf = config.get('ELASTICSEARCH', None)
    if not es_conf or not isinstance(es_conf, dict):
        return None

    return es_conf


def get_metax_api_config(config):
    if executing_travis():
        return None

    metax_api_conf = config.get('METAX_API')
    if not metax_api_conf or not isinstance(metax_api_conf, dict):
        return None

    return metax_api_conf


def get_rems_config(config):
    if executing_travis():
        return None

    rems_conf = config.get('REMS')
    if not rems_conf or not isinstance(rems_conf, dict):
        return None

    return rems_conf


def get_download_api_config(config):
    if executing_travis():
        return None

    dl_api_conf = config.get('DOWNLOAD_API')
    if not dl_api_conf or not isinstance(dl_api_conf, dict):
        return None

    return dl_api_conf


def get_memcached_config(config):
    if executing_travis():
        return None

    memcached_conf = config.get('MEMCACHED')
    if not memcached_conf or not isinstance(memcached_conf, dict):
        return None

    return memcached_conf


def write_json_to_file(json_data, filename):
    with open(filename, "w") as output_file:
        json.dump(json_data, output_file)


def write_string_to_file(string, filename):
    with open(filename, "w") as output_file:
        print(f"{string}", file=output_file)


def remove_keys_recursively(obj, fields_to_remove):
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
    except Exception as e:
        raise ValueError("Unable to parse timestamp: {0}".format(timestamp_str))


def tz_now_is_later_than_timestamp_str(timestamp_str):
    datetime_obj = _parse_timestamp_string_to_tz_aware_datetime(timestamp_str)
    return datetime.now(tz=pytz.timezone('Europe/Helsinki')) >= datetime_obj
