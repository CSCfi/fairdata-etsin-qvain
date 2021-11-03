"""Test suite for contact_utils.py."""

from etsin_finder.utils.constants import AGENT_TYPE
import pytest
from .contact_test import ContactTest
from etsin_finder.utils.contact_utils import (
    create_email_message_body,
    get_email_info,
    get_email_message_subject,
    get_email_recipient_addresses,
    get_harvest_info,
    validate_send_message_request,
)


class TestContactUtils(ContactTest):
    """Class for testing contact utils."""

    def test_get_email_message_body(
        self,
        mock_datetime_now,
        expected_email_body,
        pref_id,
        user_email,
        user_subject,
        user_body,
    ):
        """Test that function returns a correct email body."""
        result_email = create_email_message_body(
            pref_id, user_email, user_subject, user_body
        )
        assert result_email == expected_email_body

    def test_get_email_message_subject(self, default_subject):
        """Test that function returns correct email subject."""
        assert get_email_message_subject() == default_subject

    def test_validate_send_message_request_invalid_email(
        self, app, expect_log, invalid_user_email, user_body, agent_type_creator
    ):
        """Test that function returns False and warns when invalid email."""
        with app.app_context():
            result = validate_send_message_request(
                invalid_user_email, user_body, agent_type_creator
            )
            assert result is False
            expect_log(
                warnings=[
                    "Reply-to email address not formally valid: " + invalid_user_email
                ]
            )

    def test_validate_send_message_request_unknown_agent_type(
        self, app, expect_log, user_email, user_body, invalid_agent_type
    ):
        """Test that function returns False and warns when invalid agent type."""
        with app.app_context():
            result = validate_send_message_request(
                user_email, user_body, invalid_agent_type
            )
            assert result is False
            expect_log(warnings=["Unrecognized agent type"])

    def test_validate_send_message_request_user_body_too_long(
        self, app, expect_log, user_email, long_user_body, agent_type_creator
    ):
        """Test that function returns False and warns when user body is too long."""
        with app.app_context():
            result = validate_send_message_request(
                user_email, long_user_body, agent_type_creator
            )
            assert result is False
            expect_log(warnings=["Body is too long"])

    def test_validate_send_message_request_ok(
        self, user_email, user_body, agent_type_creator
    ):
        """Test that function returns False and warns when user body is too long."""
        result = validate_send_message_request(
            user_email, user_body, agent_type_creator
        )
        assert result is True

    def test_get_email_recipient_addresses_creator(self, catalog_record):
        """Test that function returns emails of the creators from catalog_record."""
        emails = get_email_recipient_addresses(catalog_record, "CREATOR")
        assert emails == ["teppo@yliopisto.fi"]

    def test_get_email_recipient_addresses_publisher(self, catalog_record):
        """Test that function returns emails of the publisher from catalog_record."""
        emails = get_email_recipient_addresses(catalog_record, "PUBLISHER")
        assert emails == ["arts@aalto.fi"]

    def test_get_email_recipient_addresses_contributor(self, catalog_record):
        """Test that function returns emails of the contributor from catalog_record."""
        emails = get_email_recipient_addresses(catalog_record, "CONTRIBUTOR")
        assert emails == ["kalle@yliopisto.fi"]

    def test_get_email_recipient_addresses_rights_holder(self, catalog_record):
        """Test that function returns emails of the rights holder from catalog_record."""
        emails = get_email_recipient_addresses(catalog_record, "RIGHTS_HOLDER")
        assert emails == ["rights@aalto.fi"]

    def test_get_email_recipient_addresses_curator(self, catalog_record):
        """Test that function returns emails of the curator from catalog_record."""
        emails = get_email_recipient_addresses(catalog_record, "CURATOR")
        assert emails == ["curator@aalto.fi"]

    def test_get_email_recipient_addresses_invalid_agent_type(
        self, app, expect_log, catalog_record
    ):
        """Test that function returns None and raises error."""
        with app.app_context():
            emails = get_email_recipient_addresses(catalog_record, "NON_EXISTANT")
            assert emails is None
            expect_log(
                errors=["No email addresses found with given agent type NON_EXISTANT"]
            )

    def test_get_email_info_without_catalog_record(self):
        """Test that function returns None when no catalog_record."""
        result = get_email_info(None)
        assert result is None

    def test_get_email_info_with_catalog_record(self, catalog_record):
        """Test that function returns dict with the info of emails for different agent types."""
        result = get_email_info(catalog_record)
        assert result == {
            "CREATOR": True,
            "PUBLISHER": True,
            "CONTRIBUTOR": True,
            "RIGHTS_HOLDER": True,
            "CURATOR": True,
        }

    def test_get_harvest_info(self, catalog_record):
        """Test that function check if catalog record is harvested accordingly."""
        result = get_harvest_info(catalog_record)
        assert result is False
