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


def get_memcached_config():
    if executing_travis():
        return None

    memcached_conf = get_app_config().get('MEMCACHED', False)
    if not memcached_conf or not isinstance(memcached_conf, dict):
        return None

    if 'PORT' not in memcached_conf or 'HOST' not in memcached_conf:
        return None

    return memcached_conf


def get_download_api_config():
    if executing_travis():
        return None

    dl_api_conf = get_app_config().get('DOWNLOAD_API', False)
    if not dl_api_conf or not isinstance(dl_api_conf, dict):
        return None

    if 'USER' not in dl_api_conf or 'HOST' not in dl_api_conf or 'PASSWORD' not in dl_api_conf:
        return None

    return dl_api_conf


def get_fairdata_rems_api_config():
    if executing_travis():
        return None

    rems_conf = get_app_config().get('FD_REMS', False)
    if not rems_conf or not isinstance(rems_conf, dict):
        return None

    if 'API_KEY' not in rems_conf or 'HOST' not in rems_conf:
        return None

    return rems_conf


def get_metax_api_config():
    if executing_travis():
        return None

    metax_api_conf = get_app_config().get('METAX_API', False)
    if not metax_api_conf or not isinstance(metax_api_conf, dict):
        return None

    if 'HOST' not in metax_api_conf or 'USER' not in metax_api_conf \
            or 'PASSWORD' not in metax_api_conf or 'VERIFY_SSL' not in metax_api_conf:
        return None

    return metax_api_conf