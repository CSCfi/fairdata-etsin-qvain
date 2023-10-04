# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Test Qvain dataset validation schema."""


import pytest

from .basetest import BaseTest

from etsin_finder.schemas.qvain_dataset_schema import (
    AccessRightsValidationSchema,
    PersonValidationSchema,
    OrganizationValidationSchema,
    ActorValidationSchema,
    DatasetValidationSchema,
    OriginalDatasetSchema,
)
from etsin_finder.utils.constants import ACCESS_TYPES


def getPerson(replace=None, delete=None):
    """Generate valid Person."""
    return {
        "@type": "Person",
        "name": "Teppo",
        "email": "email@example.com",
        "identifier": "person_identifier",
        "member_of": getOrganization(),
    }


def getOrganization():
    """Generate valid Organization."""
    return {
        "@type": "Organization",
        "name": {
            "en": "Child Organization",
        },
        "email": "child-org@example.com",
        "identifier": "child_organization_identifier",
        "is_part_of": {
            "@type": "Organization",
            "name": {"en": "Organization", "fi": "Järjestö"},
            "email": "org@example.com",
            "identifier": "organization_identifier",
        },
    }


def getAccessRights(access_type, restriction_grounds=None):
    """Generate access rights dictionary."""
    rights = {"access_type": {"identifier": access_type}}
    if restriction_grounds:
        rights["restriction_grounds"] = [{"identifier": restriction_grounds}]
    return rights


class TestQvainLightDatasetSchemaPerson(BaseTest):
    """Test Person schema."""

    def test_person(self):
        """Test ok person."""
        person = getPerson()
        errors = PersonValidationSchema().validate(person)
        assert not errors

    def test_person_name_empty(self):
        """Test person with empty name."""
        person = getPerson()
        person["name"] = ""
        errors = PersonValidationSchema().validate(person)
        assert errors

    def test_person_name_missing(self):
        """Test person with missing name."""
        person = getPerson()
        del person["name"]
        errors = PersonValidationSchema().validate(person)
        assert errors

    def test_person_email_invalid(self):
        """Test person with invalid email."""
        person = getPerson()
        person["email"] = "emailexample.com"
        errors = PersonValidationSchema().validate(person)
        assert errors

    def test_person_email_empty(self):
        """Test person with empty email."""
        person = getPerson()
        person["email"] = ""
        errors = PersonValidationSchema().validate(person)
        assert errors

    def test_person_email_missing(self):
        """Test person with missing email."""
        person = getPerson()
        del person["email"]
        errors = PersonValidationSchema().validate(person)
        assert not errors

    def test_person_identifier_empty(self):
        """Test person with empty identifier."""
        person = getPerson()
        person["identifier"] = ""
        errors = PersonValidationSchema().validate(person)
        assert not errors

    def test_person_identifier_missing(self):
        """Test person with missing identifier."""
        person = getPerson()
        del person["identifier"]
        errors = PersonValidationSchema().validate(person)
        assert not errors


class TestQvainLightDatasetSchemaOrganization(BaseTest):
    """Test Organization schema."""

    def test_organization(self):
        """Test ok organization."""
        org = getOrganization()
        errors = OrganizationValidationSchema().validate(org)
        assert not errors

    def test_organization_name_single_translation(self):
        """Test organization with single translation."""
        org = getOrganization()
        org["name"] = {"sv": "Org"}
        errors = OrganizationValidationSchema().validate(org)
        assert not errors

    def test_organization_name_empty_translation(self):
        """Test organization with empty translation."""
        org = getOrganization()
        org["name"] = {"fi": "", "sv": "Org"}
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_name_none_translation(self):
        """Test organization with None translation."""
        org = getOrganization()
        org["name"] = {"fi": None, "sv": "Org"}
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_name_missing(self):
        """Test organization with name missing."""
        org = getOrganization()
        del org["name"]
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_name_no_translations(self):
        """Test organization with name having no translations."""
        org = getOrganization()
        org["name"] = {}
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_identifier_empty(self):
        """Test organization with empty identifier."""
        org = getOrganization()
        org["identifier"] = ""
        errors = OrganizationValidationSchema().validate(org)
        assert not errors

    def test_organization_identifier_missing(self):
        """Test organization with no identifier."""
        org = getOrganization()
        del org["identifier"]
        errors = OrganizationValidationSchema().validate(org)
        assert not errors

    def test_organization_email_invalid(self):
        """Test organization with invalid email."""
        org = getOrganization()
        org["email"] = "orgemail@ex@mple.com"
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_email_empty(self):
        """Test organization with empty email."""
        org = getOrganization()
        org["email"] = ""
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_email_missing(self):
        """Test organization with no email."""
        org = getOrganization()
        del org["email"]
        errors = OrganizationValidationSchema().validate(org)
        assert not errors


class TestQvainLightDatasetSchemaActor(BaseTest):
    """Test Organization schema."""

    def test_organization_actor(self):
        """Test ok organization actor."""
        actor = getOrganization()
        errors = ActorValidationSchema().validate(actor)
        assert not errors

    def test_person_actor(self):
        """Test ok person actor."""
        actor = getPerson()
        errors = ActorValidationSchema().validate(actor)
        assert not errors

    def test_actor_invalid_type(self):
        """Test actor with invalid type."""
        actor = getPerson()
        actor["@type"] = "Organiperson"
        errors = ActorValidationSchema().validate(actor)
        assert errors == {"type": ["Unsupported value: Organiperson"]}

    def test_person_actor_wrong_type(self):
        """Test person actor with wrong type."""
        actor = getPerson()
        actor["@type"] = "Organization"
        errors = ActorValidationSchema().validate(actor)
        assert errors == {
            "member_of": ["Unknown field."],
            "name": ["Not a valid mapping type."],
        }

    def test_organization_actor_wrong_type(self):
        """Test organization actor with wrong type."""
        actor = getOrganization()
        actor["@type"] = "Person"
        errors = ActorValidationSchema().validate(actor)
        assert errors == {
            "is_part_of": ["Unknown field."],
            "member_of": ["Missing data for required field."],
            "name": ["Not a valid string."],
        }

    def test_actor_organizations_missing(self):
        """Test actor with missing organizations field."""
        actor = getPerson()
        del actor["member_of"]
        errors = ActorValidationSchema().validate(actor)
        assert errors == {"member_of": ["Missing data for required field."]}

    def test_actor_invalid_organization(self):
        """Test actor with invalid organization."""
        actor = getPerson()
        del actor["member_of"]["name"]
        errors = ActorValidationSchema().validate(actor)
        assert errors == {"member_of": {"name": ["Missing data for required field."]}}


class TestQvainDatasetDataCatalog(BaseTest):
    """Test allowed data catalogs"""

    schema = DatasetValidationSchema(partial=True)

    def test_ida(self):
        """IDA catalog is allowed"""
        errors = self.schema.validate(
            {"data_catalog": "urn:nbn:fi:att:data-catalog-ida"}
        )
        assert not errors

    def test_att(self):
        """ATT catalog is allowed"""
        errors = self.schema.validate(
            {"data_catalog": "urn:nbn:fi:att:data-catalog-att"}
        )
        assert not errors

    def test_pas(self):
        """PAS catalog is allowed"""
        errors = self.schema.validate(
            {"data_catalog": "urn:nbn:fi:att:data-catalog-pas"}
        )
        assert not errors

    def test_dft(self):
        """DFT catalog is allowed"""
        errors = self.schema.validate(
            {"data_catalog": "urn:nbn:fi:att:data-catalog-dft"}
        )
        assert not errors

    def test_invalid_catalog(self):
        """Unknown catalog is not allowed"""
        errors = self.schema.validate(
            {"data_catalog": "urn:nbn:fi:att:data-catalog-attenborough"}
        )
        assert errors


class TestQvainDatasetOriginal(BaseTest):
    """Test allowed data catalogs"""

    schema = OriginalDatasetSchema()

    @pytest.fixture
    def original(self):
        """Original with all fields required by the schema."""
        return {
            "date_created": "2020-01-01T12:00Z",
            "date_modified": "2020-01-02T12:00Z",
            "research_dataset": {},
        }

    def test_all_original(self, original):
        """Test original with all fields."""
        errors = self.schema.validate(original)
        assert not errors

    def test_ok_original(self, original):
        """Test original with required fields."""
        del original["date_modified"]
        errors = self.schema.validate(original)
        assert not errors

    def test_invalid_date_created(self, original):
        """Test original with invalid date_created."""
        original["date_created"] = "12345"
        errors = self.schema.validate(original)
        assert errors

    def test_invalid_date_modified(self, original):
        """Test original with invalid date_modified."""
        original["date_modified"] = "12345"
        errors = self.schema.validate(original)
        assert errors

    def test_invalid_research_dataset(self, original):
        """Test original with invalid research_dataset."""
        original["research_dataset"] = "12345"
        errors = self.schema.validate(original)
        assert errors

    def test_missing_date_created(self, original):
        """Test original with missing date_created."""
        del original["date_created"]
        errors = self.schema.validate(original)
        assert errors

    def test_missing_research_dataset(self, original):
        """Test original with missing research_dataset."""
        del original["research_dataset"]
        errors = self.schema.validate(original)
        assert errors


class TestQvainAccessRights(BaseTest):
    """Test access rights."""

    schema = AccessRightsValidationSchema()

    def test_open_without_restrictions(self):
        """Test open dataset without restriction grounds"""
        errors = self.schema.validate(getAccessRights(ACCESS_TYPES["open"]))
        assert not errors

    def test_open_with_restrictions(self):
        """Test open dataset with restriction grounds"""
        errors = self.schema.validate(
            getAccessRights(ACCESS_TYPES["open"], "https://example.com/restriction")
        )
        assert errors

    def test_restricted_without_restrictions(self):
        """Test restricted dataset without restriction grounds"""
        errors = self.schema.validate(getAccessRights(ACCESS_TYPES["restricted"]))
        assert errors

    def test_restricted_with_restrictions(self):
        """Test restricted dataset with restriction grounds"""
        errors = self.schema.validate(
            getAccessRights(
                ACCESS_TYPES["restricted"], "https://example.com/restriction"
            )
        )
        assert not errors
