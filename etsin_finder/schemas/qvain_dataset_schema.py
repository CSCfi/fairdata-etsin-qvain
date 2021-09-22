"""Validation schemas for form data coming in from Qvain"""
from marshmallow import Schema, fields, validates_schema, ValidationError, validate
from marshmallow.validate import Length, OneOf
from marshmallow_oneofschema import OneOfSchema

data_catalog_matcher = "^urn:nbn:fi:att:data-catalog-(ida|att|pas|dft)$"


class ReferenceObjectValidationSchema(Schema):
    """Validation schema for generic reference data objects."""

    identifier = fields.URL(required=True)


class RemoteResourceDocumentValidationSchema(Schema):
    """Validation schema for generic reference data objects."""

    identifier = fields.URL()


class RemoteResourceValidationSchema(Schema):
    """Validation schema for remote resources."""

    title = fields.String(required=True)
    use_category = fields.Nested(ReferenceObjectValidationSchema, required=True)
    download_url = fields.Nested(RemoteResourceDocumentValidationSchema)
    access_url = fields.Nested(RemoteResourceDocumentValidationSchema)


class OrganizationValidationSchema(Schema):
    """Validation schema for organizations."""

    identifier = fields.String()
    name = fields.Dict(required=True,
                       validate=lambda names: len(names) > 0 and all(type(v) is str and len(v) > 0 for v in names.values()))
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
    name = fields.Dict()


class ProjectDetailsValidationSchema(Schema):
    """Validation schema for project details."""

    title = fields.Dict(required=True, validate=lambda x: x.get("en") or x.get("fi"))
    identifier = fields.Str(required=False)
    fundingIdentifier = fields.Str(required=False)
    funderType = fields.Dict(
        required=False, validate=lambda value: bool(value.get("identifier"))
    )


class ContributorTypeValidationSchema(Schema):
    """Validation schema for project funding agency contributor type."""

    identifier = fields.Str(required=True)
    definition = fields.Dict(
        required=False, validate=lambda x: x.get("en") or x.get("fi")
    )


class ProjectValidationSchema(Schema):
    """Validation schema for projects."""

    details = fields.Nested(ProjectDetailsValidationSchema, required=True)
    organizations = fields.List(
        fields.Nested(OrganizationValidationSchema),
        required=True,
        validate=Length(min=1),
    )
    fundingAgencies = fields.List(
        fields.Nested(OrganizationValidationSchema), required=False
    )


class DatasetValidationSchema(Schema):
    """
    Validation schema for the whole dataset.

    Arguments:
        Schema {library} -- Marshmallows Schema library.

    """

    relation = fields.List(fields.Dict())
    provenance = fields.List(fields.Dict())
    original = fields.Dict()
    title = fields.Dict(
        required=True,
        validate=lambda x: len(x.get("en", [])) + len(x.get("fi", [])) > 0,
    )
    description = fields.Dict(
        required=True,
        validate=lambda x: len(x.get("en", [])) + len(x.get("fi", [])) > 0,
    )
    issuedDate = fields.Str()
    identifiers = fields.List(fields.Str())
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
    accessType = fields.Dict(required=True)
    infrastructure = fields.List(fields.Dict())
    spatial = fields.List(fields.Dict())
    temporal = fields.List(fields.Dict())
    embargoDate = fields.Str()
    restrictionGrounds = fields.Str()
    license = fields.List(fields.Nested(LicenseValidationSchema))
    dataCatalog = fields.Str(validate=validate.Regexp(data_catalog_matcher))
    cumulativeState = fields.Int(validate=OneOf([0, 1, 2]))
    files = fields.List(fields.Dict())
    directories = fields.List(fields.Dict())
    remote_resources = fields.List(fields.Nested(RemoteResourceValidationSchema))
    useDoi = fields.Boolean()
    projects = fields.List(fields.Nested(ProjectValidationSchema))
