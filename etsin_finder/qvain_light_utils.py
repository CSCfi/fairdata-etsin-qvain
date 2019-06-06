import copy

def clean_empty_keyvalues_from_dict(d):
    if not isinstance(d, (dict, list)):
        return d
    if isinstance(d, list):
        return [v for v in (clean_empty_keyvalues_from_dict(v) for v in d) if v]
    return {k: v for k, v in ((k, clean_empty_keyvalues_from_dict(v)) for k, v in d.items()) if v}

def alter_role_data(d, role):
    participant_list = copy.deepcopy(d)
    participants = []
    participant_list_with_role = [x for x in participant_list if role in x["role"] ]
    for dict in participant_list_with_role:
        participant = {}
        participant["member_of"] = {}
        participant["member_of"]["name"] = {}
        if dict["type"] == "person":
            participant["name"] = dict["name"]
            participant["member_of"] = {}
            participant["member_of"]["name"] = {}
            participant["member_of"]["name"]["und"] = dict["organization"]
            participant["member_of"]["@type"] = "Organization"
        else:
            participant["name"] = {}
            participant["name"]["und"] = dict["name"]
            participant["is_part_of"] = {}
            participant["is_part_of"]["name"] = {}
            participant["is_part_of"]["name"]["und"] = dict["organization"]
            participant["is_part_of"]["@type"] = "Organization"

        participant["@type"] = dict["type"]
        participant["email"] = dict["email"]
        participant["identifier"] = dict["identifier"]

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
    access_rights["license"] = {}
    access_rights["license"]["identifier"] = data["license"]
    if data["accessType"] != "http://uri.suomi.fi/codelist/fairdata/access_type/code/open":
        access_rights["restriction_grounds"] = {}
        access_rights["restriction_grounds"]["identifier"] = data["restrictionGrounds"]

    return access_rights
