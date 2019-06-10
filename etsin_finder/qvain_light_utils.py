access_type = {}
access_type["EMBARGO"] = "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo"
access_type["OPEN"] = "http://uri.suomi.fi/codelist/fairdata/access_type/code/open"

def clean_empty_keyvalues_from_dict(d):
    if not isinstance(d, (dict, list)):
        return d
    if isinstance(d, list):
        return [v for v in (clean_empty_keyvalues_from_dict(v) for v in d) if v]
    return {k: v for k, v in ((k, clean_empty_keyvalues_from_dict(v)) for k, v in d.items()) if v}

def alter_role_data(participant_list, role):
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
            participant["is_part_of"] = {}
            participant["is_part_of"]["name"] = {}
            participant["is_part_of"]["name"]["und"] = participant_object["organization"]
            participant["is_part_of"]["@type"] = "Organization"

        participant["email"] = participant_object["email"]
        participant["identifier"] = participant_object["identifier"]
        participants.append(participant)
    return participants

def other_identifiers_to_metax(identifiers_list):
    other_identifiers = []
    for identifier in identifiers_list:
        id_dict = {}
        id_dict["notation"] = identifier
        other_identifiers.append(id_dict)
    return other_identifiers

def access_rights_to_metax(data):
    access_rights = {}
    access_rights["access_type"] = {}
    access_rights["access_type"]["identifier"] = data["accessType"]
    access_rights["license"] = []
    access_rights["license"].append({"identifier": data["license"]})
    if data["accessType"] != access_type["OPEN"]:
        access_rights["restriction_grounds"] = {}
        access_rights["restriction_grounds"]["identifier"] = data["restrictionGrounds"]
    if data["accessType"] == access_type["EMBARGO"]:
        access_rights["available"] = data["embargoDate"]
    return access_rights

def data_to_metax(data, metadata_provider_org, metadata_provider_user):
    dataset_data = {
        "metadata_provider_org": metadata_provider_org,
        "metadata_provider_user": metadata_provider_user,
        "data_catalog": "urn:nbn:fi:att:data-catalog-att",
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
            "access_rights": access_rights_to_metax(data)
        }
    }
    return clean_empty_keyvalues_from_dict(dataset_data)
