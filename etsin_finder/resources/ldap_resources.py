"""Rest api for Qvain LDAP searches."""
from etsin_finder.services.ldap_service import LDAPIdmService
from etsin_finder.utils.qvain_utils import (
    check_authentication,
)
from flask import current_app
from flask.views import MethodView

from etsin_finder.utils.abort import abort
from etsin_finder.utils.log_utils import log_request
from etsin_finder.utils.flags import flag_enabled


class SearchUser(MethodView):
    """Rest endpoint to get user details for inviting person to edit dataset."""

    def __init__(self):
        """Initialization common for all methods"""
        if not flag_enabled("PERMISSIONS.EDITOR_RIGHTS"):
            abort(405)

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

        with LDAPIdmService() as ldap_service:
            response, status = ldap_service.search_user(name)
            if status != 200:
                current_app.logger.warning(
                    f"Status {status} in LDAP search: {response}"
                )
                abort(status, message=response)
            return response, status
