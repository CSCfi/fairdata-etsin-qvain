# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from cachetools import cached

from etsin_finder.authentication import get_user_eppn
from etsin_finder.cache import Cache
from etsin_finder.cr_service import \
    get_catalog_record_access_type, \
    get_catalog_record_data_catalog_id, \
    get_catalog_record_embargo_available, \
    is_rems_catalog_record
from etsin_finder.finder import app
from etsin_finder.rems_service import get_user_rems_permission_for_catalog_record
from etsin_finder.utils import now_is_later_than_datetime_str, remove_keys

log = app.logger
_cache = Cache(50, 600)

ACCESS_TYPES = {
    'open': 'http://purl.org/att/es/reference_data/access_type/access_type_open_access',
    'closed': 'http://purl.org/att/es/reference_data/access_type/access_type_closed_access',
    'embargoed': 'http://purl.org/att/es/reference_data/access_type/access_type_embargoed_access',
    'restricted_access':
        'http://purl.org/att/es/reference_data/access_type/access_type_restricted_access',
    'restricted_access_permit_fairdata':
        'http://purl.org/att/es/reference_data/access_type/access_type_restricted_access_permit_fairdata',
    'restricted_access_permit_external':
        'http://purl.org/att/es/reference_data/access_type/access_type_restricted_access_permit_external',
    'restricted_access_research':
        'http://purl.org/att/es/reference_data/access_type/access_type_restricted_access_research',
    'restricted_access_research_education_studying':
        'http://purl.org/att/es/reference_data/access_type/access_type_restricted_access_education_studying',
    'restricted_access_registration':
        'http://purl.org/att/es/reference_data/access_type/access_type_restricted_access_registration',
}

DATA_CATALOG_IDENTIFIERS = {
    'ida': 'urn:nbn:fi:att:data-catalog-ida',
    'att': 'urn:nbn:fi:att:data-catalog-att'
}


@cached(_cache)
def _user_has_rems_permission_for_catalog_record(catalog_record, user_eppn, is_authd):
    user_has_rems_permission = False
    if is_rems_catalog_record(catalog_record):
        user_has_rems_permission = get_user_rems_permission_for_catalog_record(catalog_record, user_eppn, is_authd)
    return user_has_rems_permission


def user_is_allowed_to_download_from_ida(catalog_record, is_authd):
    # TODO: After testing with this is done and after test datas have proper ida data catalog identifiers, remove
    # TODO: 'not app.debug and' from below
    if not app.debug and get_catalog_record_data_catalog_id(catalog_record) != DATA_CATALOG_IDENTIFIERS['ida']:
        return False

    access_type_id = get_catalog_record_access_type(catalog_record)
    if not access_type_id:
        return False
    elif access_type_id == ACCESS_TYPES['open']:
        return True
    elif access_type_id == ACCESS_TYPES['closed']:
        return False
    elif access_type_id == ACCESS_TYPES['embargoed']:
        try:
            access_rights_available = get_catalog_record_embargo_available(catalog_record)
            embargo_time_passed = now_is_later_than_datetime_str(access_rights_available)
        except Exception as e:
            log.warning(e)
            return False

        if embargo_time_passed:
            return True
        else:
            return False
    elif access_type_id == ACCESS_TYPES['restricted_access']:
        return False
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_fairdata']:
        return _user_has_rems_permission_for_catalog_record(catalog_record, get_user_eppn(), is_authd)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_external']:
        return False
    elif access_type_id == ACCESS_TYPES['restricted_access_research']:
        return False
    elif access_type_id == ACCESS_TYPES['restricted_access_research_education_studying']:
        if is_authd:
            return True
    elif access_type_id == ACCESS_TYPES['restricted_access_registration']:
        if is_authd:
            return True
    return False


def strip_dir_api_object(dir_api_obj, is_authd, catalog_record):
    access_type_id = get_catalog_record_access_type(catalog_record)

    if access_type_id == ACCESS_TYPES['open']:
        return dir_api_obj
    elif access_type_id == ACCESS_TYPES['closed']:
        return _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['embargoed']:
        try:
            access_rights_available = get_catalog_record_embargo_available(catalog_record)
            embargo_time_passed = now_is_later_than_datetime_str(access_rights_available)
        except Exception as e:
            log.warning(e)
            return {}

        if not embargo_time_passed:
            return {}
    elif access_type_id == ACCESS_TYPES['restricted_access']:
        return _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_fairdata']:
        if not _user_has_rems_permission_for_catalog_record(catalog_record, get_user_eppn(), is_authd):
            return _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_external']:
        return _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_research']:
        return _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_research_education_studying']:
        if not is_authd:
            return _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_registration']:
        if not is_authd:
            return _strip_directory_api_obj_partially(dir_api_obj)

    return dir_api_obj


def strip_information_from_catalog_record(catalog_record, is_authd):
    """
    This method should inspect catalog record's research_dataset.access_rights.access_type and based on that
    remove specific information so that it can be sent for the frontend.

    :param catalog_record:
    :return:
    """

    catalog_record = _strip_sensitive_information_from_catalog_record(catalog_record)

    access_type_id = get_catalog_record_access_type(catalog_record)
    if access_type_id == ACCESS_TYPES['open']:
        return catalog_record
    elif access_type_id == ACCESS_TYPES['closed']:
        return _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['embargoed']:
        try:
            access_rights_available = get_catalog_record_embargo_available(catalog_record)
            embargo_time_passed = now_is_later_than_datetime_str(access_rights_available)
        except Exception as e:
            log.warning(e)
            return remove_keys(catalog_record, ['files', 'directories', 'remote_resources'])

        if not embargo_time_passed:
            return remove_keys(catalog_record, ['files', 'directories', 'remote_resources'])
    elif access_type_id == ACCESS_TYPES['restricted_access']:
        return _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_fairdata']:
        if not _user_has_rems_permission_for_catalog_record(catalog_record, get_user_eppn(), is_authd):
            return _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_external']:
        return _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_research']:
        return _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_research_education_studying']:
        if not is_authd:
            return _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_registration']:
        if not is_authd:
            return _strip_catalog_record_ida_data_partially(catalog_record)

    return catalog_record


def _strip_sensitive_information_from_catalog_record(catalog_record):
    """
    This method should strip catalog record of any confidential/private information not supposed to be sent for
    the frontend.

    :param catalog_record:
    :return:
    """
    return remove_keys(catalog_record, ['email', 'telephone', 'phone'])


def _strip_catalog_record_ida_data_partially(catalog_record):
    return _strip_catalog_record_directories(_strip_catalog_record_files(catalog_record))


def _strip_directory_api_obj_partially(dir_api_obj):
    return _strip_dir_api_obj_directories(_strip_dir_api_obj_files(dir_api_obj))


def _strip_catalog_record_files(catalog_record):
    """
    Keys to leave: 'use_category', 'file_type', 'identifier', 'file_name', 'file_path', 'byte_size'

    :param catalog_record:
    :return:
    """
    if 'research_dataset' in catalog_record and 'files' in catalog_record['research_dataset']:
        files = catalog_record['research_dataset']['files']
        catalog_record['research_dataset']['files'] = \
            remove_keys(files,
                        ['title', 'description', 'id', 'checksum', 'checksum_value', 'parent_directory', 'file_frozen', 'file_format',
                         'file_modified', 'file_storage', 'file_uploaded', 'file_characteristics', 'open_access',
                         'project_identifier', 'replication_path', 'date_modified', 'date_created', 'service_created'])
    return catalog_record


def _strip_catalog_record_directories(catalog_record):
    """
    Keys to leave: 'identifier', 'use_category', 'byte_size', 'directory_name', 'directory_path', 'file_count'

    :param catalog_record:
    :return:
    """
    if 'research_dataset' in catalog_record and 'directories' in catalog_record['research_dataset']:
        dirs = catalog_record['research_dataset']['directories']
        catalog_record['research_dataset']['directories'] = \
            remove_keys(dirs,
                       ['title', 'description', 'id', 'directory_modified', 'parent_directory', 'project_identifier',
                        'date_modified', 'date_created', 'service_created'])
    return catalog_record


def _strip_dir_api_obj_files(dir_api_obj):
    """
    Keys to leave: 'identifier', 'file_name', 'file_path', 'byte_size'

    :param dir_api_obj:
    :return:
    """
    if 'files' in dir_api_obj:
        files = dir_api_obj['files']
        dir_api_obj['files'] = \
            remove_keys(files,
                        ['id', 'checksum', 'checksum_value', 'parent_directory', 'file_frozen', 'file_format', 'file_modified',
                         'file_storage', 'file_uploaded', 'file_characteristics', 'open_access', 'project_identifier',
                         'replication_path', 'date_modified', 'date_created', 'service_created', 'file_characteristics',
                         'file_characteristics_extension'])
    return dir_api_obj


def _strip_dir_api_obj_directories(dir_api_obj):
    """

    :param dir_api_obj:
    :return:
    """
    if 'directories' in dir_api_obj:
        dirs = dir_api_obj['directories']
        dir_api_obj['directories'] = \
            remove_keys(dirs,
                        ['id', 'directory_modified', 'parent_directory', 'project_identifier', 'date_modified',
                         'date_created', 'service_created', 'file_storage'])
    return dir_api_obj
