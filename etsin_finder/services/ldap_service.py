# This file is part of the Etsin service
#
# Copyright 2017-2021 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Service for LDAP idm. Mainly used by Qvain."""

import marshmallow
from ldap3 import Server, Connection, SYNC, MOCK_SYNC
from flask import current_app
from etsin_finder.schemas.services import LDAPIdmServiceConfigurationSchema
from etsin_finder.services.base_service import BaseService, ConfigValidationMixin
from etsin_finder.app_config import get_ldap_config


class LDAPIdmService(BaseService, ConfigValidationMixin):
    """Class for LDAP Idm service."""

    schema = LDAPIdmServiceConfigurationSchema(unknown=marshmallow.RAISE)

    def __init__(self):
        """Set up LDAP."""
        self.server = Server(self.config.get("HOST"), use_ssl=True)
        strategyStr = self.config.get("STRATEGY")
        strategy = SYNC

        if strategyStr == "MOCK_SYNC":
            strategy = MOCK_SYNC

        self.connection = Connection(
            self.server,
            self.config.get("BIND"),
            self.config.get("PASSWORD"),
            client_strategy=strategy,
        )
        self.connection.open()

    @property
    def config(self):
        """Get LDAP idm configuration."""
        return get_ldap_config(current_app)

    def search(self, path, filter, output):
        """Search from path using filter conditions anf return output fields.

        Arguments:
          path (str): General path in LDAP format eg. ou=Users,dc=example,dc=com
          filter (str): Filter conditions in LDAP format
          output (List<str>): Output fields.
        """
        try:
            self.connection.search(path, filter, attributes=output)
            return self.connection.entries, 200
        except Exception as e:
            return e, 500
