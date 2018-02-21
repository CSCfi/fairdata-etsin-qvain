import json
import os
import re
from enum import Enum


class AgentType(Enum):
    CREATOR = 'creator'
    PUBLISHER = 'publisher'
    CONTRIBUTOR = 'contributor'
    RIGHTS_HOLDER = 'rights_holder'
    CURATOR = 'curator'


def executing_travis():
    """
    Returns True whenever code is being executed by travis
    """
    return True if os.getenv('TRAVIS', False) else False


def get_elasticsearch_config(config):
    es_conf = config.get('ELASTICSEARCH', None)
    if not es_conf or not isinstance(es_conf, dict):
        return None

    return es_conf


def get_metax_api_config(config):
    metax_api_conf = config.get('METAX_API')
    if not metax_api_conf or not isinstance(metax_api_conf, dict):
        return None

    return metax_api_conf


def write_json_to_file(json_data, filename):
    with open(filename, "w") as output_file:
        json.dump(json_data, output_file)


def write_string_to_file(string, filename):
    with open(filename, "w") as output_file:
        print(f"{string}", file=output_file)


def strip_catalog_record(catalog_record):
    """
    This method should strip catalog record of any confidential/private information not supposed to be sent for
    the frontend.

    :param catalog_record:
    :return:
    """
    return _remove_keys(catalog_record, ['email', 'telephone', 'phone'])


def _remove_keys(obj, rubbish):
    if isinstance(obj, dict):
        obj = {
            key: _remove_keys(value, rubbish) for key, value in obj.items() if key not in rubbish
        }
    elif isinstance(obj, list):
        obj = [
            _remove_keys(item, rubbish) for item in obj if item not in rubbish
        ]
    return obj


def validate_send_message_request(sender, subject, body, agent_type):
    from etsin_finder.finder import app
    log = app.logger

    if not sender or not re.match(r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$", sender):
        log.error("Sender email address not formally valid")
        return False

    try:
        AgentType[agent_type]
    except KeyError:
        log.error("Unrecognized agent type")
        return False

    if not subject:
        log.error("Subject must be given")
        return False

    if not body or len(body) > 1000:
        log.error("Either body is not given or body is too long")
        return False

    return True


def get_email_recipient_address(catalog_record, agent_type_str):
    """

    :param catalog_record:
    :param agent_type_str: agent_type enum name as string
    :return:
    """
    from etsin_finder.finder import app
    log = app.logger

    rd = catalog_record['research_dataset']
    agent_type = AgentType[agent_type_str]

    if agent_type == AgentType.CREATOR and rd.get('creator', False)[0].get('email'):
        return rd['creator'][0]['email']
    if agent_type == AgentType.PUBLISHER and rd.get('publisher', False).get('email'):
        return rd['publisher']['email']
    if agent_type == AgentType.CONTRIBUTOR and rd.get('contributor', False)[0].get('email'):
        return rd['contributor'][0]['email']
    if agent_type == AgentType.RIGHTS_HOLDER and rd.get('rights_holder', False).get('email'):
        return rd['rights_holder']['email']
    if agent_type == AgentType.CURATOR and rd.get('curator', False)[0].get('email'):
        return rd['curator'][0]['email']

    log.error("No email address found with given agent type {0}".format(agent_type_str))
    return None


def get_email_info(catalog_record):
    if not catalog_record:
        return None

    ret_obj = {}
    rd = catalog_record.get('research_dataset', None)

    creator = rd.get('creator', None)
    if creator:
        ret_obj.update({AgentType.CREATOR.name: _agent_has_email_address(creator)})

    publisher = rd.get('publisher', None)
    if publisher:
        ret_obj.update({AgentType.PUBLISHER.name: _agent_has_email_address(publisher)})

    contributor = rd.get('contributor', None)
    if contributor:
        ret_obj.update({AgentType.CONTRIBUTOR.name: _agent_has_email_address(contributor)})

    rights_holder = rd.get('rights_holder', None)
    if rights_holder:
        ret_obj.update({AgentType.RIGHTS_HOLDER.name: _agent_has_email_address(rights_holder)})

    curator = rd.get('curator', None)
    if curator:
        ret_obj.update({AgentType.CURATOR.name: _agent_has_email_address(curator)})

    return ret_obj


def _agent_has_email_address(agent_obj):
    if isinstance(agent_obj, list) and len(agent_obj) > 0:
        return 'email' in agent_obj[0]
    elif isinstance(agent_obj, dict):
        return 'email' in agent_obj
    return False