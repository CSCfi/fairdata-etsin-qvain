import datetime
import re
from enum import Enum


class AgentType(Enum):
    CREATOR = 'creator'
    PUBLISHER = 'publisher'
    CONTRIBUTOR = 'contributor'
    RIGHTS_HOLDER = 'rights_holder'
    CURATOR = 'curator'


def create_email_message_body(dataset_id, user_email, user_subject, user_body):
    now = datetime.datetime.now()

    meta_en = ('The message below was sent via Etsin research data finder on {0}.{1}.{2}. '
               'It concerns a dataset having identifier \"{3}\". Please, send your reply to {4}.'
               .format(now.day, now.month, now.year, dataset_id, user_email))

    meta_fi = ('Allaoleva viesti on lähetetty Etsin-palvelun kautta {0}.{1}.{2}. Viesti koskee '
               'tutkimusaineistoa, jonka tunniste on \"{3}\". Ole hyvä, lähetä vastauksesi osoitteeseen {4}.'
               .format(now.day, now.month, now.year, dataset_id, user_email))

    msg = 'Subject / Aihe: {0}\nMessage / Viesti: {1}'.format(user_subject, user_body)

    return '{0}\n\n{1}\n\n---\n\n{2}'.format(meta_en, meta_fi, msg)


def get_email_message_subject():
    return "Message from Etsin / Viesti Etsimestä"


def validate_send_message_request(user_email, user_body, agent_type):
    from etsin_finder.finder import app
    log = app.logger

    if not re.match(r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$", user_email):
        log.error("Reply-to email address not formally valid: {0}".format(user_email))
        return False

    try:
        AgentType[agent_type]
    except KeyError:
        log.error("Unrecognized agent type")
        return False

    if len(user_body) > 1000:
        log.error("Body is too long")
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

    ret_obj.update({AgentType.CREATOR.name: _agent_has_email_address(rd.get('creator', None))})
    ret_obj.update({AgentType.PUBLISHER.name: _agent_has_email_address(rd.get('publisher', None))})
    ret_obj.update({AgentType.CONTRIBUTOR.name: _agent_has_email_address(rd.get('contributor', None))})
    ret_obj.update({AgentType.RIGHTS_HOLDER.name: _agent_has_email_address(rd.get('rights_holder', None))})
    ret_obj.update({AgentType.CURATOR.name: _agent_has_email_address(rd.get('curator', None))})

    return ret_obj


def _agent_has_email_address(agent_obj):
    if agent_obj:
        if isinstance(agent_obj, list) and len(agent_obj) > 0:
            return 'email' in agent_obj[0]
        elif isinstance(agent_obj, dict):
            return 'email' in agent_obj
    return False