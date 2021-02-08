# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Functionalities related to authorization and what users are allowed to see."""

from flask import current_app

from etsin_finder.services import cr_service
from etsin_finder.services.cr_service import (
    get_catalog_record_access_type,
    get_catalog_record_data_catalog_id,
    get_catalog_record_embargo_available,
    is_published,
    is_catalog_record_owner
)

from etsin_finder.log import log
from etsin_finder.services import rems_service
from etsin_finder.utils.utils import tz_now_is_later_than_timestamp_str, remove_keys_recursively, leave_keys_in_dict
from etsin_finder.utils.constants import ACCESS_TYPES, ACCESS_DENIED_REASON, DATA_CATALOG_IDENTIFIERS
from etsin_finder.auth.authentication import get_user_id, is_authenticated

def user_can_view_dataset(cr_id):
    """
    If dataset is a draft, it's visible only for the owner.

    Arguments:
        cr_id {string} -- Identifier of dataset.

    Returns:
        [type] -- [description]

    """
    cr = cr_service.get_catalog_record(cr_id, True, False)
    if cr is None:
        return False

    if is_published(cr):
        return True

    # non-public dataset is available only for the owner
    user_id = get_user_id()
    if is_catalog_record_owner(cr, user_id):
        return True
    return False


def user_has_rems_permission_for_catalog_record(cr_id):
    """Does user have REMS permission for cr

    Use Fairdata REMS API to check whether user has 'entitlement' for the specified catalog record.

    Args:
        cr_id (str): Catalog record identifier.

    Returns:
        bool: True if user is entitled, False if not.

    """
    if not is_authenticated():
        return False
    user_id = get_user_id()
    if not cr_id or not user_id:
        return False
    return rems_service.get_user_rems_permission_for_catalog_record(cr_id, user_id)


def user_is_allowed_to_download_from_ida(catalog_record, is_authd):
    """Is user allowed to download from Ida

    Based on catalog record's research_dataset.access_rights.access_type,
    decide whether user is allowed to download from Fairdata download service

    Args:
        catalog_record (dict): Catalog record.
        is_authd (bool): Is the user authenticated.

    Returns tuple:
        allowed (bool): True if user is allowed to download, False if not.
        reason (str): Reason identifier why user was not allowed. None if user is allowed or reason is unspecified.

    """
    if get_catalog_record_data_catalog_id(catalog_record) != DATA_CATALOG_IDENTIFIERS.get('ida'):
        return False, None

    access_type_id = get_catalog_record_access_type(catalog_record)
    if not access_type_id:
        return False, None

    if access_type_id == ACCESS_TYPES.get('open'):
        return True, None
    elif access_type_id == ACCESS_TYPES.get('embargo'):
        if _embargo_time_passed(catalog_record):
            return True, None
        else:
            return False, ACCESS_DENIED_REASON['EMBARGO']
    elif access_type_id == ACCESS_TYPES.get('restricted'):
        return False, ACCESS_DENIED_REASON['RESTRICTED']
    elif access_type_id == ACCESS_TYPES.get('permit'):
        if user_has_rems_permission_for_catalog_record(catalog_record.get('identifier')):
            return True, None
        else:
            return False, ACCESS_DENIED_REASON['NEED_REMS_PERMISSION']
    elif access_type_id == ACCESS_TYPES.get('login'):
        if is_authd:
            return True, None
        else:
            return False, ACCESS_DENIED_REASON['NEED_LOGIN']
    return False, None


def strip_dir_api_object(dir_api_obj, is_authd, catalog_record):
    """Strip directory api object

    Based on catalog record's research_dataset.access_rights.access_type,
    decide whether to strip dir_api_obj partially or not.

    Args:
        dir_api_obj (dict): Directory api object.
        is_authd (bool): Is the user authenticated.
        catalog_record (str): Catalog record identifier.

    Returns:
        dict: dir_api_obj after possible modifications.

    """
    access_type_id = get_catalog_record_access_type(catalog_record)
    if not access_type_id:
        dir_api_obj = {}

    if access_type_id == ACCESS_TYPES.get('open'):
        pass
    elif access_type_id == ACCESS_TYPES.get('embargo'):
        if not _embargo_time_passed(catalog_record):
            _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES.get('restricted'):
        _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES.get('permit'):
        if not user_has_rems_permission_for_catalog_record(catalog_record.get('identifier', None)):
            _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES.get('login'):
        if not is_authd:
            _strip_directory_api_obj_partially(dir_api_obj)

    return dir_api_obj


def strip_information_from_catalog_record(catalog_record, is_authd):
    """Strip Information from catalog record

    Based on catalog record's research_dataset.access_rights.access_type,
    decide whether to strip ida-related file and directory data partially or not. In any case, strip sensitive
    information.

    Args:
        catalog_record (dict): Catalog record.
        is_authd (bool): Is the user authenticated.

    Returns:
        dict: Catalog_record after possible modifications

    """
    catalog_record = _strip_sensitive_information_from_catalog_record(catalog_record)
    access_type_id = get_catalog_record_access_type(catalog_record)
    if not access_type_id:
        return remove_keys_recursively(catalog_record, ['files', 'directories', 'remote_resources'])

    if access_type_id == ACCESS_TYPES.get('open'):
        pass
    elif access_type_id == ACCESS_TYPES.get('embargo'):
        if not _embargo_time_passed(catalog_record):
            _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES.get('restricted'):
        _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES.get('permit'):
        if not user_has_rems_permission_for_catalog_record(catalog_record.get('identifier')):
            _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES.get('login'):
        if not is_authd:
            _strip_catalog_record_ida_data_partially(catalog_record)

    return catalog_record


def _embargo_time_passed(catalog_record):
    """Check whether embargo time has been passed.

    Args:
        catalog_record (str): Catalog record identifier.

    Returns:
        bool: True if the current time has passed the embargo time, False if not.

    """
    try:
        access_rights_available = get_catalog_record_embargo_available(catalog_record)
        embargo_time_passed = tz_now_is_later_than_timestamp_str(access_rights_available)
    except Exception as e:
        log.error(e)
        embargo_time_passed = False

    return embargo_time_passed


def _strip_sensitive_information_from_catalog_record(catalog_record):
    """Strip sensitive information from catalog record

    This method strips the catalog record of any confidential/private information not supposed to be sent to frontend.

    Args:
        catalog_record (dict): Catalog record.

    Returns:
        dict: [description]

    """
    return remove_keys_recursively(catalog_record, ['email', 'telephone', 'phone'])


def _strip_catalog_record_ida_data_partially(catalog_record):
    """Strip catalog record Ida data partially

    Args:
        catalog_record (dict): Catalog record.

    """
    _strip_catalog_record_files(catalog_record)
    _strip_catalog_record_directories(catalog_record)


def _strip_directory_api_obj_partially(dir_api_obj):
    """Strip directory api object partially

    Args:
        dir_api_obj (dict): Directory api object.

    """
    _strip_dir_api_obj_files(dir_api_obj)
    _strip_dir_api_obj_directories(dir_api_obj)


def _strip_catalog_record_files(catalog_record):
    """Strip catalog record files

    Keys to leave:
    'use_category', 'file_type', 'identifier', 'details.file_name', 'details.file_path', 'details.byte_size,
    details.identifier'

    Args:
        catalog_record (dict): Catalog record.

    """
    file_keys_to_leave = set(['use_category', 'file_type', 'identifier', 'details'])
    details_keys_to_leave = set(['file_name', 'file_path', 'byte_size', 'identifier'])

    if 'research_dataset' in catalog_record:
        for file in catalog_record.get('research_dataset', {}).get('files', []):
            leave_keys_in_dict(file, file_keys_to_leave)
            if 'details' in file:
                leave_keys_in_dict(file.get('details'), details_keys_to_leave)


def _strip_catalog_record_directories(catalog_record):
    """Strip catalog record directories

    Keys to leave:
    'identifier', 'use_category', 'details.byte_size', 'details.directory_name', 'details.directory_path',
    'details.byte_size', 'details.file_count'

    Args:
        catalog_record (dict): Catalog record

    """
    dir_keys_to_leave = set(['identifier', 'use_category', 'details'])
    details_keys_to_leave = set(['directory_name', 'directory_path', 'byte_size', 'file_count', 'identifier'])

    if 'research_dataset' in catalog_record:
        for dir in catalog_record.get('research_dataset', {}).get('directories', []):
            leave_keys_in_dict(dir, dir_keys_to_leave)
            if 'details' in dir:
                leave_keys_in_dict(dir.get('details'), details_keys_to_leave)


def _strip_dir_api_obj_files(dir_api_obj):
    """Strip directory api object files

    Keys to leave: 'identifier', 'file_name', 'file_path', 'byte_size'

    Args:
        dir_api_obj (dict): Directory api object

    """
    file_keys_to_leave = set(['identifier', 'file_name', 'file_path', 'byte_size'])
    for file in dir_api_obj.get('files', []):
        leave_keys_in_dict(file, file_keys_to_leave)


def _strip_dir_api_obj_directories(dir_api_obj):
    """Strip directory api object directories

    Args:
        dir_api_obj (dict): Directory api object

    """
    dir_keys_to_leave = set(['identifier', 'directory_name', 'directory_path', 'byte_size', 'file_count'])
    for dir in dir_api_obj.get('directories', []):
        leave_keys_in_dict(dir, dir_keys_to_leave)
