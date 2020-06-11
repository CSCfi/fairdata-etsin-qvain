"""Validation schemas for form data coming in from Qvain Light"""
from marshmallow import Schema, fields, validates_schema, ValidationError
from marshmallow.validate import Length, OneOf
import json
from etsin_finder.qvain_light_dataset_schema import (
    PersonValidationSchema,
    OrganizationValidationSchema,
    ActorValidationSchema,
    DatasetValidationSchema as DatasetValidationSchemaV1
)

class DatasetValidationSchema(DatasetValidationSchemaV1):
    """
    Validation schema for the whole dataset.

    Arguments:
        Schema {library} -- Marshmallows Schema library.
    """

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
    title = fields.Str(required=True)
    description = fields.Str(required=True)
    use_category = fields.Dict(required=True)
    file_type = fields.Dict()
    delete = fields.Boolean()

class DirectoryMetadataSchema(Schema):
    """Validation schema for directory metadata changes."""

    identifier = fields.Str(required=True)
    title = fields.Str(required=True)
    description = fields.Str()
    use_category = fields.Dict(required=True)
    delete = fields.Boolean()

class UserMetadataValidationSchema(Schema):
    """
    Validation schema for dataset-specific file and directory metadata changes.

    Arguments:
        Schema {library} -- Marshmallows Schema library.
    """

    files = fields.List(fields.Nested(FileMetadataSchema))
    directories = fields.List(fields.Nested(DirectoryMetadataSchema))
