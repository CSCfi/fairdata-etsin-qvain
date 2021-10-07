"""Rest api for Qvain LDAP searches."""
import json
from etsin_finder.services.ldap_service import LDAPIdmService
from etsin_finder.utils.qvain_utils import (
    check_authentication,
)
from flask import current_app
from flask_restful import reqparse, Resource
from ldap3.utils.conv import escape_filter_chars

from etsin_finder.utils.log_utils import log_request


class SearchUser(Resource):
    """Rest endpoint to get user details for inviting person to edit dataset."""

    def __init__(self):
        """Set up default search details.

        path (str): Default path where are all the users in LDAP tree.
        output (List<str>): Fields to be returned per entry.
        """
        self.parser = reqparse.RequestParser()

        self.PATH = "ou=External,ou=Users,ou=idm,dc=csc,dc=fi"
        self.OUTPUT = ["givenName", "sn", "mail", "uid"]

    @log_request
    def get(self, name):
        """Get user details.

        Arguments:
          name (str): Name to be searched.

        Return:
         (Dict/str(exception)): list<LDAP.Entry> converted to Dict

        """
        error = check_authentication()
        if error is not None:
            return error

        filter = self.parse_filter_from_name(name)

        with LDAPIdmService() as ldap_service:
            response, status = ldap_service.search(self.PATH, filter, self.OUTPUT)

            if status == 500:
                current_app.logger.warning(f"Exception in LDAP search: {str(response)}")
                return str(response), 500

            return response, status

    def parse_filter_from_name(self, name):
        """Transform search field input into LDAP filter.

        Arguments:
        name (str): Search field input.

        Return
          (str): LDAP suitable filter.
        """
        safe_name = escape_filter_chars(name)
        if name == "":
            return ""
        splitted_name = safe_name.split()
        name_part_filters = []

        for idx, name_part in enumerate(splitted_name):
            if idx == len(splitted_name) - 1:
                name_part_filters.append(
                    f"(|(givenName={name_part}*)(sn={name_part}*))"
                )
            else:
                name_part_filters.append(f"(|(givenName={name_part})(sn={name_part}))")

        if len(name_part_filters) == 1:
            name_filter = "".join(name_part_filters)
        else:
            name_filter = f'(&{"".join(name_part_filters)})'

        email_filter = f"(mail={name}*)"
        filter = f"(|{name_filter}{email_filter})"

        return filter
