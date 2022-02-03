# This file is part of the Etsin service
#
# Copyright 2017-2021 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Service for LDAP idm. Mainly used by Qvain."""

from flask_restful import abort
from ldap3.core.exceptions import LDAPInvalidFilterError
import marshmallow
from ldap3 import Server, Connection, SYNC, MOCK_SYNC
from ldap3.utils.conv import escape_filter_chars
from ldap3.utils.dn import parse_dn
from flask import current_app
from etsin_finder.schemas.services import LDAPIdmServiceConfigurationSchema
from etsin_finder.services.base_service import BaseService, ConfigValidationMixin
from etsin_finder.app_config import get_ldap_config
from etsin_finder.log import log

strategy_map = {"SYNC": SYNC, "MOCK_SYNC": MOCK_SYNC}


class LDAPIdmService(BaseService, ConfigValidationMixin):
    """Class for LDAP Idm service."""

    PROJECT_PATH = "ou=Projects,ou=idm,dc=csc,dc=fi"
    PROJECT_OUTPUT = ["member"]
    USERS_PATH = "ou=Academic,ou=External,ou=Users,ou=idm,dc=csc,dc=fi"
    USERS_OUTPUT = ["givenName", "sn", "mail", "uid"]

    schema = LDAPIdmServiceConfigurationSchema(unknown=marshmallow.RAISE)

    def __init__(self):
        """Set up LDAP.

        Attributes:
            post_process (str): defines how the response is processed.
        """
        self.server = None
        self.connection = None
        if not self.validate_config(False):
            return

        self.server = Server(self.config.get("HOST"), use_ssl=True)
        strategy_str = self.config.get("STRATEGY", SYNC)

        self.connection = Connection(
            self.server,
            self.config.get("BIND"),
            self.config.get("PASSWORD"),
            client_strategy=strategy_map.get(strategy_str),
        )

    def __enter__(self):
        """Open connection and access service via context manager."""
        if self.connection is None:
            log.error("Cannot establish LDAP connection.")
            abort(503, message="Cannot establish LDAP connection")
        self.connection.open()
        return self

    def __exit__(self, exception_type, exception_value, exception_traceback):
        """Close connection on exit of context manager."""
        if self.connection is None:
            log.error("Cannot establish LDAP connection.")
            abort(503, message="Cannot establish LDAP connection")
        self.connection.unbind()

    @property
    def config(self):
        """Get LDAP idm configuration."""
        return get_ldap_config(current_app)

    def _search(self, path, filter, output):
        """Search from path using filter conditions anf return output fields.

        Arguments:
          path (str): General path in LDAP format eg. ou=Users,dc=example,dc=com
          filter (str): Filter conditions in LDAP format
          output (List<str>): Output fields.
        """
        if self.connection is None:
            return "LDAP connection is not configured.", 503
        if self.connection.closed:
            return "LDAP connection is not open.", 503

        try:
            self.connection.search(path, filter, attributes=output)
            return self.connection.entries, 200
        except LDAPInvalidFilterError as e:
            current_app.logger.error(f"LDAP search failed: {e.__repr__()}")
            return "Search failed due to invalid filter.", 403
        except Exception as e:
            current_app.logger.error(f"LDAP search failed: {e.__repr__()}")
            return "Search failed due to an error.", 500

    def _entries_to_members_usernames(self, entries):
        """Convert LDAP project member attribute to list of usernames"""
        dns = []
        for entry in entries:
            dns.extend(entry.entry_attributes_as_dict.get("member"))
        uids = []
        for dn in dns:
            for attr, value, sep in parse_dn(dn):
                if attr.lower() == "cn":
                    uids.append(value)
                    break
        return uids

    def _entries_to_users(self, entries):
        """Return person result as dict with name, uid and email."""
        users = []
        for entry in entries:
            as_dict = entry.entry_attributes_as_dict
            name_parts = as_dict.get("givenName", []) + as_dict.get("sn", []) or None
            name = " ".join(name_parts)
            user = {
                "name": name,
                "uid": next(iter(as_dict.get("uid")), None),
                "email": next(iter(as_dict.get("mail")), None),
            }
            users.append(user)
        return users

    def _create_project_filter(self, project_id):
        """Return LDAP filter for getting correct project."""
        safe_id = escape_filter_chars(project_id)
        return f"(&(cn={safe_id})(objectClass=CSCProject))"

    def _create_person_search_filter(self, search_str):
        """Transform search field input into LDAP filter.

        Arguments:
            search_str (str): Search field input containing name, email or username.

        """
        safe_str = search_str.replace(",", "")
        safe_str = safe_str.strip()
        safe_str = escape_filter_chars(safe_str)
        if safe_str == "":
            return ""

        splitted_name = safe_str.split(" ", 5)
        name_part_filters = []

        for i in range(len(splitted_name)):
            name1 = " ".join(splitted_name[:i])
            name2 = " ".join(splitted_name[i:])
            f = f"(&(givenName={name1}*)(sn={name2}*))(&(givenName={name2}*)(sn={name1}*))"
            name_part_filters.append(f)

        if len(name_part_filters) == 1:
            name_filter = name_part_filters[0]
        else:
            name_filter = f'(|{"".join(name_part_filters)})'

        email_filter = f"(mail={safe_str}*)"
        uid_filter = f"(cn={safe_str}*)"
        filter = f"(&(|{name_filter}{email_filter}{uid_filter})(objectClass=person)(!(nsAccountLock=true)))"

        return filter

    @staticmethod
    def _sorted_users(users):
        """Sort list of user dicts by uid."""
        return sorted(users, key=lambda user: user.get("uid"))

    def search_user(self, search_str):
        """Search user from LDAP.

        Arguments:
            search_str (str): name, username or email

        Returns:
            list of user details (dict)
        """
        filter = self._create_person_search_filter(search_str)
        data, status = self._search(self.USERS_PATH, filter, self.USERS_OUTPUT)
        if status != 200:
            return data, status
        users = self._entries_to_users(data)
        return self._sorted_users(users), status

    def get_users_details(self, usernames):
        """Get details for a list of usernames."

        Arguments:
            project_id (str): Project identifier.

        Returns:
            list of user details (dict)

        """
        uid_filters = [
            f"(cn={escape_filter_chars(username)})" for username in usernames
        ]
        filter = f'(&(|{"".join(uid_filters)})(objectClass=person)(!(nsAccountLock=true)))'
        data, status = self._search(self.USERS_PATH, filter, self.USERS_OUTPUT)
        if status != 200:
            return data, status
        users = self._entries_to_users(data)
        return self._sorted_users(users), status

    def get_project_users(self, project_id):
        """List usernames of project members.

        Arguments:
            project_id (str): Project identifier.

        """
        project_filter = self._create_project_filter(project_id)
        project_response, status = self._search(
            self.PROJECT_PATH, project_filter, self.PROJECT_OUTPUT
        )
        if status != 200:
            return project_response, status
        usernames = self._entries_to_members_usernames(project_response)
        return sorted(usernames), status
