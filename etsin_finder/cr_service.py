# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from etsin_finder.cache import Cache
from etsin_finder.finder import app
from etsin_finder.metax_api import MetaxAPIService
from etsin_finder.utils import get_metax_api_config

log = app.logger
_metax_service = MetaxAPIService(get_metax_api_config(app.config))
_cache = Cache(500, 1800)


def get_catalog_record(cr_id, check_removed_if_not_exist, refresh_cache=False):
    if refresh_cache:
        return _cache.update_cache(_get_cr_from_metax(cr_id, check_removed_if_not_exist))
    return _cache.get_from_cache(cr_id) or _cache.update_cache(_get_cr_from_metax(cr_id, check_removed_if_not_exist))


def get_directory_data_for_catalog_record(cr_id, dir_id, file_fields, directory_fields):
    return _metax_service.get_directory_for_catalog_record(cr_id, dir_id, file_fields, directory_fields)


def get_catalog_record_access_type(cr):
    return cr.get('research_dataset', {}).get('access_rights', {}).get('access_type', {}).get('identifier', '')


def get_catalog_record_embargo_available(cr):
    return cr.get('research_dataset', {}).get('access_rights', {}).get('available', '')


def get_catalog_record_data_catalog_id(cr):
    return cr.get('data_catalog', {}).get('catalog_json', {}).get('identifier', '')


def get_catalog_record_preferred_identifier(cr):
    return cr.get('research_dataset', {}).get('preferred_identifier', '')


def catalog_record_access_type_is_open(cr):
    from etsin_finder.authorization import ACCESS_TYPES
    return get_catalog_record_access_type(cr) == ACCESS_TYPES['open']


def _get_cr_from_metax(cr_id, check_removed_if_not_exist):
    cr = _metax_service.get_catalog_record_with_file_details(cr_id)
    if not cr and check_removed_if_not_exist:
        cr = _metax_service.get_removed_catalog_record(cr_id)
    return cr


def is_rems_catalog_record(catalog_record):
    from etsin_finder.authorization import ACCESS_TYPES
    if get_catalog_record_access_type(catalog_record) == ACCESS_TYPES['permit']:
        return True
    return False
