"""Utilities for transforming the data from Qvain form to METAX compatible format"""

from etsin_finder.utils import qvain_utils

clean_empty_keyvalues_from_dict = qvain_utils.clean_empty_keyvalues_from_dict
alter_role_data = qvain_utils.alter_role_data
other_identifiers_to_metax = qvain_utils.other_identifiers_to_metax
access_rights_to_metax = qvain_utils.access_rights_to_metax
remote_resources_data_to_metax = qvain_utils.remote_resources_data_to_metax

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
    dataset_data = qvain_utils.data_to_metax(data, metadata_provider_org, metadata_provider_user)
    return dataset_data

get_encoded_access_granter = qvain_utils.get_encoded_access_granter
get_dataset_creator = qvain_utils.get_dataset_creator
check_dataset_edit_permission = qvain_utils.check_dataset_edit_permission
check_authentication = qvain_utils.check_authentication

remove_deleted_datasets_from_results = qvain_utils.remove_deleted_datasets_from_results

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
    dataset_data = qvain_utils.edited_data_to_metax(data, original)
    if "cumulativeState" in data:
        dataset_data["cumulative_state"] = data.get("cumulativeState")
    return dataset_data
