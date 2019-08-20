# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Email sending related utils"""

import datetime
import re
from enum import Enum


class AgentType(Enum):
    """Types of agents"""

    CREATOR = 'creator'
    PUBLISHER = 'publisher'
    CONTRIBUTOR = 'contributor'
    RIGHTS_HOLDER = 'rights_holder'
    CURATOR = 'curator'


def create_email_message_body(pref_id, user_email, user_subject, user_body):
    """
    Create body for an email message to be sent.

    :param pref_id:
    :param user_email:
    :param user_subject:
    :param user_body:
    :return:
    """
    now = datetime.datetime.now()

    meta_en = ('The message below was sent via Etsin research data finder on {0}.{1}.{2}. '
               'It concerns a dataset with identifier \"{3}\". Please, send your reply to {4}.'
               .format(now.day, now.month, now.year, pref_id, user_email))

    meta_fi = ('Allaoleva viesti on lähetetty Etsin-palvelun kautta {0}.{1}.{2}. Viesti koskee '
               'tutkimusaineistoa, jonka tunniste on \"{3}\". Ole hyvä, lähetä vastauksesi osoitteeseen {4}.'
               .format(now.day, now.month, now.year, pref_id, user_email))

    msg = 'Subject / Aihe: {0}\nMessage / Viesti: {1}'.format(user_subject, user_body)

    return '{0}\n\n{1}\n\n---\n\n{2}'.format(meta_en, meta_fi, msg)


def get_email_message_subject():
    """
    Get email message subject.

    :return:
    """
    return "Message from Etsin / Viesti Etsimestä"


def validate_send_message_request(user_email, user_body, agent_type):
    """
    Validate request that is done to backend for sending email message.

    :param user_email:
    :param user_body:
    :param agent_type:
    :return:
    """
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


def get_email_recipient_addresses(catalog_record, agent_type_str):
    """
    Get email recipient addresses based on agent type.

    :param catalog_record:
    :param agent_type_str: agent_type enum name as string
    :return:
    """
    rd = catalog_record['research_dataset']

    agent_type = AgentType[agent_type_str]

    if agent_type == AgentType.CREATOR and rd.get('creator', False)[0].get('email'):
        return [creator['email'] for creator in rd['creator'] if 'email' in creator ]
    if agent_type == AgentType.PUBLISHER and rd.get('publisher', False).get('email'):
        return [publisher['email'] for publisher in rd['publisher'] if 'email' in publisher ]
    if agent_type == AgentType.CONTRIBUTOR and rd.get('contributor', False)[0].get('email'):
        return [contributor['email'] for contributor in rd['contributor'] if 'email' in contributor ]
    if agent_type == AgentType.RIGHTS_HOLDER and rd.get('rights_holder', False)[0].get('email'):
        return [rights_holder['email'] for rights_holder in rd['rights_holder'] if 'email' in rights_holder ]
    if agent_type == AgentType.CURATOR and rd.get('curator', False)[0].get('email'):
        return [curator['email'] for curator in rd['curator'] if 'email' in curator ]

    from etsin_finder.finder import app
    app.logger.error("No email addresses found with given agent type {0}".format(agent_type_str))
    return None


def get_email_info(catalog_record):
    """
    Get info for frontend about which agent types have email addresses available.

    :param catalog_record:
    :return:
    """
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


def get_harvest_info(catalog_record):
    """
    Is catalog record harvested.

    Returns True if dataset was harvested from a third party source

    :param catalog_record:
    :return:
    """
    return catalog_record.get('data_catalog.catalog_json.harvested', False)


def _agent_has_email_address(agent_obj):
    if agent_obj:
        if isinstance(agent_obj, list) and len(agent_obj) > 0:
            return 'email' in agent_obj[0]
        elif isinstance(agent_obj, dict):
            return 'email' in agent_obj
    return False