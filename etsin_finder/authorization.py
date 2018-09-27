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
from etsin_finder.utils import tz_now_is_later_than_timestamp_str, remove_keys_recursively, leave_keys_in_dict

log = app.logger
_cache = Cache(50, 600)

ACCESS_TYPES = {
    'open': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open_access',
    'closed': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/closed_access',
    'embargoed': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargoed_access',
    'restricted_access': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access',
    'restricted_access_permit_fairdata':
        'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_permit_fairdata',
    'restricted_access_permit_external':
        'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_permit_external',
    'restricted_access_research': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_research',
    'restricted_access_research_education_studying':
        'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_education_studying',
    'restricted_access_registration':
        'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_registration',
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
            embargo_time_passed = tz_now_is_later_than_timestamp_str(access_rights_available)
        except Exception as e:
            log.error(e)
            embargo_time_passed = False

        if embargo_time_passed:
            return True
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
        pass
    elif access_type_id == ACCESS_TYPES['closed']:
        _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['embargoed']:
        try:
            access_rights_available = get_catalog_record_embargo_available(catalog_record)
            embargo_time_passed = tz_now_is_later_than_timestamp_str(access_rights_available)
        except Exception as e:
            log.error(e)
            embargo_time_passed = False

        if not embargo_time_passed:
            return {}
    elif access_type_id == ACCESS_TYPES['restricted_access']:
        _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_fairdata']:
        if not _user_has_rems_permission_for_catalog_record(catalog_record, get_user_eppn(), is_authd):
            _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_external']:
        _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_research']:
        _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_research_education_studying']:
        if not is_authd:
            _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_registration']:
        if not is_authd:
            _strip_directory_api_obj_partially(dir_api_obj)

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
        pass
    elif access_type_id == ACCESS_TYPES['closed']:
        _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['embargoed']:
        try:
            access_rights_available = get_catalog_record_embargo_available(catalog_record)
            embargo_time_passed = tz_now_is_later_than_timestamp_str(access_rights_available)
        except Exception as e:
            log.error(e)
            embargo_time_passed = False

        if not embargo_time_passed:
            return remove_keys_recursively(catalog_record, ['files', 'directories', 'remote_resources'])
    elif access_type_id == ACCESS_TYPES['restricted_access']:
        _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_fairdata']:
        if not _user_has_rems_permission_for_catalog_record(catalog_record, get_user_eppn(), is_authd):
            _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_external']:
        _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_research']:
        _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_research_education_studying']:
        if not is_authd:
            _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_registration']:
        if not is_authd:
            _strip_catalog_record_ida_data_partially(catalog_record)

    return catalog_record


def _strip_sensitive_information_from_catalog_record(catalog_record):
    """
    This method should strip catalog record of any confidential/private information not supposed to be sent for
    the frontend.

    :param catalog_record:
    :return:
    """
    return remove_keys_recursively(catalog_record, ['email', 'telephone', 'phone'])


def _strip_catalog_record_ida_data_partially(catalog_record):
    _strip_catalog_record_files(catalog_record)
    _strip_catalog_record_directories(catalog_record)


def _strip_directory_api_obj_partially(dir_api_obj):
    _strip_dir_api_file_obj(dir_api_obj)
    _strip_dir_api_obj_directories(dir_api_obj)


def _strip_catalog_record_files(catalog_record):
    """
    Keys to leave: 'use_category', 'file_type', 'identifier', 'details.file_name', 'details.file_path',
    'details.byte_size, details.identifier'

    :param catalog_record:
    :return:
    """
    file_keys_to_leave = set(['use_category', 'file_type', 'identifier', 'details'])
    details_keys_to_leave = set(['file_name', 'file_path', 'byte_size', 'identifier'])

    if 'research_dataset' in catalog_record:
        for file in catalog_record['research_dataset'].get('files', []):
            leave_keys_in_dict(file, file_keys_to_leave)
            if 'details' in file:
                leave_keys_in_dict(file['details'], details_keys_to_leave)


def _strip_catalog_record_directories(catalog_record):
    """
    Keys to leave: 'identifier', 'use_category', 'details.byte_size', 'details.directory_name',
    'details.directory_path', 'details.file_count'

    :param catalog_record:
    :return:
    """
    dir_keys_to_leave = set(['identifier', 'use_category', 'details'])
    details_keys_to_leave = set(['directory_name', 'directory_path', 'byte_size', 'file_count'])

    if 'research_dataset' in catalog_record:
        for dir in catalog_record['research_dataset'].get('directories', []):
            leave_keys_in_dict(dir, dir_keys_to_leave)
            if 'details' in dir:
                leave_keys_in_dict(dir['details'], details_keys_to_leave)


def _strip_dir_api_file_obj(file_obj):
    """
    Keys to leave: 'identifier', 'file_name', 'file_path', 'byte_size'

    :param file_obj:
    :return:
    """
    file_keys_to_leave = set(['identifier', 'file_name', 'file_path', 'byte_size'])
    leave_keys_in_dict(file_obj, file_keys_to_leave)


def _strip_dir_api_obj_directories(dir_obj):
    """
    Keys to leave: 'identifier', 'directory_name', 'directory_path', 'byte_size', 'file_count'

    :param dir_obj:
    :return:
    """
    dir_keys_to_leave = set(['identifier', 'directory_name', 'directory_path', 'byte_size', 'file_count'])
    leave_keys_in_dict(dir_obj, dir_keys_to_leave)
