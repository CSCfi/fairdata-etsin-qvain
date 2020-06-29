"""Utilities for transforming the data from Qvain Light form to METAX compatible format"""

from copy import deepcopy
import json
from flask import session
from base64 import urlsafe_b64encode

from etsin_finder.utils import SAML_ATTRIBUTES
from etsin_finder.cr_service import get_catalog_record
from etsin_finder.finder import app
from etsin_finder.authentication import get_user_ida_groups, is_authenticated, get_user_csc_name
from etsin_finder import qvain_light_utils

access_type = {}
access_type["EMBARGO"] = "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo"
access_type["OPEN"] = "http://uri.suomi.fi/codelist/fairdata/access_type/code/open"

log = app.logger

clean_empty_keyvalues_from_dict = qvain_light_utils.clean_empty_keyvalues_from_dict
alter_role_data = qvain_light_utils.alter_role_data
other_identifiers_to_metax = qvain_light_utils.other_identifiers_to_metax
access_rights_to_metax = qvain_light_utils.access_rights_to_metax
remote_resources_data_to_metax = qvain_light_utils.remote_resources_data_to_metax

def data_to_metax(data, metadata_provider_org, metadata_provider_user):
    """Converts all the data from the frontend to conform to Metax schema.

    Arguments:
        data (dict): All form data sent from the frontend.
        metadata_provider_org (str): The name of the metadata providers organisation taken from authentication information.
        metadata_provider_user (str): The name of the metadata provider taken from authentication information.

    Returns:
        dict: Returns an object that has been validated and should conform to Metax schema and is ready to be sent to Metax.

    """
    # Should be same as v1 in but without files and directories, so reuse the old version
    data["files"] = []
    data["directories"] = []
    dataset_data = qvain_light_utils.data_to_metax(data, metadata_provider_org, metadata_provider_user)
    return dataset_data

get_encoded_access_granter = qvain_light_utils.get_encoded_access_granter
get_dataset_creator = qvain_light_utils.get_dataset_creator

def check_dataset_creator(cr_id):
    """Verify that user is authenticated and can edit the dataset.

    Arguments:
        cr_id (str): Identifier of datset.

    Returns:
        error {tuple}: Reason (message, status_code) for failed verification. Returns None if verification was successful.

    """
    is_authd = is_authenticated()
    if not is_authd:
        return {"PermissionError": "User not logged in."}, 401
    csc_username = get_user_csc_name()
    creator = get_dataset_creator(cr_id)
    if csc_username != creator:
        log.warning('User: \"{0}\" is not the creator of the dataset. Editing not allowed.'.format(csc_username))
        return {"PermissionError": "User is not allowed to edit the dataset."}, 403
    return None

remove_deleted_datasets_from_results = qvain_light_utils.remove_deleted_datasets_from_results

def edited_data_to_metax(data, original):
    """Alter the research_dataset field to contain the new changes from editing.

    Arguments:
        data (dict): Data from frontend.
        original (dict): Original data that the dataset contained before editing.

    Returns:
        Metax ready data.

    """
    # Should be same as v1 in but without files and directories, so reuse the old version
    data["files"] = []
    data["directories"] = []
    dataset_data = qvain_light_utils.edited_data_to_metax(data, original)
    if "cumulativeState" in data:
        dataset_data["cumulative_state"] = data.get("cumulativeState")
    return dataset_data


get_user_ida_projects = qvain_light_utils.get_user_ida_projects
