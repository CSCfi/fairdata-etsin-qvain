"""Test suite for LDAP idm."""
import pytest
from unittest.mock import MagicMock

from etsin_finder.utils.flags import set_flags
from etsin_finder.services.ldap_service import LDAPIdmService
from .basetest import BaseTest
from ldap3 import MOCK_SYNC


class ExceptionTest(Exception):
    """Exception for testing."""

    pass


def createMockLDAPIdmService(users=None, projects=None):
    """Create a mock LDAP service that will return specific users and projects."""
    if users is None:
        users = []
    if projects is None:
        projects = []

    class MockLDAPIdmService(LDAPIdmService):
        """LDAP Service with mocked users and projects"""

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.connection.strategy.add_entry(
                "cn=fake_bind",
                {"userPassword": "fake_password", "sn": "user0_sn", "revision": 0},
            )
            for user in users:
                self._add_user(*user)
            for project in projects:
                self._add_project(*project)

        def _add_user(
            self,
            uid,
            given_name,
            surname,
            mail,
            nsAccountLock="false",
            csc_user_name=None,
        ):
            self.connection.strategy.add_entry(
                f"cn={uid},ou=Academic,ou=External,ou=Users,ou=idm,dc=csc,dc=fi",
                {
                    "cn": uid,
                    "uid": uid,
                    "CSCUserName": csc_user_name or uid,
                    "mail": mail,
                    "givenName": given_name,
                    "sn": surname,
                    "objectClass": "person",
                    "nsAccountLock": nsAccountLock,
                    "CSCUserType": "user_test",
                },
            )

        def _add_project(self, project_id, members):
            self.connection.strategy.add_entry(
                f"cn={project_id},ou=Academic,ou=Projects,ou=idm,dc=csc,dc=fi",
                {
                    "cn": f"project_{project_id}",
                    "objectClass": "CSCProject",
                    "member": [
                        f"cn={member_uid},ou=External,ou=Users,ou=idm,dc=csc,dc=fi"
                        for member_uid in members
                    ],
                    "CSCPrjNum": project_id,
                    "CSCPrjType": "project_test",
                },
            )

    return MockLDAPIdmService


MockLDAPIdmService = createMockLDAPIdmService(
    users=[
        ("tt", "teppo", "von test", "teppo@example.com"),
        ("kk", "koe", "von kokeilu", "koe@example.com"),
        # locked account
        ("locked", "locked", "von ignoreme", "locked@example.com", "true"),
        # same CSCUserName but different uid
        (
            "teppos_subaccount",
            "teppo",
            "von test",
            "teppo@example.com",
            "false",
            "teppo",
        ),
    ],
    projects=[("teppo_project", ["tt"]), ("all_project", ["tt", "kk"])],
)


class MockLDAPIdmServiceFail(MockLDAPIdmService):
    """LDAP service that will fail on search."""

    def __init__(self, *args, **kwargs):
        """Init service"""
        super().__init__(*args, **kwargs)
        self.connection.search = MagicMock(
            side_effect=ExceptionTest("things went wrong")
        )


class LDAPTestBase(BaseTest):
    """Testing class for LDAP  service."""

    teppo_user = {
        "uid": "tt",
        "name": "teppo von test",
        "email": "teppo@example.com",
    }

    koe_user = {
        "uid": "kk",
        "name": "koe von kokeilu",
        "email": "koe@example.com",
    }

    @pytest.fixture
    def ldap_service(self, app):
        """Fixture with mocked LDAP service context."""
        with app.app_context():
            with MockLDAPIdmService() as service:
                yield service

    @pytest.fixture
    def ldap_service_fail(self, app, mocker):
        """Fixture with mocked failing LDAP service context."""
        with app.app_context():
            with MockLDAPIdmServiceFail() as service:
                yield service


class TestLDAPSearchUser(LDAPTestBase):
    """Tests for LDAP user search."""

    def test_search_user_by_username(self, ldap_service):
        """Should search user by username."""
        results, status = ldap_service.search_user(search_str="tt")
        assert results == [self.teppo_user]
        assert status == 200

    def test_search_user_by_name(self, ldap_service):
        """Should search user by real name."""
        results, status = ldap_service.search_user(search_str="teppo von te")
        assert results == [self.teppo_user]
        assert status == 200

    def test_search_user_by_name_multiple(self, ldap_service):
        """Should match multiple users by real name."""
        results, status = ldap_service.search_user(search_str="von")
        assert results == [self.koe_user, self.teppo_user]
        assert status == 200

    def test_search_user_by_email(self, ldap_service):
        """Should search user by email."""
        results, status = ldap_service.search_user(search_str="teppo@example.com")
        assert results == [self.teppo_user]
        assert status == 200

    def test_search_user_empty(self, ldap_service):
        """Should fail when search string is empty."""
        results, status = ldap_service.search_user(search_str="")
        assert results == "Search failed due to invalid filter."
        assert status == 403

    def test_ldap_fail_search_user(self, ldap_service_fail):
        """LDAP search should return error if search fails."""
        results, status = ldap_service_fail.search_user("user")
        assert results, status == ("Search failed due to an error", 500)


class TestLDAPGetProjectUsers(LDAPTestBase):
    """Test for LDAP project user listing."""

    def test_get_project_users(self, ldap_service):
        """Should return username of project member."""
        results, status = ldap_service.get_project_users("teppo_project")
        assert results == [self.teppo_user.get("uid")]
        assert status == 200

    def test_ldap_fail_get_project_users(self, ldap_service_fail):
        """LDAP search should return error if search fails."""
        results, status = ldap_service_fail.get_project_users("project")
        assert results, status == ("Search failed due to an error", 500)

    def test_get_project_multiple_users(self, ldap_service):
        """Should return usernames of multiple project members."""
        results, status = ldap_service.get_project_users("all_project")
        assert results == [self.koe_user.get("uid"), self.teppo_user.get("uid")]
        assert status == 200


class TestLDAPGetUsersDetails(LDAPTestBase):
    """Tests for LDAP user details."""

    def test_get_users_details(self, ldap_service):
        """Should return user details for list of usernames."""
        uids = [self.koe_user.get("uid"), self.teppo_user.get("uid")]
        results, status = ldap_service.get_users_details(uids)
        assert results == [self.koe_user, self.teppo_user]
        assert status == 200

    def test_ldap_fail_get_users_details(self, ldap_service_fail):
        """LDAP search should return error if search fails."""
        results, status = ldap_service_fail.get_users_details(["user"])
        assert results, status == ("Search failed due to an error", 500)


class TestLDAPFilters(LDAPTestBase):
    """Tests for LDAP filters."""

    def test_trim_filter(self, ldap_service):
        """Remove"""
        filter = ldap_service.trim_filter(
            """
            (&
                (|
                    (&(givenName=Testi)(sn=Teppo))
                    (&(givenName=Teppo)(sn=Testi))
                )
                (objectClass=person)
                (CSCUserType=user_test)
            )
            """
        )
        expected = "(&(|(&(givenName=Testi)(sn=Teppo))(&(givenName=Teppo)(sn=Testi)))(objectClass=person)(CSCUserType=user_test))"
        assert filter == expected

    def test_create_person_filter(self, ldap_service):
        """Return correct filter string for person search."""
        name = "Teppo Test"
        expected_filter = ldap_service.trim_filter(
            """
            (&
                (|
                    (|
                        (&(givenName=*)(sn=Teppo Test*))
                        (&(givenName=Teppo Test*)(sn=*))
                        (&(givenName=Teppo*)(sn=Test*))
                        (&(givenName=Test*)(sn=Teppo*))
                    )
                    (mail=Teppo Test*)
                    (cn=Teppo Test*)
                )
                (&
                    (objectClass=person)
                    (!(nsAccountLock=true))
                    (CSCUserName=*)
                )
                (CSCUserType=user_test)
            )"""
        )
        filter = ldap_service._create_person_search_filter(name)
        assert filter == expected_filter

    def test_create_project_filter(self, ldap_service):
        """Return correct filter string for project search."""
        name = "project_x"
        expected_filter = ldap_service.trim_filter(
            """
            (&
                (CSCPrjNum=project_x)
                (objectClass=CSCProject)
                (CSCPrjType=project_test)
            )
            """
        )
        filter = ldap_service._create_project_filter(name)
        assert filter == expected_filter


class TestLDAPConfig(LDAPTestBase):
    """LDAP configuration tests."""

    def test_ldap_not_configured(self, app):
        """LDAP search should return error if connection is not configured."""
        del app.config["LDAP"]
        with app.app_context():
            service = LDAPIdmService()
            results, status = service.search_user(search_str="tt")
            assert results == "LDAP connection is not configured."
            assert status == 503

    def test_ldap_no_config(self, app):
        """LDAP search should return error if connection is not open."""
        with app.app_context():
            service = LDAPIdmService()
            results, status = service.search_user(search_str="tt")
            assert results == "LDAP connection is not open."
            assert status == 503


class TestLDAPResources(LDAPTestBase):
    """LDAP resource tests"""

    @pytest.fixture
    def mock_ldap(self, mocker, app):
        """Mock LDAP service."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": True}, app)
        mocker.patch(
            "etsin_finder.resources.ldap_resources.LDAPIdmService", MockLDAPIdmService
        )

    @pytest.fixture
    def mock_ldap_fail(self, mocker, app):
        """Mock failing LDAP service."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": True}, app)
        mocker.patch(
            "etsin_finder.resources.ldap_resources.LDAPIdmService",
            MockLDAPIdmServiceFail,
        )

    def test_ldap_flag_required(self, authd_client, app):
        """Test that editor permissions require feature flag."""
        set_flags({"PERMISSIONS.EDITOR_RIGHTS": False}, app)
        r = authd_client.get("/api/ldap/users/teppo")
        assert r.status_code == 405

    def test_ldap_get_user(self, authd_client, mock_ldap):
        """Should return list with user details."""
        resp = authd_client.get("/api/ldap/users/teppo")
        assert resp.json == [
            {"email": "teppo@example.com", "name": "teppo von test", "uid": "tt"}
        ]
        assert resp.status_code == 200

    def test_ldap_get_user_no_matches(self, authd_client, mock_ldap):
        """Should return empty list."""
        resp = authd_client.get("/api/ldap/users/teppoxe")
        assert resp.json == []
        assert resp.status_code == 200

    def test_ldap_get_user_fail(self, authd_client, mock_ldap_fail):
        """Should return error."""
        resp = authd_client.get("/api/ldap/users/teppo")
        assert resp.json == {"message": "Search failed due to an error."}
        assert resp.status_code == 500

    def test_ldap_unauthd(self, unauthd_client, mock_ldap):
        """Should return permission error for unauthenticated users."""
        resp = unauthd_client.get("/api/ldap/users/teppo")
        assert resp.status_code == 401
        assert resp.json == {"PermissionError": "User not logged in."}
