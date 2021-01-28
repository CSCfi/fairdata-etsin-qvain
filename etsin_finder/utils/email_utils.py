# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Email sending related utils"""
import datetime
import re

from etsin_finder.log import log

from etsin_finder.utils.constants import AGENT_TYPE


def create_email_message_body(pref_id, user_email, user_subject, user_body):
    """Create body for an email message to be sent.

    Arguments:
        pref_id (str): Preferred identifier of dataset.
        user_email (str): The email of the sender.
        user_subject (str): Email subject.
        user_body (str): Email body.

    Returns:
        str: Email message body withall arguments.

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
    """Get email message subject.

    Returns:
        str: Default email message subject.

    """
    return "Message from Etsin / Viesti Etsimestä"


def validate_send_message_request(user_email, user_body, agent_type):
    """Validate request that is done to backend for sending email message.

    Arguments:
        user_email (str): User email address.
        user_body (str): Email message body.
        agent_type (str): The agent type.

    Returns:
        bool: Is it valid.

    """
    if not re.match(r"^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$", user_email):
        log.warning("Reply-to email address not formally valid: {0}".format(user_email))
        return False

    if not AGENT_TYPE.get(agent_type):
        log.warning("Unrecognized agent type")
        return False

    if len(user_body) > 1000:
        log.warning("Body is too long")
        return False

    return True


def get_email_recipient_addresses(catalog_record, agent_type_str):
    """Get email recipient addresses based on agent type.

    Arguments:
        catalog_record (dict): The catalog record.
        agent_type_str (str): Agent type as string.

    Returns:
        Return list of recipient addresses or None if not found.

    """
    rd = catalog_record.get('research_dataset', {})

    agent_type = AGENT_TYPE.get(agent_type_str)

    if agent_type == AGENT_TYPE.get('CREATOR') and rd.get('creator', [{}])[0].get('email', False):
        return get_email_list_for_actor(rd.get('creator'))
    if agent_type == AGENT_TYPE.get('PUBLISHER') and rd.get('publisher', [{}]).get('email', False):
        return get_email_list_for_actor(rd.get('publisher'))
    if agent_type == AGENT_TYPE.get('CONTRIBUTOR') and rd.get('contributor', [{}])[0].get('email', False):
        return get_email_list_for_actor(rd.get('contributor'))
    if agent_type == AGENT_TYPE.get('RIGHTS_HOLDER') and rd.get('rights_holder', [{}])[0].get('email', False):
        return get_email_list_for_actor(rd.get('rights_holder'))
    if agent_type == AGENT_TYPE.get('CURATOR') and rd.get('curator', [{}])[0].get('email', False):
        return get_email_list_for_actor(rd.get('curator'))

    log.error("No email addresses found with given agent type {0}".format(agent_type_str))
    return None


def get_email_info(catalog_record):
    """Get info for frontend about which agent types have email addresses available.

    Arguments:
        catalog_record (dict): The catalog record.

    Returns:
        dict: Dict with bool values for all the agent types if they have email addresses.

    """
    if not catalog_record:
        return None

    ret_obj = {}
    rd = catalog_record.get('research_dataset', None)

    ret_obj.update({AGENT_TYPE.get('CREATOR'): _agent_has_email_address(rd.get('creator', None))})
    ret_obj.update({AGENT_TYPE.get('PUBLISHER'): _agent_has_email_address(rd.get('publisher', None))})
    ret_obj.update({AGENT_TYPE.get('CONTRIBUTOR'): _agent_has_email_address(rd.get('contributor', None))})
    ret_obj.update({AGENT_TYPE.get('RIGHTS_HOLDER'): _agent_has_email_address(rd.get('rights_holder', None))})
    ret_obj.update({AGENT_TYPE.get('CURATOR'): _agent_has_email_address(rd.get('curator', None))})

    return ret_obj


def get_harvest_info(catalog_record):
    """Is catalog record harvested.

    Returns True if dataset was harvested from a third party source

    Arguments:
        catalog_record (dict): The catalog record.

    Returns:
        bool: Is the cr harvested.

    """
    return catalog_record.get('data_catalog.catalog_json.harvested', False)


def _agent_has_email_address(agent_obj):
    """Check if agent has email

    Arguments:
        agent_obj (list/dict): The specified field from the research dataset. If publisher then dict else list

    Returns:
        bool: True if has emails, False if not.

    """
    if agent_obj:
        if isinstance(agent_obj, list) and len(agent_obj) > 0:
            return 'email' in agent_obj[0]
        elif isinstance(agent_obj, dict):
            return 'email' in agent_obj
    return False

def get_email_list_for_actor(agents):
    """Return the emails for the specified agents

    Arguments:
        agents (list/dict): The specified field from the research dataset. If publisher then dict else list

    Returns:
        list: List with 1 or more email addresses.

    """
    emails = []
    if isinstance(agents, list) and len(agents) > 0:
        emails = [agent.get('email') for agent in agents if 'email' in agent ]
    elif isinstance(agents, dict):
        emails.append(agents.get('email'))
    return emails
