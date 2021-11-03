"""Helpers for contact_utils test suite."""
from etsin_finder.utils.constants import ACCESS_TYPES, AGENT_TYPE
from _pytest.fixtures import fixture
import pytest
import datetime
from .basetest import BaseTest
from .utils import get_test_catalog_record

FAKE_TIME = datetime.datetime(2021, 7, 2, 13, 53, 55)


class ContactTest(BaseTest):
    """class for contact tests."""

    @pytest.fixture
    def pref_id(self):
        """Return imaginary pref_id."""
        return "dataset-123"

    @pytest.fixture
    def user_email(self):
        """Return imaginary user_email."""
        return "teppo@yliopisto.fi"

    @pytest.fixture
    def invalid_user_email(self):
        """Return invalid user's email."""
        return "diipadaapa.fi"

    @pytest.fixture
    def default_subject(self):
        """Return default subject of email."""
        return "Message from Etsin / Viesti Etsimestä"

    @pytest.fixture
    def user_subject(self):
        """Return a emailäs subject that is given by the user."""
        return "Oikeudet"

    @pytest.fixture
    def user_body(self):
        """Return a message that is given by the user."""
        return "Sinulle on myönnetty oikeudet."

    @pytest.fixture
    def long_user_body(self):
        """Return a very long message."""
        spam = ""
        for i in range(400):
            spam += "SPAM "
        return spam

    @pytest.fixture
    def agent_type_creator(self):
        """Return creator agent type."""
        return AGENT_TYPE.get("CREATOR")

    @pytest.fixture
    def invalid_agent_type(self):
        """Return invalid agent type."""
        return "there's no this kind of agent type."

    @pytest.fixture
    def expected_email_body(self):
        """Set up expected email body when using fixtures."""
        return (
            'The message below was sent via Etsin research data finder on July 2, 2021. It concerns a dataset with identifier "dataset-123". Please, send your reply to teppo@yliopisto.fi.\n'
            "\n"
            'Allaoleva viesti on lähetetty Etsin-palvelun kautta 2.7.2021. Viesti koskee tutkimusaineistoa, jonka tunniste on "dataset-123". Ole hyvä, lähetä vastauksesi osoitteeseen teppo@yliopisto.fi.\n'
            "\n"
            "---\n"
            "\n"
            "Subject / Aihe: Oikeudet\n"
            "Message / Viesti: Sinulle on myönnetty oikeudet."
        )

    @pytest.fixture
    def catalog_record(self):
        """Return test catalog record."""
        return get_test_catalog_record("open")

    @pytest.fixture
    def mock_datetime_now(self, monkeypatch):
        """Set up email body test.

        :returns dict that consists details of the test.
        """

        class mock_datetime:
            @classmethod
            def now(cls):
                return FAKE_TIME

        monkeypatch.setattr(datetime, "datetime", mock_datetime)
