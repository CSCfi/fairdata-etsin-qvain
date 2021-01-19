"""Validation schemas for form data coming in from Qvain"""
from marshmallow import Schema, fields, validates_schema, ValidationError
from marshmallow.validate import Length, OneOf
from etsin_finder.schemas.qvain_dataset_schema import (
    DatasetValidationSchema as DatasetValidationSchemaV1
)


def validate(data, params):
    """Controller function for validation.

    Selects between draft and publish validations.
    Wrap this function call with try catch.
    """
    isDraft = params.get("draft", 'false')
    schema = PublishDatasetValidationSchema()
    if isDraft:
        schema = DraftDatasetValidationSchema()

    return schema.loads(data)


class DraftPersonValidationSchema(Schema):
    """Validation schema for person."""

    name = fields.Str(
        required=False,
        validate=Length(min=1)
    )
    email = fields.Email()
    identifier = fields.Str()


class DraftOrganizationValidationSchema(Schema):
    """Validation schema for organization."""

    # At least one name translation is needed
    name = fields.Dict(
        required=False,
        validate=lambda names: len(names) > 0 and all(type(v) is str and len(v) > 0 for v in names.values())
    )
    email = fields.Email()
    identifier = fields.Str()


class DraftActorValidationSchema(Schema):
    """Validation schema for actors."""

    type = fields.Str(
        required=False,
        validate=Length(min=1)
    )
    roles = fields.List(
        fields.Str(validate=Length(min=1)),
        validate=Length(min=1),
        required=False
    )

    person = fields.Nested(DraftPersonValidationSchema)

    organizations = fields.List(
        fields.Nested(DraftOrganizationValidationSchema),
        required=False,
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


class DraftLicenseValidationSchema(Schema):
    """Validation schema for licenses."""

    identifier = fields.URL()
    name = fields.Dict()


class DraftProjectDetailsValidationSchema(Schema):
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


class DraftContributorTypeValidationSchema(Schema):
    """Validation schema for project funding agency contributor type."""

    identifier = fields.Str(required=False)
    label = fields.Dict(
        required=False,
        validate=lambda x: x.get('en') or x.get('fi')
    )
    definition = fields.Dict(
        required=False,
        validate=lambda x: x.get('en') or x.get('fi')
    )
    inScheme = fields.Str(required=False)


class DraftFundingAgencyValidationSchema(Schema):
    """Validation schema for project funding agency"""

    organization = fields.List(fields.Nested(DraftOrganizationValidationSchema))
    contributorTypes = fields.List(
        fields.Nested(DraftContributorTypeValidationSchema)
    )


class DraftProjectValidationSchema(Schema):
    """Validation schema for projects."""

    details = fields.Nested(DraftProjectDetailsValidationSchema, required=True)
    organizations = fields.List(
        fields.List(
            fields.Nested(DraftOrganizationValidationSchema)
        ),
        required=False,
        validate=Length(min=1)
    )
    fundingAgencies = fields.List(
        fields.Nested(DraftFundingAgencyValidationSchema),
        required=False
    )


class DraftDatasetValidationSchema(Schema):
    """Validation schema for draft dataset."""

    title = fields.Dict(
        validate=lambda x: len(x.get('en', [])) + len(x.get('fi', [])) > 0,
        required=True
    )

    description = fields.Dict(
        required=False
    )

    relation = fields.List(
        fields.Dict(),
        required=False
    )
    provenance = fields.List(
        fields.Dict(),
        required=False
    )

    original = fields.Dict()
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
        required=False,
    )

    actors = fields.List(fields.Nested(
        DraftActorValidationSchema),
        required=False,
    )

    accessType = fields.Dict(
        required=False
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

    theme = fields.List(
        fields.Str(),
        required=False
    )

    embargoDate = fields.Str()
    restrictionGrounds = fields.Str()
    license = fields.List(fields.Nested(DraftLicenseValidationSchema))
    dataCatalog = fields.Str()
    cumulativeState = fields.Int(OneOf([0, 1, 2]))
    files = fields.List(fields.Dict())
    directories = fields.List(fields.Dict())
    remote_resources = fields.List(fields.Dict())
    useDoi = fields.Boolean()
    projects = fields.List(
        fields.Nested(DraftProjectValidationSchema),
        required=False
    )


class PublishDatasetValidationSchema(DatasetValidationSchemaV1):
    """Validation schema for the dataset to be published."""

    class Meta:
        """Meta options for validation."""

        exclude = ("files", "directories")


class FileActionSchema(Schema):
    """Validation schema for a file or directory addition/removal."""

    identifier = fields.Str(required=True)
    exclude = fields.Boolean()


class FileActionsValidationSchema(Schema):
    """Validation schema for file and directory additions/removals."""

    files = fields.List(fields.Nested(FileActionSchema))
    directories = fields.List(fields.Nested(FileActionSchema))


class FileMetadataSchema(Schema):
    """Validation schema for file metadata changes."""

    identifier = fields.Str(required=True)
    title = fields.Str()
    description = fields.Str()
    use_category = fields.Dict()
    file_type = fields.Dict()
    delete = fields.Boolean()

    @validates_schema
    def require_if_check_required(self, data, **kwargs):
        """Require fields only if not deleting metadata"""
        if not data.get('delete'):
            for field in ['title', 'description', 'use_category']:
                if data.get(field) is None:
                    raise ValidationError('Missing required field', field_name=field)


class DirectoryMetadataSchema(Schema):
    """Validation schema for directory metadata changes."""

    identifier = fields.Str(required=True)
    title = fields.Str()
    description = fields.Str()
    use_category = fields.Dict()
    delete = fields.Boolean()

    @validates_schema
    def require_if_check_required(self, data, **kwargs):
        """Require fields only if not deleting metadata"""
        if not data.get('delete'):
            for field in ['title', 'use_category']:
                if data.get(field) is None:
                    raise ValidationError('Missing required field', field_name=field)


class UserMetadataValidationSchema(Schema):
    """Validation schema for dataset-specific file and directory metadata changes."""

    files = fields.List(fields.Nested(FileMetadataSchema))
    directories = fields.List(fields.Nested(DirectoryMetadataSchema))
