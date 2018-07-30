from etsin_finder.authentication import get_user_eppn
from etsin_finder.finder import app
from etsin_finder.utils import now_is_later_than_datetime_str, remove_keys

log = app.logger

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


def get_access_type_id_from_catalog_record(catalog_record):
    return catalog_record. \
        get('research_dataset', {}). \
        get('access_rights', {}). \
        get('access_type', {}). \
        get('identifier', None)


def get_data_catalog_id_from_catalog_record(catalog_record):
    return catalog_record. \
        get('data_catalog', {}). \
        get('catalog_json', {}). \
        get('identifier', None)


def user_is_allowed_to_download_from_ida(catalog_record, is_authd, has_rems_permission=None):
    # TODO: After testing with this is done and after test datas have proper ida data catalog identifiers, remove
    # TODO: 'not app.debug and' from below
    if not app.debug and get_data_catalog_id_from_catalog_record(catalog_record) != DATA_CATALOG_IDENTIFIERS['ida']:
        return False

    access_type_id = get_access_type_id_from_catalog_record(catalog_record)
    if access_type_id is None:
        return False
    if access_type_id == ACCESS_TYPES['open']:
        return True
    elif access_type_id == ACCESS_TYPES['closed']:
        return False
    elif access_type_id == ACCESS_TYPES['embargoed']:
        try:
            access_rights_available = _get_embargo_available_from_catalog_record(catalog_record)
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
        if has_rems_permission is None:
            return user_has_rems_permission_for_dataset(catalog_record, is_authd)
        return has_rems_permission
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


def user_has_rems_permission_for_dataset(catalog_record, is_authd):
    if not is_authd:
            return False

    user_eppn = get_user_eppn()
    pref_id = _get_preferred_identifier_from_catalog_record(catalog_record)

    if user_eppn is None or pref_id is None:
        return False

    # TODO: Implement connecting to rems. Create new rems.py class for connections.
    # TODO: Inspect the reply and return boolean accordingly
    return False


def strip_catalog_record(catalog_record, is_authd, has_rems_permission):
    cr = _strip_information_based_on_access_type_from_catalog_record(
        catalog_record, is_authd, has_rems_permission)

    return _strip_sensitive_information_from_catalog_record(cr)


def is_rems_catalog_record(catalog_record):
    if get_access_type_id_from_catalog_record(catalog_record) == ACCESS_TYPES['restricted_access_permit_fairdata']:
        return True
    return False


def strip_dir_api_object(dir_api_obj, is_authd, catalog_record):
    access_type_id = get_access_type_id_from_catalog_record(catalog_record)

    if access_type_id == ACCESS_TYPES['open']:
        return dir_api_obj
    if access_type_id == ACCESS_TYPES['closed']:
        return _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['embargoed']:
        try:
            access_rights_available = _get_embargo_available_from_catalog_record(catalog_record)
            embargo_time_passed = now_is_later_than_datetime_str(access_rights_available)
        except Exception as e:
            log.warning(e)
            return {}

        if not embargo_time_passed:
            return {}
    elif access_type_id == ACCESS_TYPES['restricted_access']:
        return _strip_directory_api_obj_partially(dir_api_obj)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_fairdata']:
        if not user_has_rems_permission_for_dataset(catalog_record, is_authd):
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


def _get_embargo_available_from_catalog_record(catalog_record):
    return catalog_record. \
        get('research_dataset', {}). \
        get('access_rights', {}). \
        get('available', None)


def _get_preferred_identifier_from_catalog_record(catalog_record):
    return catalog_record. \
        get('research_dataset', {}). \
        get('preferred_identifier', None)


def _strip_sensitive_information_from_catalog_record(catalog_record):
    """
    This method should strip catalog record of any confidential/private information not supposed to be sent for
    the frontend.

    :param catalog_record:
    :return:
    """
    return remove_keys(catalog_record, ['email', 'telephone', 'phone'])


def _strip_information_based_on_access_type_from_catalog_record(catalog_record, is_authd, has_rems_permission=None):
    """
    This method should inspect catalog record's research_dataset.access_rights.access_type and based on that
    remove specific information so that it can be sent for the frontend.

    :param catalog_record:
    :return:
    """
    access_type_id = get_access_type_id_from_catalog_record(catalog_record)

    if access_type_id == ACCESS_TYPES['open']:
        return catalog_record
    if access_type_id == ACCESS_TYPES['closed']:
        return _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['embargoed']:
        try:
            access_rights_available = _get_embargo_available_from_catalog_record(catalog_record)
            embargo_time_passed = now_is_later_than_datetime_str(access_rights_available)
        except Exception as e:
            log.warning(e)
            return remove_keys(catalog_record, ['files', 'directories', 'remote_resources'])

        if not embargo_time_passed:
            return remove_keys(catalog_record, ['files', 'directories', 'remote_resources'])
    elif access_type_id == ACCESS_TYPES['restricted_access']:
        return _strip_catalog_record_ida_data_partially(catalog_record)
    elif access_type_id == ACCESS_TYPES['restricted_access_permit_fairdata']:
        if has_rems_permission is None or not has_rems_permission:
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


def _strip_catalog_record_ida_data_partially(catalog_record):
    _strip_catalog_record_files(catalog_record)
    _strip_catalog_record_directories(catalog_record)
    return catalog_record


def _strip_directory_api_obj_partially(dir_api_obj):
    _strip_dir_api_obj_files(dir_api_obj)
    _strip_dir_api_obj_directories(dir_api_obj)
    return dir_api_obj


def _strip_catalog_record_files(catalog_record):
    remove_keys(catalog_record.get('research_dataset', {}).get('files', {}),
                ['title', 'description', 'id', 'checksum', 'parent_directory', 'file_frozen', 'file_format',
                 'file_modified', 'file_storage', 'file_uploaded', 'file_characteristics', 'open_access',
                 'project_identifier', 'replication_path', 'date_modified', 'date_created', 'service_created'])


def _strip_catalog_record_directories(catalog_record):
    remove_keys(catalog_record.get('research_dataset', {}).get('directories', {}),
                ['title', 'description', 'id', 'directory_modified', 'parent_directory', 'project_identifier',
                 'date_modified', 'date_created', 'service_created'])


def _strip_dir_api_obj_directories(dir_api_obj):
    remove_keys(dir_api_obj.get('directories', {}),
                ['id', 'directory_modified', 'parent_directory', 'project_identifier', 'date_modified',
                 'date_created', 'service_created', 'file_storage'])


def _strip_dir_api_obj_files(dir_api_obj):
    remove_keys(dir_api_obj.get('files', {}),
                ['id', 'checksum', 'parent_directory', 'file_frozen', 'file_format', 'file_modified', 'file_storage',
                 'file_uploaded', 'file_characteristics', 'open_access', 'project_identifier', 'replication_path',
                 'date_modified', 'date_created', 'service_created', 'file_characteristics',
                 'file_characteristics_extension'])