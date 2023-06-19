"""Validation schemas for form data coming in from Qvain"""
from marshmallow import (
    Schema,
    ValidationError,
    fields,
    validate,
    INCLUDE,
    validates_schema,
)
from marshmallow.validate import Length, OneOf
from marshmallow_oneofschema import OneOfSchema

from etsin_finder.utils.constants import ACCESS_TYPES

data_catalog_matcher = "^urn:nbn:fi:att:data-catalog-(ida|att|pas|dft)$"


class OriginalDatasetSchema(Schema):
    """Validation schema for original dataset opened for editing."""

    date_created = fields.DateTime(format="iso", required=True)
    date_modified = fields.DateTime(format="iso")
    research_dataset = fields.Dict(required=True)

    class Meta:
        """Meta options for validation."""

        unknown = INCLUDE  # allow unknown fields


class ReferenceObjectValidationSchema(Schema):
    """Validation schema for generic reference data objects."""

    identifier = fields.URL(required=True)


class RemoteResourceDocumentValidationSchema(Schema):
    """Validation schema for remote resource urls."""

    identifier = fields.URL()


class OtherIdentifierValidationSchema(Schema):
    """Validation schema for other identifiers."""

    notation = fields.String(required=True)


class RemoteResourceValidationSchema(Schema):
    """Validation schema for remote resources."""

    title = fields.String(required=True)
    use_category = fields.Nested(ReferenceObjectValidationSchema, required=True)
    file_type = fields.Nested(RemoteResourceDocumentValidationSchema)
    download_url = fields.Nested(RemoteResourceDocumentValidationSchema)
    access_url = fields.Nested(RemoteResourceDocumentValidationSchema)


class OrganizationValidationSchema(Schema):
    """Validation schema for organizations."""

    identifier = fields.String()
    name = fields.Dict(
        required=True,
        validate=lambda names: len(names) > 0
        and all(type(v) is str and len(v) > 0 for v in names.values()),
    )
    email = fields.Email()
    contributor_type = fields.List(fields.Dict())
    is_part_of = fields.Nested(lambda: OrganizationValidationSchema)

    class Meta:
        """Meta options for validation."""

        include = {"@type": fields.Str(required=True)}


class PersonValidationSchema(Schema):
    """Validation schema for persons."""

    identifier = fields.String()
    name = fields.String(required=True, validate=Length(min=1))
    email = fields.Email()
    member_of = fields.Nested(OrganizationValidationSchema, required=True)

    class Meta:
        """Meta options for validation."""

        include = {"@type": fields.Str(required=True)}


class ActorValidationSchema(OneOfSchema):
    """Validation schema for actors."""

    type_schemas = {
        "Person": PersonValidationSchema,
        "Organization": OrganizationValidationSchema,
    }

    def get_data_type(self, data):
        """Determine which schema to use for data"""
        typ = type(data) is dict and data.get("@type")
        if typ:
            return typ
        else:
            raise Exception("Missing or unknown actor type")


class LicenseValidationSchema(Schema):
    """Validation schema for licenses."""

    identifier = fields.URL()
    license = fields.URL()
    name = fields.Dict()


class ContributorTypeValidationSchema(Schema):
    """Validation schema for project funding agency contributor type."""

    identifier = fields.Str(required=True)


class ProjectValidationSchema(Schema):
    """Validation schema for projects."""

    name = fields.Dict(required=True, validate=lambda x: x.get("en") or x.get("fi"))
    identifier = fields.Str(required=False)
    has_funder_identifier = fields.Str(required=False)
    funder_type = fields.Dict(
        required=False, validate=lambda value: bool(value.get("identifier"))
    )
    source_organization = fields.List(
        fields.Nested(OrganizationValidationSchema),
        required=True,
        validate=Length(min=1),
    )
    has_funding_agency = fields.List(
        fields.Nested(OrganizationValidationSchema), required=False
    )


class AccessRightsValidationSchema(Schema):
    """Access rights validation schema"""

    license = fields.List(fields.Nested(LicenseValidationSchema))
    available = fields.Str()  # Embargo date
    restriction_grounds = fields.List(fields.Nested(ReferenceObjectValidationSchema))
    access_type = fields.Nested(ReferenceObjectValidationSchema, required=True)

    @validates_schema
    def retriction_grounds_for_non_open(self, data, **kwargs):
        """Non-open access types should require restriction grounds."""
        is_open = data["access_type"]["identifier"] == ACCESS_TYPES["open"]
        has_restriction_grounds = len(data.get("restriction_grounds", [])) > 0
        if is_open:
            if has_restriction_grounds:
                raise ValidationError(
                    "Restriction grounds are not allowed for open access type"
                )
        else:
            if not has_restriction_grounds:
                raise ValidationError(
                    "Restriction grounds are required for non-open access type"
                )


class DatasetValidationSchema(Schema):
    """
    Validation schema for the whole dataset.

    Arguments:
        Schema {library} -- Marshmallows Schema library.

    """

    relation = fields.List(fields.Dict())
    provenance = fields.List(fields.Dict())
    original = fields.Nested(OriginalDatasetSchema)
    title = fields.Dict(
        required=True,
        validate=lambda x: len(x.get("en", [])) + len(x.get("fi", [])) > 0,
    )
    description = fields.Dict(
        required=True,
        validate=lambda x: len(x.get("en", [])) + len(x.get("fi", [])) > 0,
    )
    issued = fields.Str()
    other_identifier = fields.List(fields.Nested(OtherIdentifierValidationSchema))
    field_of_science = fields.List(fields.Nested(ReferenceObjectValidationSchema))
    language = fields.List(fields.Nested(ReferenceObjectValidationSchema))
    keywords = fields.List(
        fields.Str(), required=True, validate=lambda list: len(list) > 0
    )
    theme = fields.List(fields.Nested(ReferenceObjectValidationSchema))

    creator = fields.List(
        fields.Nested(ActorValidationSchema), required=True, validate=Length(min=1)
    )
    publisher = fields.Nested(ActorValidationSchema, required=True)
    curator = fields.List(fields.Nested(ActorValidationSchema))
    rights_holder = fields.List(fields.Nested(ActorValidationSchema))
    contributor = fields.List(fields.Nested(ActorValidationSchema))
    infrastructure = fields.List(fields.Dict())
    spatial = fields.List(fields.Dict())
    temporal = fields.List(fields.Dict())
    access_rights = fields.Nested(AccessRightsValidationSchema, required=True)
    dataCatalog = fields.Str(validate=validate.Regexp(data_catalog_matcher))
    cumulativeState = fields.Int(validate=OneOf([0, 1, 2]))
    files = fields.List(fields.Dict())
    directories = fields.List(fields.Dict())
    remote_resources = fields.List(fields.Nested(RemoteResourceValidationSchema))
    useDoi = fields.Boolean()
    is_output_of = fields.List(fields.Nested(ProjectValidationSchema))
    modified = fields.DateTime(format="iso")
