"""Test suite for LDAP idm."""
from etsin_finder.services.ldap_service import LDAPIdmService
from .basetest import BaseTest
from ldap3 import MOCK_SYNC


class TestLDAP(BaseTest):
    """Testing class for LDAP."""

    def test_LDAP_Service_search(self, app):
        """Make a search and return entries."""
        with app.app_context():
            ldap_service = LDAPIdmService()
            ldap_service.connection.strategy.add_entry(
                "cn=teppo,ou=Users,dc=fake,dc=server",
                {
                    "dn": "cn=teppo,ou=Users,dc=fake,dc=server",
                    "cn": "teppo",
                    "test": "test",
                },
            )

            entries, status = ldap_service.search(
                "ou=Users,dc=fake,dc=server", "(cn=teppo)", ["test"]
            )

            assert entries[0].test == "test"
            assert status == 200
