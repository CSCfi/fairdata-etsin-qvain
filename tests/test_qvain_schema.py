# This file is part of the Etsin service
#
# Copyright 2017-2020 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Test Qvain dataset validation schema."""


import json

from .basetest import BaseTest

from etsin_finder.schemas.qvain_dataset_schema import (
    PersonValidationSchema,
    OrganizationValidationSchema,
    ActorValidationSchema,
    DatasetValidationSchema,
)


def getPerson(replace=None, delete=None):
    """Generate valid Person."""
    return {
        '@type': 'Person',
        'name': 'Teppo',
        'email': 'email@example.com',
        'identifier': 'person_identifier',
        'member_of': getOrganization(),
    }

def getOrganization():
    """Generate valid Organization."""
    return {
        '@type': 'Organization',
        'name': {
            'en': 'Child Organization',
        },
        'email': 'child-org@example.com',
        'identifier': 'child_organization_identifier',
        'is_part_of': {
            '@type': 'Organization',
            'name': {
                'en': 'Organization',
                'fi': 'Järjestö'
            },
            'email': 'org@example.com',
            'identifier': 'organization_identifier'
        }
    }


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
        person['name'] = ''
        errors = PersonValidationSchema().validate(person)
        assert errors

    def test_person_name_missing(self):
        """Test person with missing name."""
        person = getPerson()
        del person['name']
        errors = PersonValidationSchema().validate(person)
        assert errors

    def test_person_email_invalid(self):
        """Test person with invalid email."""
        person = getPerson()
        person['email'] = 'emailexample.com'
        errors = PersonValidationSchema().validate(person)
        assert errors

    def test_person_email_empty(self):
        """Test person with empty email."""
        person = getPerson()
        person['email'] = ''
        errors = PersonValidationSchema().validate(person)
        assert errors

    def test_person_email_missing(self):
        """Test person with missing email."""
        person = getPerson()
        del person['email']
        errors = PersonValidationSchema().validate(person)
        assert not errors

    def test_person_identifier_empty(self):
        """Test person with empty identifier."""
        person = getPerson()
        person['identifier'] = ''
        errors = PersonValidationSchema().validate(person)
        assert not errors

    def test_person_identifier_missing(self):
        """Test person with missing identifier."""
        person = getPerson()
        del person['identifier']
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
        org['name'] = {'sv': 'Org'}
        errors = OrganizationValidationSchema().validate(org)
        assert not errors

    def test_organization_name_empty_translation(self):
        """Test organization with empty translation."""
        org = getOrganization()
        org['name'] = {'fi': '', 'sv': 'Org'}
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_name_none_translation(self):
        """Test organization with None translation."""
        org = getOrganization()
        org['name'] = {'fi': None, 'sv': 'Org'}
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_name_missing(self):
        """Test organization with name missing."""
        org = getOrganization()
        del org['name']
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_name_no_translations(self):
        """Test organization with name having no translations."""
        org = getOrganization()
        org['name'] = {}
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_identifier_empty(self):
        """Test organization with empty identifier."""
        org = getOrganization()
        org['identifier'] = ''
        errors = OrganizationValidationSchema().validate(org)
        assert not errors

    def test_organization_identifier_missing(self):
        """Test organization with no identifier."""
        org = getOrganization()
        del org['identifier']
        errors = OrganizationValidationSchema().validate(org)
        assert not errors

    def test_organization_email_invalid(self):
        """Test organization with invalid email."""
        org = getOrganization()
        org['email'] = 'orgemail@ex@mple.com'
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_email_empty(self):
        """Test organization with empty email."""
        org = getOrganization()
        org['email'] = ''
        errors = OrganizationValidationSchema().validate(org)
        assert errors

    def test_organization_email_missing(self):
        """Test organization with no email."""
        org = getOrganization()
        del org['email']
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
        print(actor)
        errors = ActorValidationSchema().validate(actor)
        assert not errors

    def test_actor_invalid_type(self):
        """Test actor with invalid type."""
        actor = getPerson()
        actor['@type'] = 'Organiperson'
        errors = ActorValidationSchema().validate(actor)
        assert errors == {'type': ['Unsupported value: Organiperson']}

    def test_person_actor_wrong_type(self):
        """Test person actor with wrong type."""
        actor = getPerson()
        actor['@type'] = 'Organization'
        errors = ActorValidationSchema().validate(actor)
        assert errors == {'member_of': ['Unknown field.'], 'name': ['Not a valid mapping type.']}

    def test_organization_actor_wrong_type(self):
        """Test organization actor with wrong type."""
        actor = getOrganization()
        actor['@type'] = 'Person'
        errors = ActorValidationSchema().validate(actor)
        assert errors == {
            'is_part_of': ['Unknown field.'],
            'member_of': ['Missing data for required field.'],
            'name': ['Not a valid string.']
        }

    def test_actor_organizations_missing(self):
        """Test actor with missing organizations field."""
        actor = getPerson()
        del actor['member_of']
        errors = ActorValidationSchema().validate(actor)
        assert errors == {'member_of': ['Missing data for required field.']}

    def test_actor_invalid_organization(self):
        """Test actor with invalid organization."""
        actor = getPerson()
        del actor['member_of']['name']
        errors = ActorValidationSchema().validate(actor)
        assert errors == {'member_of': {'name': ['Missing data for required field.']}}


class TestQvainDatasetDataCatalog(BaseTest):
    """Test allowed data catalogs"""

    schema = DatasetValidationSchema(partial=True)

    def test_ida(self):
        """IDA catalog is allowed"""
        errors = self.schema.validate({'dataCatalog': 'urn:nbn:fi:att:data-catalog-ida'})
        assert not errors

    def test_att(self):
        """ATT catalog is allowed"""
        errors = self.schema.validate({'dataCatalog': 'urn:nbn:fi:att:data-catalog-att'})
        assert not errors

    def test_pas(self):
        """PAS catalog is allowed"""
        errors = self.schema.validate({'dataCatalog': 'urn:nbn:fi:att:data-catalog-pas'})
        assert not errors

    def test_dft(self):
        """DFT catalog is allowed"""
        errors = self.schema.validate({'dataCatalog': 'urn:nbn:fi:att:data-catalog-dft'})
        assert not errors

    def test_invalid_catalog(self):
        """Unknown catalog is not allowed"""
        errors = self.schema.validate({'dataCatalog': 'urn:nbn:fi:att:data-catalog-attenborough'})
        assert errors
