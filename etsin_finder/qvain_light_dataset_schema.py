"""Validation schemas for form data coming in from Qvain Light"""
from marshmallow import Schema, fields, validates_schema, ValidationError
from marshmallow.validate import Length, OneOf


class PersonValidationSchema(Schema):
    """Validation schema for person."""

    name = fields.Str(
        required=True,
        validate=Length(min=1)
    )
    email = fields.Email()
    identifier = fields.Str()


class OrganizationValidationSchema(Schema):
    """Validation schema for organization."""

    # At least one name translation is needed
    name = fields.Dict(
        required=True,
        validate=lambda names: len(names) > 0 and all(type(v) is str and len(v) > 0 for v in names.values())
    )
    email = fields.Email()
    identifier = fields.Str()


class ActorValidationSchema(Schema):
    """Validation schema for actors."""

    type = fields.Str(
        required=True,
        validate=Length(min=1)
    )
    roles = fields.List(
        fields.Str(validate=Length(min=1)),
        validate=Length(min=1),
        required=True
    )

    person = fields.Nested(PersonValidationSchema)

    organizations = fields.List(
        fields.Nested(OrganizationValidationSchema),
        required=True,
        validate=Length(min=1)
    )

    @validates_schema
    def validate_person(self, data, **kwargs):
        """Require person if actor is a person.

        Args:
            data (dict): -

        Raises:
            ValidationError: A validation error occurred.

        """
        if data.get('type') == 'person':
            if not data.get('person'):
                raise ValidationError('Person is required for person actor.')
        elif data.get('type') == 'organization':
            if data.get('person'):
                raise ValidationError(
                    'Person not allowed for organization actor.')
        else:
            raise ValidationError('Invalid actor type.')


class DatasetValidationSchema(Schema):
    """Validation schema for the whole dataset."""

    original = fields.Dict()
    title = fields.Dict(
        required=True,
        validate=lambda x: len(x['en']) + len(x['fi']) > 0
    )
    description = fields.Dict(
        required=True,
        validate=lambda x: len(x['en']) + len(x['fi']) > 0
    )
    issuedDate = fields.Str()
    identifiers = fields.List(fields.Str())
    fieldOfScience = fields.List(
        fields.Str(),
        required=False
    )
    keywords = fields.List(
        fields.Str(),
        required=True,
        validate=lambda list: len(list) > 0
    )
    actors = fields.List(fields.Nested(
        ActorValidationSchema),
        required=True,
        validate=lambda list: len(list) > 0
    )
    accessType = fields.Dict(
        required=True
    )
    infrastructure = fields.List(
        fields.Dict(),
        required=False
    )
    spatial = fields.List(
        fields.Dict()
    )
    embargoDate = fields.Str()
    restrictionGrounds = fields.Str()
    license = fields.Dict()
    otherLicenseUrl = fields.Str()
    dataCatalog = fields.Str()
    cumulativeState = fields.Int(OneOf([0, 1, 2]))
    files = fields.List(fields.Dict())
    directories = fields.List(fields.Dict())
    remote_resources = fields.List(fields.Dict())
    useDoi = fields.Boolean()
