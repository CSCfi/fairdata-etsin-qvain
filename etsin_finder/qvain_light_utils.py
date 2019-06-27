"""Utilities for transforming the data from Qvain Light form to METAX compatible format"""
access_type = {}
access_type["EMBARGO"] = "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo"
access_type["OPEN"] = "http://uri.suomi.fi/codelist/fairdata/access_type/code/open"

from etsin_finder.cr_service import get_catalog_record

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


def alter_role_data(participant_list, role):
    """
    Converts the role data fom the frontend to comply with the Metax schema.

    Arguments:
        participant_list {list} -- A list of all the participants from the frontend.
        role {string} -- The role, can be 'creator', 'publisher' or 'curator'.

    Returns:
        list -- List of the participants with the role in question complyant to Metax schema.

    """
    participants = []
    participant_list_with_role = [x for x in participant_list if role in x["role"] ]
    for participant_object in participant_list_with_role:
        participant = {}
        participant["member_of"] = {}
        participant["member_of"]["name"] = {}
        if participant_object["type"] == "person":
            participant["@type"] = "Person"
            participant["name"] = participant_object["name"]
            participant["member_of"] = {}
            participant["member_of"]["name"] = {}
            participant["member_of"]["name"]["und"] = participant_object["organization"]
            participant["member_of"]["@type"] = "Organization"
        else:
            participant["@type"] = "Organization"
            participant["name"] = {}
            participant["name"]["und"] = participant_object["name"]
            if "organization" in participant_object and participant_object["organization"] != "":
                participant["is_part_of"] = {}
                participant["is_part_of"]["name"] = {}
                participant["is_part_of"]["name"]["und"] = participant_object["organization"]
                participant["is_part_of"]["@type"] = "Organization"

        if "email" in participant_object:
            participant["email"] = participant_object["email"]
        if "identifier" in participant_object:
            participant["identifier"] = participant_object["identifier"]
        participants.append(participant)
    return participants


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
    access_rights["access_type"] = {}
    access_rights["access_type"]["identifier"] = data["accessType"]["url"]
    access_rights["license"] = []
    if "identifier" in data["license"] and data["license"]["identifier"] != 'other':
        license_object = {}
        license_object["identifier"] = data["license"]["identifier"]
        access_rights["license"].append(license_object)
    elif "otherLicenseUrl" in data:
        license_object = {}
        license_object["license"] = data["otherLicenseUrl"]
        access_rights["license"].append(license_object)
    if data["accessType"]["url"] != access_type["OPEN"]:
        access_rights["restriction_grounds"] = []
        access_rights["restriction_grounds"].append({"identifier": data["restrictionGrounds"]})
    if data["accessType"]["url"] == access_type["EMBARGO"]:
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
    metax_remote_resources_object = {}
    metax_remote_resources_object["use_category"] = {}
    metax_remote_resources_object["access_url"] = {}
    for resource in resources:
        metax_remote_resources_object["title"] = resource["title"]
        metax_remote_resources_object["access_url"]["identifier"] = resource["url"]
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


def data_to_metax(data, metadata_provider_org, metadata_provider_user, data_catalog):
    """
    Converts all the data from the frontend to conform to Metax schema.

    Arguments:
        data {object} -- All form data sent from the frontend.
        metadata_provider_org {string} -- The name of the metadata providers organisation taken from authentication information.
        metadata_provider_user {string} -- The name of the metadata provider taken from authentication information.
        data_catalog {string} -- The correct data catalog value for the dataset taken from the data.

    Returns:
        object -- Returns an object that has been validated and should conform to Metax schema and is ready to be sent to Metax.

    """
    dataset_data = {
        "metadata_provider_org": metadata_provider_org,
        "metadata_provider_user": metadata_provider_user,
        "data_catalog": data_catalog,
        "research_dataset": {
            "title": data["title"],
            "description": data["description"],
            "creator": alter_role_data(data["participants"], "creator"),
            "publisher": alter_role_data(data["participants"], "publisher")[0],
            "curator": alter_role_data(data["participants"], "curator"),
            "other_identifier": other_identifiers_to_metax(data["identifiers"]),
            "field_of_science": [{
                "identifier": data["fieldOfScience"]
            }],
            "keyword": data["keywords"],
            "access_rights": access_rights_to_metax(data),
            "remote_resources": remote_resources_data_to_metax(data["remote_resources"]) if data_catalog == "urn:nbn:fi:att:data-catalog-att" else "",
            "files": files_data_to_metax(data["files"]) if data_catalog == "urn:nbn:fi:att:data-catalog-ida" else "",
            "directories": directories_data_to_metax(data["directories"]) if data_catalog == "urn:nbn:fi:att:data-catalog-ida" else ""
        }
    }
    return clean_empty_keyvalues_from_dict(dataset_data)

def get_dataset_creator(cr_id):
    # get dataset
    dataset = get_catalog_record(cr_id, False)
    return dataset['metadata_provider_user']
  
def remove_deleted_datasets_from_results(result):
    new_results = [dataset for dataset in result['results'] if dataset['removed'] is False]
    result['results'] = new_results
    return result

def sort_datasets_by_date_created(result):
    result['results'] = sorted(result['results'], key=lambda i: i['date_created'], reverse=True)
    return result
