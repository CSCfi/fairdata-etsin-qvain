"""Rest api for Qvain LDAP searches."""

from etsin_finder.services.ldap_service import LDAPIdmService
from etsin_finder.utils.qvain_utils import (
    check_authentication,
    check_dataset_edit_permission,
)
from flask import current_app
from flask_restful import reqparse, Resource

from etsin_finder.utils.log_utils import log_request
from etsin_finder.auth import authentication


class QvainUser(Resource):
    """Rest endpoint to get user details for inviting person to edit dataset."""

    def __init__(self):
        """Set up default search details.

        path (str): Default path where are all the users in LDAP tree.
        output (List<str>): Fields to be returned per entry.
        """
        self.PATH = "ou=External,ou=Users,ou=idm,dc=csc,dc=fi"
        self.OUTPUT = ["givenName", "sn", "mail", "uid"]

    @log_request
    def get(self):
        """Get user details.

        Arguments:
          name (str): Name to be searched.

        Return:
         (Dict/str(exception)): list<LDAP.Entry> converted to Dict

        """
        error = check_authentication()
        if error is not None:
            return error

        name = self.parser.parse_args().get("name", "")
        filter = self.parse_filter_from_name(name)
        ldap_service = LDAPIdmService()

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
        if name == "":
            return ""

        splitted_name = name.split()
        name_part_filters = []

        for idx, name_part in enumerate(splitted_name):
            if idx == len(splitted_name) - 1:
                name_part_filters.append(
                    f"(|(givenName=*{name_part}*)(sn=*{name_part}*))"
                )
            else:
                name_part_filters.append(
                    f"(|(givenName=*{name_part})(sn=*{name_part}))"
                )

        if len(name_part_filters) == 1:
            name_filter = "".join(name_part_filters)
        else:
            name_filter = f'(&{"".join(name_part_filters)})'

        email_filter = f"(mail={name}*)"
        filter = f"(|{name_filter}{email_filter})"

        return filter
