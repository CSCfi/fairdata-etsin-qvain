# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

from etsin_finder.authentication import get_user_id
from etsin_finder.cr_service import \
    get_catalog_record_access_type, \
    get_catalog_record_data_catalog_id, \
    get_catalog_record_embargo_available
from etsin_finder.finder import app, rems_cache
from etsin_finder.rems_service import get_user_rems_permission_for_catalog_record
from etsin_finder.utils import tz_now_is_later_than_timestamp_str, remove_keys_recursively, leave_keys_in_dict

log = app.logger

ACCESS_TYPES = {
    'open': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
    'login': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/login',
    'permit': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
    'embargo': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
    'restricted': 'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted'
}

DATA_CATALOG_IDENTIFIERS = {
    'ida': 'urn:nbn:fi:att:data-catalog-ida',
    'att': 'urn:nbn:fi:att:data-catalog-att'
}


def _user_has_rems_permission_for_catalog_record(cr_id, user_id, is_authd):
    """
    Use Fairdata REMS API to check whether user has 'entitlement' for the specified catalog record

    :param catalog_record:
    :param user_id:
    :param is_authd:
    :return:
    """
    if not cr_id or not user_id or not is_authd:
        return False

    permission = rems_cache.get_from_cache(cr_id, user_id)
    if permission is None:
        permission = get_user_rems_permission_for_catalog_record(cr_id, user_id, is_authd)
        return rems_cache.update_cache(cr_id, user_id, permission)
    else:
        return permission


def user_is_allowed_to_download_from_ida(catalog_record, is_authd):
    """
        Based on catalog record's research_dataset.access_rights.access_type, decide whether user is allowed to download
        from Fairdata download service

        :param catalog_record:
        :param is_authd: Is the user authenticated
        :return:
        """

    # TODO: After testing with this is done and after test datas have proper ida data catalog identifiers, remove
    # TODO: 'not app.debug and' from below
    if not app.debug and get_catalog_record_data_catalog_id(catalog_record) != DATA_CATALOG_IDENTIFIERS['ida']:
        return False

    access_type_id = get_catalog_record_access_type(catalog_record)
    if not access_type_id:
        return False

    if access_type_id == ACCESS_TYPES['open']:
        return True
    elif access_type_id == ACCESS_TYPES['embargo']:
        if _embargo_time_passed(catalog_record):
            return True
    elif access_type_id == ACCESS_TYPES['restricted']:
        return False
    elif access_type_id == ACCESS_TYPES['permit']:
        return _user_has_rems_permission_for_catalog_record(catalog_record['identifier'], get_user_id(), is_authd)
    elif access_type_id == ACCESS_TYPES['login']:
        if is_authd:
            return True
    return False


def strip_dir_api_object(dir_api_obj, is_authd, catalog_record):
    """
    Based on catalog record's research_dataset.access_rights.access_type, decide whether to strip dir_api_obj partially
    or not.

    :param dir_api_obj:
    :param is_authd: Is the user authenticated
    :param catalog_record: Catalog record, to which the dir_api_obj is bound
    :return: dir_api_obj after possible modifications
    """
    access_type_id = get_catalog_record_access_type(catalog_record)
    if not access_type_id:
        dir_api_obj = {}

    if access_type_id == ACCESS_TYPES['open']:
        pass
    elif access_type_id == ACCESS_TYPES['embargo']:
        if not _embargo_time_passed(catalog_record):
            _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted']:
        _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['permit']:
        if not _user_has_rems_permission_for_catalog_record(catalog_record['identifier'], get_user_id(), is_authd):
            _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['login']:
        if not is_authd:
            _strip_directory_api_obj_partially(dir_api_obj)

    return dir_api_obj


def strip_information_from_catalog_record(catalog_record, is_authd):
    """
    Based on catalog record's research_dataset.access_rights.access_type, decide whether to strip ida-related file and
    directory data partially or not. In any case, strip sensitive information

    :param catalog_record:
    :param is_authd: Is the user authenticated
    :return: catalog_record after possible modifications
    """

    catalog_record = _strip_sensitive_information_from_catalog_record(catalog_record)

    access_type_id = get_catalog_record_access_type(catalog_record)
    if not access_type_id:
        return remove_keys_recursively(catalog_record, ['files', 'directories', 'remote_resources'])

    if access_type_id == ACCESS_TYPES['open']:
        pass
    elif access_type_id == ACCESS_TYPES['embargo']:
        if not _embargo_time_passed(catalog_record):
            _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted']:
        _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['permit']:
        if not _user_has_rems_permission_for_catalog_record(catalog_record['identifier'], get_user_id(), is_authd):
            _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['login']:
        if not is_authd:
            _strip_catalog_record_ida_data_partially(catalog_record)

    return catalog_record


def _embargo_time_passed(catalog_record):
    """
    Check whether embargo time has been passed.

    :param catalog_record:
    :return:
    """
    try:
        access_rights_available = get_catalog_record_embargo_available(catalog_record)
        embargo_time_passed = tz_now_is_later_than_timestamp_str(access_rights_available)
    except Exception as e:
        log.error(e)
        embargo_time_passed = False

    return embargo_time_passed


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
    _strip_dir_api_obj_files(dir_api_obj)
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
    'details.directory_path', 'details.byte_size', 'details.file_count'

    :param catalog_record:
    :return:
    """
    dir_keys_to_leave = set(['identifier', 'use_category', 'details'])
    details_keys_to_leave = set(['directory_name', 'directory_path', 'byte_size', 'file_count', 'identifier'])

    if 'research_dataset' in catalog_record:
        for dir in catalog_record['research_dataset'].get('directories', []):
            leave_keys_in_dict(dir, dir_keys_to_leave)
            if 'details' in dir:
                leave_keys_in_dict(dir['details'], details_keys_to_leave)


def _strip_dir_api_obj_files(dir_api_obj):
    """
    Keys to leave: 'identifier', 'file_name', 'file_path', 'byte_size'

    :param dir_api_obj:
    :return:
    """
    file_keys_to_leave = set(['identifier', 'file_name', 'file_path', 'byte_size'])
    for file in dir_api_obj.get('files', []):
        leave_keys_in_dict(file, file_keys_to_leave)


def _strip_dir_api_obj_directories(dir_api_obj):
    """
    Keys to leave: 'identifier', 'directory_name', 'directory_path', 'byte_size', 'file_count'

    :param dir_api_obj:
    :return:
    """
    dir_keys_to_leave = set(['identifier', 'directory_name', 'directory_path', 'byte_size', 'file_count'])
    for dir in dir_api_obj.get('directories', []):
        leave_keys_in_dict(dir, dir_keys_to_leave)
