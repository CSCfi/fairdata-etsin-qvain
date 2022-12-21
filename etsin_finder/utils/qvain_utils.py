"""Utilities for transforming the data from the Qvain form to METAX compatible format."""

import re
from copy import deepcopy
from datetime import date
from etsin_finder import auth

from etsin_finder.utils.abort import abort
from etsin_finder.utils.constants import DATA_CATALOG_IDENTIFIERS, ACCESS_TYPES
from etsin_finder.services import cr_service, qvain_lock_service
from etsin_finder.utils.flags import flag_enabled

from etsin_finder.log import log
from etsin_finder.auth import authentication, authorization
from etsin_finder.schemas.qvain_dataset_schema import data_catalog_matcher


def clean_empty_keyvalues_from_dict(d):
    """Clean all key value pairs from the object that have empty values, like [], {} and ''.

    Arguments:
        d (dict): The object to be sent to metax. (might have empty values)

    Returns:
        dict: Object without the empty values.

    """
    if not isinstance(d, (dict, list)):
        return d
    if isinstance(d, list):
        return [
            v
            for v in (clean_empty_keyvalues_from_dict(v) for v in d)
            if v or v is False
        ]
    return {
        k: v
        for k, v in ((k, clean_empty_keyvalues_from_dict(v)) for k, v in d.items())
        if v or v is False
    }


def alter_projects_to_metax(projects):
    """Convert project objects from frontend to comply with the Metax schema.

    Arguments:
        project (list<dict>): List of project objects, containing details and organizations

    Returns:
        list<dict>: List of project objects in Metax schema

    """
    output = []
    for project in projects:
        details = project.get("details", {})
        metax_project = {
            "name": details.get("title"),
            "identifier": details.get("identifier"),
            "has_funder_identifier": details.get("fundingIdentifier"),
            "funder_type": details.get("funderType"),
            "source_organization": project.get("organizations", []),
            "has_funding_agency": project.get("fundingAgencies", []),
        }
        output.append(metax_project)
    return output


def data_to_metax(data, metadata_provider_org, metadata_provider_user):
    """Convert all the data from the frontend to conform to Metax schema.

    Arguments:
        data (dict): All form data sent from the frontend.
        metadata_provider_org (str): The name of the metadata providers organisation taken from authentication information.
        metadata_provider_user (str): The name of the metadata provider taken from authentication information.

    Returns:
        dict: Returns an Dictionary that has been validated and should conform to Metax schema and is ready to be sent to Metax.

    """
    dataset_data = {
        "metadata_provider_org": metadata_provider_org,
        "metadata_provider_user": metadata_provider_user,
        "data_catalog": data.get("dataCatalog"),
        "cumulative_state": data.get("cumulativeState"),
        "research_dataset": {
            "title": data.get("title"),
            "description": data.get("description"),
            "creator": data.get("creator"),
            "publisher": data.get("publisher"),
            "curator": data.get("curator"),
            "rights_holder": data.get("rights_holder"),
            "contributor": data.get("contributor"),
            "issued": data.get("issued", date.today().strftime("%Y-%m-%d")),
            "other_identifier": data.get("other_identifier"),
            "field_of_science": data.get("field_of_science"),
            "language": data.get("language"),
            "keyword": data.get("keywords"),
            "theme": data.get("theme"),
            "access_rights": data.get("access_rights"),
            "remote_resources": data.get("remote_resources"),
            "is_output_of": data.get("is_output_of"),
            "relation": data.get("relation"),
            "provenance": data.get("provenance"),
            "infrastructure": data.get("infrastructure"),
            "spatial": data.get("spatial"),
            "temporal": data.get("temporal"),
            "modified": data.get("modified"),
        },
    }
    return clean_empty_keyvalues_from_dict(dataset_data)


def get_access_granter():
    """Return access granter object for current user."""
    metadata_provider_user = authentication.get_user_csc_name()
    email = authentication.get_user_email()
    name = "{} {}".format(
        authentication.get_user_firstname(), authentication.get_user_lastname()
    )
    access_granter = {"userid": metadata_provider_user, "email": email, "name": name}
    return access_granter


def get_dataset_creator(cr_id):
    """Get creator of dataset.

    Arguments:
        cr_id (str): Identifier of datset.

    Returns:
        str: The metadata_provider_user value.

    """
    dataset = cr_service.get_catalog_record(cr_id, False)
    if not dataset:
        return None
    return dataset.get("metadata_provider_user")


def check_authentication():
    """Verify that current user is authenticated and has a CSC user name.

    Returns:
        error {tuple}: Reason (message, status_code) for failed verification. Returns None if verification was successful.

    """
    is_authd = authentication.is_authenticated()
    if not is_authd:
        return {"PermissionError": "User not logged in."}, 401

    csc_username = authentication.get_user_csc_name()
    if not csc_username:
        return {"PermissionError": "Missing user CSC identifier."}, 401

    return None


def check_dataset_edit_permission(cr_id):
    """Verify that current user is authenticated and can edit the dataset in Qvain.

    Arguments:
        cr_id (str): Identifier of dataset.

    Returns:
        error {tuple}: Reason (message, status_code) for failed verification. Returns None if verification was successful.

    """
    error = check_authentication()
    if error:
        return error

    user_denied_response = (
        {
            "PermissionError": "Dataset does not exist or user is not allowed to edit the dataset."
        },
        403,
    )

    cr = cr_service.get_catalog_record(cr_id, False)
    if cr is None:
        log.warning(f'Dataset "{cr_id}" not found. Editing not allowed.')
        return user_denied_response

    if not authorization.user_has_edit_access(cr_id):
        csc_username = authentication.get_user_csc_name()
        log.warning(
            f'User: "{csc_username}" is not an editor of the dataset. Editing not allowed.'
        )
        return user_denied_response

    catalog_identifier = (
        cr.get("data_catalog", {}).get("catalog_json", {}).get("identifier")
    )
    if not re.match(data_catalog_matcher, catalog_identifier):
        log.warning(
            f"Catalog {catalog_identifier} is not supported by Qvain. Editing not allowed."
        )
        return {
            "PermissionError": f"Editing datasets from catalog {catalog_identifier} is not supported by Qvain."
        }, 403
    return None


def check_dataset_edit_permission_and_lock(cr_id):
    """Check dataset permission and request write lock."""
    err = check_dataset_edit_permission(cr_id)
    if err:
        return err

    if flag_enabled("PERMISSIONS.WRITE_LOCK"):
        lock_service = qvain_lock_service.QvainLockService()
        success, data = lock_service.request_lock(cr_id)
        if not success:
            log.warning(f"Failed to get lock for dataset {cr_id}.")
            return {"PermissionError": "Dataset is locked for editing."}, 409
    return None


def edited_data_to_metax(data, original):
    """Alter the research_dataset field to contain the new changes from editing.

    Arguments:
        data (dict): Data from frontend.
        original (dict): Original data that the dataset contained before editing.

    Returns:
        Metax ready data.

    """
    research_dataset = original["research_dataset"]

    research_dataset.update(
        {
            "title": data.get("title"),
            "description": data.get("description"),
            "creator": data.get("creator"),
            "publisher": data.get("publisher"),
            "curator": data.get("curator"),
            "rights_holder": data.get("rights_holder"),
            "contributor": data.get("contributor"),
            "issued": data.get("issued", date.today().strftime("%Y-%m-%d")),
            "other_identifier": data.get("other_identifier"),
            "field_of_science": data.get("field_of_science"),
            "language": data.get("language"),
            "keyword": data.get("keywords"),
            "theme": data.get("theme"),
            "access_rights": data.get("access_rights"),
            "remote_resources": data.get("remote_resources"),
            "infrastructure": data.get("infrastructure"),
            "spatial": data.get("spatial"),
            "is_output_of": data.get("is_output_of"),
            "relation": data.get("relation"),
            "provenance": data.get("provenance"),
            "temporal": data.get("temporal"),
            "modified": data.get("modified"),
        }
    )
    edited_data = {
        "data_catalog": data.get("dataCatalog", None),
        "research_dataset": research_dataset,
        "use_doi_for_published": data.get("useDoi"),
    }
    if "cumulativeState" in data:
        edited_data["cumulative_state"] = data.get("cumulativeState")
    return clean_empty_keyvalues_from_dict(edited_data)


def check_if_data_in_user_IDA_project(data):
    """Check if the user creating a dataset belongs to the project that the files/folders belongs to.

    Arguments:
        data (dict): The dataset that the user is trying to create.

    Returns:
        bool: True if data belongs to user, and False is not.

    """
    user_ida_projects = authentication.get_user_ida_projects()

    # If user_ida_projects do not exist, there cannot be any data permission violations, so return True in this case
    if user_ida_projects is None:
        return True

    if not user_ida_projects:
        log.warning("Could not get user IDA projects.")
        return False
    log.debug("User IDA projects: {0}".format(user_ida_projects))
    if "files" or "directories" in data:
        files = data.get("files") if "files" in data else []
        directories = data.get("directories") if "directories" in data else []
        if files:
            for file in files:
                identifier = file.get("projectIdentifier")
                if identifier not in user_ida_projects:
                    log.warning(
                        "File projectIdentifier not in user projects.\nidentifier: {0}, user_ida_projects: {1}".format(
                            identifier, user_ida_projects
                        )
                    )
                    return False
        if directories:
            for directory in directories:
                identifier = directory.get("projectIdentifier")
                if identifier not in user_ida_projects:
                    log.warning(
                        "Directory projectIdentifier not in user projects.\nidentifier: {0}, user_ida_projects: {1}".format(
                            identifier, user_ida_projects
                        )
                    )
                    return False
    return True


def add_sources(datasets, *sources):
    """Attach source information to datasets in list.

    A source can be string or a function that inputs a dataset and returns a string.
    """
    for dataset in datasets:
        dataset["sources"] = [
            source(dataset) if callable(source) else source for source in sources
        ]


def get_editor_source_func(user):
    """Return function that determines if user is creator or editor of a dataset."""

    def _func(dataset):
        if dataset.get("metadata_provider_user") == user:
            return "creator"
        return "editor"

    return _func


def merge_and_sort_dataset_lists(*lists):
    """Merge multiple lists of datasets, remove duplicates and sort by newest."""
    datasets_by_id = {}
    for lst in lists:
        for dataset in lst:
            cr_id = dataset.get("id")
            if not datasets_by_id.get(cr_id):
                datasets_by_id[cr_id] = {**dataset}
            elif dataset.get("sources"):
                sources = datasets_by_id[cr_id].get("sources", [])
                sources.extend(dataset.get("sources"))
                datasets_by_id[cr_id]["sources"] = sources

    datasets = sorted(
        datasets_by_id.values(), key=lambda cr: cr.get("date_created"), reverse=True
    )
    return datasets


def metax_userpermissions_as_dict(users):
    """Convert list of user permissions to dict with username as key."""
    return {user.get("user_id"): {"role": user.get("role")} for user in users}


def ldap_users_as_dict(users):
    """Convert list of ldap users to dict with username as key."""
    return {user.get("uid"): {**user} for user in users}


def merge_metax_and_ldap_user_data(usernames, project_users, metax_data, ldap_data):
    """Combine user data from Metax with data from LDAP.

    Arguments:
        usernames (list): List of usernames.
        project_users (list): List of usernames belonging to project.
        metax_data (list): List of user permission dicts.
        ldap_data (list): List of LDAP user dicts.

    """
    usernames = sorted(usernames)
    metax_user_data_as_dict = metax_userpermissions_as_dict(metax_data)
    ldap_user_data_as_dict = ldap_users_as_dict(ldap_data)
    users = [
        {
            "uid": username,
            "is_project_member": username in project_users,
            **metax_user_data_as_dict.get(username, {}),
            **ldap_user_data_as_dict.get(username, {}),
        }
        for username in usernames
    ]
    return users


def abort_on_fail(response_and_status):
    """Abort if status in (response, status) contains a non-ok response HTTP status code."""
    response, status = response_and_status
    if status not in (200, 201, 204):
        abort(status, message=response)
    return response
