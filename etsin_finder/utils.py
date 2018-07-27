# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

import datetime
import json
import os

from dateutil import parser


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


def write_json_to_file(json_data, filename):
    with open(filename, "w") as output_file:
        json.dump(json_data, output_file)


def write_string_to_file(string, filename):
    with open(filename, "w") as output_file:
        print(f"{string}", file=output_file)


def remove_keys(obj, rubbish):
    if isinstance(obj, dict):
        obj = {
            key: remove_keys(value, rubbish) for key, value in obj.items() if key not in rubbish
        }
    elif isinstance(obj, list):
        obj = [
            remove_keys(item, rubbish) for item in obj if item not in rubbish
        ]
    return obj


def _parse_datetime_str_to_datetime_obj(str):
    try:
        return parser.parse(str)
    except Exception:
        pass
    return None


def now_is_later_than_datetime_str(datetime_str):
    datetime_obj = _parse_datetime_str_to_datetime_obj(datetime_str)
    if type(datetime_obj) != datetime.datetime:
        raise Exception
    return datetime.datetime.now() >= datetime