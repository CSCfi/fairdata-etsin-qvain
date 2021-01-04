# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Various utils"""

from flask import current_app, has_app_context
import json
import os
from datetime import datetime
import pytz
from dateutil import parser
from urllib import parse

def get_log_config(log_file_path, log_lvl):
    """Function to get the logging configuration from utils.py

    Arguments:
        log_file_path (str): The log file path.
        log_lvl (str): The logging level

    Returns:
        dict: Dict containgin the logging configuration.

    """
    if (log_file_path and log_lvl):
        CONFIG = {
            'version': 1,
            'formatters': {
                'standard': {
                    'format': '--------------\n[%(asctime)s] [%(process)d] %(levelname)s in %(filename)s:%(lineno)d: %(message)s',
                    'datefmt': '%Y-%m-%d %H:%M:%S %z',
                }
            },
            'handlers': {
                'file': {
                    'class': 'logging.handlers.RotatingFileHandler',
                    'formatter': 'standard',
                    'filename': log_file_path,
                    'maxBytes': 10000000,
                    'mode': 'a',
                    'backupCount': 30
                },
                'console': {
                    'class': 'logging.StreamHandler',
                    'formatter': 'standard',
                    'stream': 'ext://sys.stdout'
                }
            },
            'root': {
                'level': log_lvl,
                'handlers': ['file', 'console']
            }
        }
        return CONFIG
    return False

def executing_travis():
    """Returns True whenever code is being executed by travis"""
    return True if os.getenv('TRAVIS', False) else False


def write_json_to_file(json_data, filename):
    """Write JSON data to file.

    Args:
        json_data (json): JSON data.
        filename (str): Filename to write the data to.

    """
    with open(filename, "w") as output_file:
        json.dump(json_data, output_file)


def json_or_empty(response):
    """Return response JSON as python dict or empty dict.

    Args:
        response (object): flask.Response object

    Returns:
        dict: The json as dict.

    """
    response_json = {}
    try:
        response_json = response.json()
    except Exception:
        pass
    return response_json


def json_or_text(response):
    """
    Return response JSON as python object, or text if no JSON is present.

    :param response:
    :return:
    """
    response_json = {}
    try:
        response_json = response.json()
    except Exception:
        return response.text
    return response_json


def remove_keys_recursively(obj, fields_to_remove):
    """Remove specified keys recursively from a python object (dict or list)

    Args:
        obj (dict/list): from where keys need to be removed.
        fields_to_remove (list): fields to remove

    Returns:
        dict/list: Cleaned object

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
    """Removes the key-values from dict_obj, for which key is NOT listed in fields_to_leave.

    NOTE: Is not recursive

    Args:
        dict_obj (dict): Dict from where key-values should be removed.
        fields_to_leave (list): The fields to leave.

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
    """Is timestamp_str later in time than current time.

    Args:
        timestamp_str (str): Time stamp.

    Returns:
        bool: True if yes, False if no

    """
    datetime_obj = _parse_timestamp_string_to_tz_aware_datetime(timestamp_str)
    return datetime.now(tz=pytz.timezone('Europe/Helsinki')) >= datetime_obj

def datetime_to_header(datetime_str):
    """Modifie ISO 8601 datetime format to HTTP datetime (RFC2616).

    The function does also work with some other formats and without
    tz, but it is not recommended.

    Arguments:
        datetime_str (str): Datetime string represented in the ISO 8601 format (ex. 2020-01-23T14:12:44+00:00)
    Returns:
        str: Datetime string in HTTP datetime format (ex. Wed, 21 Oct 2015 07:28:00 GMT)

    """
    try:
        assert isinstance(datetime_str, str), 'datetime_str must be of type string.'
        datetime_obj_local = parser.parse(datetime_str)
        datetime_obj_GMT = datetime_obj_local.astimezone(pytz.utc)
        HTTP_datetime = datetime_obj_GMT.strftime('%a, %d %b %Y %H:%M:%S GMT')
        return HTTP_datetime
    except Exception:
        return False

def sort_array_of_obj_by_key(obj_array, obj_key, obj_nested_key=False):
    """Sort array of objects

    Sort the objects in an array by using the value of an object key,
    or if needed, the value of a nested object key contained inside an
    object pointed to by an object key


    Args:
        obj_array (list): Object array to be sorted
        obj_key (str): Object key based on which to sort the object array, or a pointer key to a nested object where the sorting key is located
        obj_nested_key (bool, optional): Object key based on which to sort the object array, if it is contained below the main level of the sortable object. Defaults to False.

    """
    try:
        if obj_array and obj_key:
            obj_array.sort(key=lambda x: x.get(obj_key, {}).get(obj_nested_key) if obj_nested_key else x.get(obj_key))
    except Exception:
        pass


def slice_array_on_limit(array, limit):
    """If array contains more items than the limit, return an array containing items up until the limit

    Args:
        array (list): List to be sliced.
        limit (int): The limit.

    Returns:
        list: New sliced list.

    """
    if array and len(array) > limit:
        return array[0:limit]
    return array


def format_url(url, *args):
    """Helper for formatting URLs.

    Converts the arguments to strings and performs percent encoding on them before using them in url.format().

    Args:
        url (str): URL as formatting string in the style accepted by str.format().
        *args: Arguments for str.format().

    Returns:
        (str): Formatted URL.

    """
    quoted_args = [parse.quote(str(arg), safe='') for arg in args]
    return url.format(*quoted_args)

def ensure_app(app):
    """Use app context if no app parameter is supplied"""
    if app:
        return app
    if has_app_context():
        return current_app
    raise ValueError('Missing app parameter and no app context available')

class FlaskService:
    """Use as base class for external dependency services"""

    def __init__(self, app):
        """Init FlaskService"""
        if app.testing or executing_travis():
            self.is_testing = True
        else:
            self.is_testing = False
