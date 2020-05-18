"""Utilities for transforming the data from Qvain Light form to METAX compatible format"""

from copy import deepcopy
import json
from flask import session
from base64 import urlsafe_b64encode

from etsin_finder.utils import SAML_ATTRIBUTES
from etsin_finder.cr_service import get_catalog_record
from etsin_finder.finder import app
from etsin_finder.authentication import get_user_ida_groups

access_type = {}
access_type["EMBARGO"] = "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo"
access_type["OPEN"] = "http://uri.suomi.fi/codelist/fairdata/access_type/code/open"

log = app.logger

def clean_empty_keyvalues_from_dict(d):
    """
    Cleans all key value pairs from the object that have empty values, like [], {} and ''.

    Arguments:
        d {object} -- The object to be sent to metax. (might have empty values)

    Returns:
        object  -- Object without the empty values.

    """
    if not isinstance(d, (dict, list)):
        return d
    if isinstance(d, list):
        return [v for v in (clean_empty_keyvalues_from_dict(v) for v in d) if v]
    return {k: v for k, v in ((k, clean_empty_keyvalues_from_dict(v)) for k, v in d.items()) if v}


def alter_role_data(actor_list, role):
    """
    Converts the role data fom the frontend to comply with the Metax schema.

    Arguments:
        actor_list {list} -- A list of all the actors from the frontend.
        role {string} -- The role, can be 'creator', 'publisher', 'curator', 'rights_holder' or 'contributor'.

    Returns:
        list -- List of the actors with the role in question complyant to Metax schema.

    """
    actors = []
    actor_list_with_role = [x for x in actor_list if role in x.get("roles", []) ]
    for actor_object in actor_list_with_role:
        actor_object = deepcopy(actor_object)
        organizations = actor_object.get("organizations", [])

        for org in organizations:
            org["@type"] = "Organization"

        # Convert organization hierarchy array [top_level, ...] to a
        # nested structure {..., is_part_of: { top_level } }
        organization = organizations[0]
        for org in organizations[1:]:
            org["is_part_of"] = organization
            organization = org

        if actor_object["type"] == "person":
            person = actor_object.get("person", {})
            actor = {
                "@type": "Person",
                "name": person.get("name")
            }
            if "email" in person:
                actor["email"] = person.get("email")
            if "identifier" in person:
                actor["identifier"] = person.get("identifier")

            actor["member_of"] = organization
        else:
            actor = organization
        actors.append(actor)
    return actors


def other_identifiers_to_metax(identifiers_list):
    """
    Convert other identifiers to comply with Metax schema.

    Arguments:
        identifiers_list {list} -- List of other identifiers from frontend.

    Returns:
        list -- List of other identifiers that comply to Metax schema.

    """
    other_identifiers = []
    for identifier in identifiers_list:
        id_dict = {}
        id_dict["notation"] = identifier
        other_identifiers.append(id_dict)
    return other_identifiers


def access_rights_to_metax(data):
    """
    Cherry pick access right data from the frontend form data and make it comply with Metax schema.

    Arguments:
        data {object} -- The whole object sent from the frontend.

    Returns:
        object -- Object containing access right object that comply to Metax schema.

    """
    access_rights = {}
    if "license" in data:
        access_rights["license"] = []
        if "identifier" in data["license"] and data["license"]["identifier"] != 'other':
            license_object = {}
            license_object["identifier"] = data["license"]["identifier"]
            access_rights["license"].append(license_object)
        elif "otherLicenseUrl" in data:
            license_object = {}
            license_object["license"] = data["otherLicenseUrl"]
            access_rights["license"].append(license_object)
    if "accessType" in data:
        access_rights["access_type"] = {}
        access_rights["access_type"]["identifier"] = data["accessType"]["url"]
        if data["accessType"]["url"] != access_type["OPEN"]:
            access_rights["restriction_grounds"] = []
            access_rights["restriction_grounds"].append({"identifier": data["restrictionGrounds"]})
        if data["accessType"]["url"] == access_type["EMBARGO"] and "embargoDate" in data:
            access_rights["available"] = data["embargoDate"]
    return access_rights


def remote_resources_data_to_metax(resources):
    """
    Converts external resources from qvain light schema to metax schema.

    Arguments:
        data {object} -- External resources.

    Returns:
        object -- Object containing external resources array that complies with Metax schema.

    """
    metax_remote_resources = []
    for resource in resources:
        metax_remote_resources_object = {}
        metax_remote_resources_object["use_category"] = {}
        metax_remote_resources_object["access_url"] = {}
        metax_remote_resources_object["download_url"] = {}
        metax_remote_resources_object["title"] = resource["title"]
        metax_remote_resources_object["access_url"]["identifier"] = resource["accessUrl"]
        metax_remote_resources_object["download_url"]["identifier"] = resource["downloadUrl"]
        metax_remote_resources_object["use_category"]["identifier"] = resource["useCategory"]["value"]
        metax_remote_resources.append(metax_remote_resources_object)
    return metax_remote_resources


def files_data_to_metax(files):
    """
    Create list of objects that comply to Metax schema

    Arguments:
        files {list} -- List containing the files from frontend (does contain ALL the data).

    Returns:
        list -- List containing objects that conform to Metax schema.

    """
    metax_files = []
    for file in files:
        metax_file_object = {}
        metax_file_object["identifier"] = file["identifier"]
        metax_file_object["title"] = file["title"]
        metax_file_object["description"] = file["description"]
        metax_file_object["file_type"] = file["fileType"] if "fileType" in file else ""
        metax_file_object["use_category"] = file["useCategory"]
        metax_files.append(metax_file_object)
    return metax_files


def directories_data_to_metax(files):
    """
    Create list of objects that comply to Metax schema

    Arguments:
        files {list} -- List containing the directories from frontend (does contain ALL the data).

    Returns:
        list -- List containing objects that conform to Metax schema.

    """
    metax_directories = []
    for file in files:
        metax_directory_object = {}
        metax_directory_object["identifier"] = file["identifier"]
        metax_directory_object["title"] = file["title"]
        metax_directory_object["description"] = file["description"] if "description" in file else ""
        metax_directory_object["use_category"] = file["useCategory"]
        metax_directories.append(metax_directory_object)
    return metax_directories


def data_to_metax(data, metadata_provider_org, metadata_provider_user):
    """
    Converts all the data from the frontend to conform to Metax schema.

    Arguments:
        data {object} -- All form data sent from the frontend.
        metadata_provider_org {string} -- The name of the metadata providers organisation taken from authentication information.
        metadata_provider_user {string} -- The name of the metadata provider taken from authentication information.

    Returns:
        object -- Returns an object that has been validated and should conform to Metax schema and is ready to be sent to Metax.

    """
    publisher_array = alter_role_data(data["actors"], "publisher")
    dataset_data = {
        "metadata_provider_org": metadata_provider_org,
        "metadata_provider_user": metadata_provider_user,
        "data_catalog": data["dataCatalog"],
        "cumulative_state": data["cumulativeState"],
        "research_dataset": {
            "title": data["title"],
            "description": data["description"],
            "creator": alter_role_data(data["actors"], "creator"),
            "publisher": publisher_array[0] if publisher_array else {},
            "curator": alter_role_data(data["actors"], "curator"),
            "rights_holder": alter_role_data(data["actors"], "rights_holder"),
            "contributor": alter_role_data(data["actors"], "contributor"),
            "issued": data["issuedDate"] if "issuedDate" in data else "",
            "other_identifier": other_identifiers_to_metax(data["identifiers"]),
            "field_of_science": _to_metax_field_of_science(data.get("fieldOfScience")),
            "keyword": data["keywords"],
            "access_rights": access_rights_to_metax(data),
            "remote_resources": remote_resources_data_to_metax(data["remote_resources"]) if data["dataCatalog"] == "urn:nbn:fi:att:data-catalog-att" else "",
            "files": files_data_to_metax(data["files"]) if data["dataCatalog"] == "urn:nbn:fi:att:data-catalog-ida" else "",
            "directories": directories_data_to_metax(data["directories"]) if data["dataCatalog"] == "urn:nbn:fi:att:data-catalog-ida" else "",
            "infrastructure": data.get("infrastructure")
        }
    }
    return clean_empty_keyvalues_from_dict(dataset_data)

def get_encoded_access_granter():
    """Add REMS metadata as base64 encoded json. Uses data from user session."""
    saml = session["samlUserdata"]
    metadata_provider_user = saml[SAML_ATTRIBUTES["CSC_username"]][0]
    email = saml[SAML_ATTRIBUTES["email"]][0]
    name = "{} {}".format(
        saml[SAML_ATTRIBUTES["first_name"]][0],
        saml[SAML_ATTRIBUTES["last_name"]][0]
    )
    access_granter = {
        "userid": metadata_provider_user,
        "email": email,
        "name": name
    }
    access_granter_json = json.dumps(access_granter)
    return urlsafe_b64encode(access_granter_json.encode('utf-8'))

def get_dataset_creator(cr_id):
    """
    Get creator of dataset.

    Arguments:
        cr_id {string} -- Identifier of datset.

    Returns:
        [type] -- [description]

    """
    dataset = get_catalog_record(cr_id, False)
    return dataset['metadata_provider_user']

def remove_deleted_datasets_from_results(result):
    """
    Remove datasets marked as removed from results.

    Arguments:
        result {object} -- Results with all datasets.

    Returns:
        [object] -- Results where removed datasets are removed.

    """
    new_results = [dataset for dataset in result['results'] if dataset['removed'] is False]
    result['results'] = new_results
    return result

def _to_metax_field_of_science(fieldsOfScience):
    metax_fields_of_science = []
    for element in fieldsOfScience:
        metax_field_of_science_object = {'identifier': element }
        metax_fields_of_science.append(metax_field_of_science_object)
    return metax_fields_of_science


def _to_metax_infrastructure(infrastructures):
    metax_infrastructures = []
    for element in infrastructures:
        metax_infrastructure_object = {'identifier': element.get("url")}
        metax_infrastructures.append(metax_infrastructure_object)
    return metax_infrastructures


def edited_data_to_metax(data, original):
    """
    Alter the research_dataset field to contain the new changes from editing.

    Arguments:
        data {object} -- Data from frontend.
        original {object} -- Original data that the dataset contained befor editing.

    Returns:
        [object] -- Metax ready data.

    """
    publisher_array = alter_role_data(data["actors"], "publisher")
    research_dataset = original["research_dataset"]
    log.info(research_dataset)
    research_dataset.update({
        "title": data["title"],
        "description": data["description"],
        "creator": alter_role_data(data["actors"], "creator"),
        "publisher": publisher_array[0] if publisher_array else {},
        "curator": alter_role_data(data["actors"], "curator"),
        "rights_holder": alter_role_data(data["actors"], "rights_holder"),
        "contributor": alter_role_data(data["actors"], "contributor"),
        "issued": data["issuedDate"] if "issuedDate" in data else "",
        "other_identifier": other_identifiers_to_metax(data["identifiers"]),
        "field_of_science": _to_metax_field_of_science(data.get("fieldOfScience")),
        "keyword": data["keywords"],
        "access_rights": access_rights_to_metax(data),
        "remote_resources": remote_resources_data_to_metax(data["remote_resources"]) if data["dataCatalog"] == "urn:nbn:fi:att:data-catalog-att" else "",
        "files": files_data_to_metax(data["files"]) if data["dataCatalog"] == "urn:nbn:fi:att:data-catalog-ida" else "",
        "directories": directories_data_to_metax(data["directories"]) if data["dataCatalog"] == "urn:nbn:fi:att:data-catalog-ida" else "",
        "infrastructure": _to_metax_infrastructure(data.get("infrastructure"))
    })
    edited_data = {
        "research_dataset": research_dataset
    }
    return clean_empty_keyvalues_from_dict(edited_data)

def get_user_ida_projects():
    """
    List IDA projects for current user without the prefix.

    Returns:
        list(str) -- List of projects.

    """
    user_ida_groups = get_user_ida_groups()
    if user_ida_groups is None:
        log.error('Could not get user IDA projects.\n')
        return None

    try:
        return [project.split(":")[1] for project in user_ida_groups]
    except IndexError as e:
        log.error('Index error while parsing user IDA projects:\n{0}'.format(e))
        return None


def check_if_data_in_user_IDA_project(data):
    """
    Check if the user creating a dataset belongs to the project that the files/folders belongs to.

    Arguments:
        data {object} -- The dataset that the user is trying to create.

    Returns:
        [bool] -- True if data belongs to user, and False is not.

    """
    user_ida_projects = get_user_ida_groups()
    try:
        user_ida_projects_ids = [project.split(":")[1] for project in user_ida_projects]
    except IndexError as e:
        log.error('Index error while parsing user IDA projects:\n{0}'.format(e))
        return False
    if not user_ida_projects:
        log.warning('Could not get user IDA groups.')
        return False
    log.debug('User IDA groups: {0}'.format(user_ida_projects_ids))
    # Add the test project 'project_x' for local development.
    user_ida_projects_ids.append("project_x")
    if "files" or "directories" in data:
        files = data["files"] if "files" in data else []
        directories = data["directories"] if "directories" in data else []
        if files:
            for file in files:
                identifier = file["projectIdentifier"]
                if identifier not in user_ida_projects_ids:
                    log.warning('File projectIdentifier not in user projects.\nidentifier: {0}, user_ida_projects_ids: {1}'
                                .format(identifier, user_ida_projects_ids))
                    return False
        if directories:
            for directory in directories:
                identifier = directory["projectIdentifier"]
                if identifier not in user_ida_projects_ids:
                    log.warning('Directory projectIdentifier not in user projects.\nidentifier: {0}, user_ida_projects_ids: {1}'
                                .format(identifier, user_ida_projects_ids))
                    return False
    return True
