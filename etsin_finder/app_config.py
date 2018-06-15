# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

import yaml

from etsin_finder.utils import executing_travis


def _get_app_config_from_file():
    with open('/home/etsin-user/app_config') as app_config_file:
        return yaml.load(app_config_file)


def get_from_app_config(key):
    if not executing_travis():
        return _get_app_config_from_file.get(key, None)


def get_app_config():
    if executing_travis():
        return _get_app_config_for_travis()
    return _get_app_config_from_file()


def _get_app_config_for_travis():
    return {
        'APP_LOG_LEVEL': 'DEBUG',
        'APP_LOG_PATH': '/var/log/etsin_finder/etsin_finder.log',
        'DEBUG': True,
        'SECRET_KEY': 'cb3c5d29f16eda4e46fb77c14d6a75f9ab23e6df95c84e32'
    }