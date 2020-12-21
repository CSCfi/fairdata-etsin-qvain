# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Get configurations for the app and external services."""

import yaml
from flask import has_app_context, current_app

from etsin_finder.utils.utils import executing_travis

def _get_app_config_from_file():
    """Get app config from file

    Returns:
        object: Python object containing the app configs

    """
    with open('/home/etsin-user/app_config') as app_config_file:
        return yaml.load(app_config_file, Loader=yaml.FullLoader)


def get_app_config(is_testing):
    """Get app config.

    Args:
        is_testing (bool): Testing.

    Returns:
        function: function to get app config.

    """
    # use the existing config from app context when possible
    if has_app_context():
        return current_app.config

    if executing_travis():
        return _get_app_config_for_travis()
    if is_testing:
        return _get_test_app_config()
    return _get_app_config_from_file()


def _get_test_app_config():
    """Get test app config

    Returns:
        dict: app config.

    """
    return {
        'TESTING': True,
        'APP_LOG_LEVEL': 'DEBUG',
        'APP_LOG_PATH': '/var/log/etsin_finder/etsin_finder.log',
        'SEARCH_APP_LOG_LEVEL': 'DEBUG',
        'SEARCH_APP_LOG_PATH': '/var/log/etsin_finder_search/etsin_finder_search.log',
        'DEBUG': True,
        'SECRET_KEY': 'cb1c9f28f16ddd1e41fb47e12d4a73f9ed76d6df93c54f31',
        'SESSION_COOKIE_SAMESITE': 'Lax',
        'SESSION_COOKIE_SECURE': True,
        'SESSION_COOKIE_HTTPONLY': True,
        'PERMANENT_SESSION_LIFETIME': 1800,
        'SESSION_REFRESH_EACH_REQUEST': True,
        'MAIL_SUPPRESS_SEND': True,
        'MAIL_SERVER': 'localhost',
        'MAIL_PORT': 25,
        'MAIL_USERNAME': '',
        'MAIL_PASSWORD': '',
        'MAIL_DEFAULT_SENDER': 'test@fairdata.fi',
        'SSO': {
            'PREFIX': 'fd_test_csc_fi',
        },
        'DOWNLOAD_API_V2': {
            'HOST': 'mock-download',
            'PORT': 1,
            'PUBLIC_HOST': 'mock-download-public',
            'PUBLIC_PORT': 2,
        },
        'FLAGS': {
            'DOWNLOAD_API_V2': True,
        },
    }


def _get_app_config_for_travis():
    """Get app config for travis

    Returns:
        dict: app config.

    """
    return {
        'TESTING': True,
        'APP_LOG_LEVEL': 'DEBUG',
        'APP_LOG_PATH': '/var/log/etsin_finder/etsin_finder.log',
        'DEBUG': True,
        'SECRET_KEY': 'cb3c5d29f16eda4e46fb77c14d6a75f9ab23e6df95c84e32',
        'SSO': {
            'PREFIX': 'fd_test_csc_fi',
        },
        'DOWNLOAD_API_V2': {
            'HOST': 'mock-download',
            'PORT': 1,
            'PUBLIC_HOST': 'mock-download-public',
            'PUBLIC_PORT': 2,
        },
        'FLAGS': {
            'DOWNLOAD_API_V2': True,
        },
    }


def get_memcached_config(is_testing):
    """Get memcached config.

    Args:
        is_testing (bool): Testing.

    Returns:
        dict: Dict with memcache configs or None.

    """
    if executing_travis() or is_testing:
        return None

    memcached_conf = get_app_config(is_testing).get('MEMCACHED', False)
    if not memcached_conf or not isinstance(memcached_conf, dict):
        return None

    if 'PORT' not in memcached_conf or 'HOST' not in memcached_conf:
        return None

    return memcached_conf


def get_download_api_config(is_testing):
    """Get download API config.

    Args:
        is_testing (bool): Testing.

    Returns:
        dict: Download api config or None

    """
    if executing_travis() or is_testing:
        return None

    dl_api_conf = get_app_config(is_testing).get('DOWNLOAD_API', False)
    if not dl_api_conf or not isinstance(dl_api_conf, dict):
        return None

    if 'USER' not in dl_api_conf or 'HOST' not in dl_api_conf or 'PASSWORD' not in dl_api_conf:
        return None

    return dl_api_conf


def get_download_api_v2_config(is_testing):
    """Get download API config.

    Args:
        is_testing (bool): Testing.

    Returns:
        dict: Download api config or None

    """
    dl_api_conf = get_app_config(is_testing).get('DOWNLOAD_API_V2', False)
    if not dl_api_conf or not isinstance(dl_api_conf, dict):
        return None

    return dl_api_conf


def get_fairdata_rems_api_config(is_testing):
    """Get Fairdata Rems API config.

    Args:
        is_testing (bool): Testing.

    Returns:
        dict: REMS api config or None.

    """
    if executing_travis() or is_testing:
        return None

    rems_conf = get_app_config(is_testing).get('FD_REMS', False)
    if not rems_conf or not isinstance(rems_conf, dict):
        return None

    if 'API_KEY' not in rems_conf or 'HOST' not in rems_conf or 'ENABLED' not in rems_conf:
        return None

    return rems_conf


def get_metax_api_config(is_testing):
    """Get Metax API config.

    Args:
        is_testing (bool): Testing.

    Returns:
        dict: Metax api configuration or None.

    """
    if executing_travis() or is_testing:
        return None

    metax_api_conf = get_app_config(is_testing).get('METAX_API', False)
    if not metax_api_conf or not isinstance(metax_api_conf, dict):
        return None

    if 'HOST' not in metax_api_conf or 'USER' not in metax_api_conf \
            or 'PASSWORD' not in metax_api_conf or 'VERIFY_SSL' not in metax_api_conf:
        return None

    return metax_api_conf

def get_metax_qvain_api_config(is_testing):
    """Get Metax API config for Qvain.

    Args:
        is_testing (bool): Testing.

    Returns:
        dict: Metax api config for Qvain, or None.

    """
    if executing_travis() or is_testing:
        return None

    metax_qvain_api_conf = get_app_config(is_testing).get('METAX_QVAIN_API', False)
    if not metax_qvain_api_conf or not isinstance(metax_qvain_api_conf, dict):
        return None

    if 'HOST' not in metax_qvain_api_conf or 'USER' not in metax_qvain_api_conf \
            or 'PASSWORD' not in metax_qvain_api_conf or 'VERIFY_SSL' not in metax_qvain_api_conf:
        return None

    return metax_qvain_api_conf
