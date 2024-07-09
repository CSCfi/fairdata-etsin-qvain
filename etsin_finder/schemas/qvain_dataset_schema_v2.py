"""Validation schemas for form data coming in from Qvain"""
import json
from marshmallow import Schema, fields, validates_schema, ValidationError
from marshmallow.validate import OneOf

from etsin_finder.schemas.qvain_dataset_schema import (
    ActorValidationSchema,
    AccessRightsValidationSchema,
    DatasetValidationSchema as DatasetValidationSchemaV1,
    ProjectValidationSchema,
    ReferenceObjectValidationSchema,
    RemoteResourceValidationSchema,
    OtherIdentifierValidationSchema,
    OriginalDatasetSchema,
    data_catalog_matcher as data_catalog_matcher_v1,
)

data_catalog_matcher = data_catalog_matcher_v1


def validate(data, params):
    """Controller function for validation.

    Selects between draft and publish validations.
    Wrap this function call with try catch.
    """
    isDraft = params.get("draft", "false")
    schema = PublishDatasetValidationSchema()
    if isDraft:
        schema = DraftDatasetValidationSchema()

    parsed = json.loads(data)
    schema.load(parsed)
    return parsed


class DraftDatasetValidationSchema(Schema):
    """Validation schema for draft dataset."""

    title = fields.Dict(
        validate=lambda x: len(x.get("en", [])) + len(x.get("fi", [])) > 0,
        required=True,
    )

    description = fields.Dict()

    relation = fields.List(fields.Dict())
    provenance = fields.List(fields.Dict())

    original = fields.Nested(OriginalDatasetSchema)
    issued = fields.Str()
    other_identifier = fields.List(fields.Nested(OtherIdentifierValidationSchema))

    field_of_science = fields.List(fields.Nested(ReferenceObjectValidationSchema))

    language = fields.List(fields.Nested(ReferenceObjectValidationSchema))

    keyword = fields.List(fields.Str())

    creator = fields.List(fields.Nested(ActorValidationSchema))
    publisher = fields.Nested(ActorValidationSchema)
    curator = fields.List(fields.Nested(ActorValidationSchema))
    rights_holder = fields.List(fields.Nested(ActorValidationSchema))
    contributor = fields.List(fields.Nested(ActorValidationSchema))

    access_rights = fields.Nested(AccessRightsValidationSchema)

    infrastructure = fields.List(fields.Dict())

    spatial = fields.List(fields.Dict())

    temporal = fields.List(fields.Dict())

    theme = fields.List(fields.Nested(ReferenceObjectValidationSchema))

    data_catalog = fields.Str()
    cumulative_state = fields.Int(validate=OneOf([0, 1, 2]))
    files = fields.List(fields.Dict())
    directories = fields.List(fields.Dict())
    remote_resources = fields.List(fields.Nested(RemoteResourceValidationSchema))
    use_doi = fields.Boolean()
    is_output_of = fields.List(fields.Nested(ProjectValidationSchema))
    modified = fields.DateTime(format="iso")
    bibliographic_citation = fields.Str()


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
        if not data.get("delete"):
            for field in ["title", "use_category"]:
                if data.get(field) is None:
                    raise ValidationError("Missing required field", field_name=field)


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
        if not data.get("delete"):
            for field in ["title", "use_category"]:
                if data.get(field) is None:
                    raise ValidationError("Missing required field", field_name=field)


class UserMetadataValidationSchema(Schema):
    """Validation schema for dataset-specific file and directory metadata changes."""

    files = fields.List(fields.Nested(FileMetadataSchema))
    directories = fields.List(fields.Nested(DirectoryMetadataSchema))
