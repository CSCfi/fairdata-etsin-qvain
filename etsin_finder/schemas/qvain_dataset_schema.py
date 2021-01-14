"""Validation schemas for form data coming in from Qvain"""
from marshmallow import Schema, fields, validates_schema, ValidationError, validate
from marshmallow.validate import Length, OneOf


data_catalog_matcher = '^urn:nbn:fi:att:data-catalog-(ida|att|pas|dft)$'

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

class LicenseValidationSchema(Schema):
    """Validation schema for licenses."""

    identifier = fields.URL()
    name = fields.Dict()

class ProjectDetailsValidationSchema(Schema):
    """Validation schema for project details."""

    title = fields.Dict(
        required=True,
        validate=lambda x: x.get('en') or x.get('fi')
    )
    identifier = fields.Str(required=False)
    fundingIdentifier = fields.Str(required=False)
    funderType = fields.Dict(
        required=False,
        validate=lambda value: bool(value.get('identifier'))
    )


class ContributorTypeValidationSchema(Schema):
    """Validation schema for project funding agency contributor type."""

    identifier = fields.Str(required=True)
    label = fields.Dict(
        required=False,
        validate=lambda x: x.get('en') or x.get('fi')
    )
    definition = fields.Dict(
        required=False,
        validate=lambda x: x.get('en') or x.get('fi')
    )
    inScheme = fields.Str(required=False)


class FundingAgencyValidationSchema(Schema):
    """Validation schema for project funding agency"""

    organization = fields.List(fields.Nested(OrganizationValidationSchema))
    contributorTypes = fields.List(
        fields.Nested(ContributorTypeValidationSchema)
    )


class ProjectValidationSchema(Schema):
    """Validation schema for projects."""

    details = fields.Nested(ProjectDetailsValidationSchema, required=True)
    organizations = fields.List(
        fields.List(
            fields.Nested(OrganizationValidationSchema)
        ),
        required=True,
        validate=Length(min=1)
    )
    fundingAgencies = fields.List(
        fields.Nested(FundingAgencyValidationSchema),
        required=False
    )


class DatasetValidationSchema(Schema):
    """
    Validation schema for the whole dataset.

    Arguments:
        Schema {library} -- Marshmallows Schema library.

    """

    relation = fields.List(
        fields.Dict(),
        required=False
    )
    provenance = fields.List(
        fields.Dict(),
        required=False
    )
    original = fields.Dict()
    title = fields.Dict(
        required=True,
        validate=lambda x: len(x.get('en', [])) + len(x.get('fi', [])) > 0
    )
    description = fields.Dict(
        required=True,
        validate=lambda x: len(x.get('en', [])) + len(x.get('fi', [])) > 0
    )
    issuedDate = fields.Str()
    identifiers = fields.List(fields.Str())
    fieldOfScience = fields.List(
        fields.Str(),
        required=False
    )
    datasetLanguage = fields.List(
        fields.Str(),
        required=False
    )
    keywords = fields.List(
        fields.Str(),
        required=True,
        validate=lambda list: len(list) > 0
    )
    theme = fields.List(
        fields.URL(
            validate=Length(min=1)
        ),
        required=False,
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
    temporal = fields.List(
        fields.Dict(),
        required=False
    )
    embargoDate = fields.Str()
    restrictionGrounds = fields.Str()
    license = fields.List(fields.Nested(LicenseValidationSchema))
    dataCatalog = fields.Str(validate=validate.Regexp(data_catalog_matcher))
    cumulativeState = fields.Int(OneOf([0, 1, 2]))
    files = fields.List(fields.Dict())
    directories = fields.List(fields.Dict())
    remote_resources = fields.List(fields.Dict())
    useDoi = fields.Boolean()
    projects = fields.List(
        fields.Nested(ProjectValidationSchema),
        required=False
    )
