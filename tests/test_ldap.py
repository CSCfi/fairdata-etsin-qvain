"""Test suite for LDAP idm."""
from etsin_finder.services.ldap_service import LDAPIdmService
from etsin_finder.resources.ldap_resources import SearchUser
from .basetest import BaseTest
from ldap3 import MOCK_SYNC


class TestLDAP(BaseTest):
    """Testing class for LDAP."""

    def test_LDAP_Service_search(self, app):
        """Make a search and return entries."""
        with app.app_context():
            with LDAPIdmService() as ldap_service:
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

            expectedEntries = [
                {
                    "attributes": {"test": ["test"]},
                    "dn": "cn=teppo,ou=Users,dc=fake,dc=server",
                }
            ]

            assert entries == expectedEntries
            assert status == 200

    def test_parse_filter_from_name_two_parts(self):
        """Return correct filter string."""
        name = "Teppo Test"
        expected_filter = "(&(|(&(|(givenName=Teppo)(sn=Teppo))(|(givenName=Test*)(sn=Test*)))(mail=Teppo Test*)(cn=Teppo Test*))(objectClass=person))"
        ldap_resource = SearchUser()
        filter = ldap_resource.parse_filter_from_name(name)

        assert filter == expected_filter
