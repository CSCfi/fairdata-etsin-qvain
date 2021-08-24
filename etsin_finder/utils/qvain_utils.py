"""Utilities for transforming the data from the Qvain form to METAX compatible format."""

import re
from copy import deepcopy
from datetime import date
from etsin_finder import auth

from etsin_finder.utils.constants import DATA_CATALOG_IDENTIFIERS, ACCESS_TYPES
from etsin_finder.services import cr_service
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


def other_identifiers_to_metax(identifiers_list):
    """Convert other identifiers to comply with Metax schema.

    Arguments:
        identifiers_list (list): List of other identifiers from frontend.

    Returns:
        list: List of other identifiers that comply to Metax schema.

    """
    other_identifiers = []
    for identifier in identifiers_list:
        id_dict = {}
        id_dict["notation"] = identifier
        other_identifiers.append(id_dict)
    return other_identifiers


def access_rights_to_metax(data):
    """Cherry pick access right data from the frontend form data and make it comply with Metax schema.

    Arguments:
        data (dict): The whole object sent from the frontend.

    Returns:
        dict: Dictionary containing access right object that comply to Metax schema.

    """
    access_rights = {}
    access_rights["license"] = []
    license = data.get("license", [])
    for lic in license:
        license_id = lic.get("identifier")
        license_name_en = lic.get("name", {}).get("en") or ""
        if license_id and not license_name_en.startswith("Other (URL)"):
            license_object = {}
            license_object["identifier"] = license_id
            access_rights["license"].append(license_object)
        elif license_id and license_name_en.startswith("Other (URL)"):
            license_object = {}
            license_object["license"] = license_id
            access_rights["license"].append(license_object)

    access_type = data.get("accessType", {})
    access_type_url = access_type.get("url")
    if access_type:
        access_rights["access_type"] = {}
        access_rights["access_type"]["identifier"] = access_type_url
        if data["accessType"]["url"] != ACCESS_TYPES.get("open"):
            access_rights["restriction_grounds"] = []
            access_rights["restriction_grounds"].append(
                {"identifier": data.get("restrictionGrounds")}
            )
        if (
            data["accessType"]["url"] == ACCESS_TYPES.get("embargo") and "embargoDate" in data
        ):
            access_rights["available"] = data.get("embargoDate")
    return access_rights


def remote_resources_data_to_metax(resources):
    """Convert external resources from Qvain schema to Metax schema.

    Arguments:
        data (dict): External resources.

    Returns:
        dict: Dictionary containing external resources array that complies with Metax schema.

    """
    metax_remote_resources = []
    for resource in resources:
        metax_remote_resources_object = {}
        metax_remote_resources_object["use_category"] = {}
        metax_remote_resources_object["access_url"] = {}
        metax_remote_resources_object["download_url"] = {}
        metax_remote_resources_object["title"] = resource.get("title")
        metax_remote_resources_object["access_url"]["identifier"] = resource.get(
            "accessUrl", ""
        )
        metax_remote_resources_object["download_url"]["identifier"] = resource.get(
            "downloadUrl", ""
        )
        metax_remote_resources_object["use_category"]["identifier"] = resource.get(
            "useCategory", {}
        ).get("value")
        metax_remote_resources.append(metax_remote_resources_object)
    return metax_remote_resources


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
            "issued": data.get("issuedDate", date.today().strftime("%Y-%m-%d")),
            "other_identifier": other_identifiers_to_metax(data.get("identifiers")),
            "field_of_science": _to_identifier_objects(data.get("fieldOfScience")),
            "language": _to_identifier_objects(data.get("datasetLanguage")),
            "keyword": data.get("keywords"),
            "theme": _to_identifier_objects(data.get("theme")),
            "access_rights": access_rights_to_metax(data),
            "remote_resources": remote_resources_data_to_metax(
                data.get("remote_resources")
            )
            if data.get("dataCatalog") == DATA_CATALOG_IDENTIFIERS.get("att")
            else "",
            "is_output_of": alter_projects_to_metax(data.get("projects")),
            "relation": data.get("relation"),
            "provenance": data.get("provenance"),
            "infrastructure": _to_metax_infrastructure(data.get("infrastructure")),
            "spatial": data.get("spatial"),
            "temporal": data.get("temporal"),
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

    user_denied_response = ({
        "PermissionError": "Dataset does not exist or user is not allowed to edit the dataset."
    }, 403)

    cr = cr_service.get_catalog_record(cr_id, False)
    if cr is None:
        log.warning(f'Dataset "{cr_id}" not found. Editing not allowed.')
        return user_denied_response

    csc_username = authentication.get_user_csc_name()

    user_is_allowed = False
    creator = cr.get("metadata_provider_user")
    if csc_username == creator:
        user_is_allowed = True

    if flag_enabled('PERMISSIONS.SHARE_PROJECT'):
        if authorization.user_has_dataset_project(cr_id):
            user_is_allowed = True

    if not user_is_allowed:
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


def remove_deleted_datasets_from_results(result):
    """Remove datasets marked as removed from results.

    Arguments:
        result (dict): Results with all datasets.

    Returns:
        dict: Results where removed datasets are removed.

    """
    new_results = [
        dataset for dataset in result.get("results") if dataset.get("removed") is False
    ]
    result["results"] = new_results
    return result


def _to_identifier_objects(array):
    return [{"identifier": identifier} for identifier in array]


def _to_metax_infrastructure(infrastructures):
    metax_infrastructures = []
    for element in infrastructures:
        metax_infrastructure_object = {"identifier": element.get("url")}
        metax_infrastructures.append(metax_infrastructure_object)
    return metax_infrastructures


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
            "issued": data.get("issuedDate", date.today().strftime("%Y-%m-%d")),
            "other_identifier": other_identifiers_to_metax(data.get("identifiers")),
            "field_of_science": _to_identifier_objects(data.get("fieldOfScience")),
            "language": _to_identifier_objects(data.get("datasetLanguage")),
            "keyword": data.get("keywords"),
            "theme": _to_identifier_objects(data.get("theme")),
            "access_rights": access_rights_to_metax(data),
            "remote_resources": remote_resources_data_to_metax(
                data.get("remote_resources")
            )
            if data["dataCatalog"] == DATA_CATALOG_IDENTIFIERS.get("att")
            else "",
            "infrastructure": _to_metax_infrastructure(data.get("infrastructure")),
            "spatial": data.get("spatial"),
            "is_output_of": alter_projects_to_metax(data.get("projects")),
            "relation": data.get("relation"),
            "provenance": data.get("provenance"),
            "temporal": data.get("temporal"),
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
