"""Validation schemas for form data coming in from Qvain Light"""
from marshmallow import Schema, fields
from marshmallow.validate import Length
import json

class LangValidationSchema(Schema):
    """
    Validation schema for language.

    Arguments:
        Schema {library} -- Marshmallows Schema library.
    """

    en = fields.Str()
    fi = fields.Str()

class ParticipantsValidationSchema(Schema):
    """
    Validation schema for participants.

    Arguments:
        Schema {library} -- Marshmallows Schema library.
    """

    type = fields.Str(
        required=True,
        validate=Length(min=1)
    )
    role = fields.List(
        fields.Str(validate=Length(min=1)),
        required=True
    )
    name = fields.Str(
        required=True,
        validate=Length(min=1)
    )
    email = fields.Email()
    identifier = fields.Str()
    organization = fields.Str()

class DatasetValidationSchema(Schema):
    """
    Validation schema for the whole dataset.

    Arguments:
        Schema {library} -- Marshmallows Schema library.
    """

    original = fields.Str()
    title = fields.Nested(
        LangValidationSchema,
        required=True,
        validate=lambda x: len(x['en']) + len(x['fi']) > 0
    )
    description = fields.Nested(
        LangValidationSchema,
        required=True,
        validate=lambda x: len(x['en']) + len(x['fi']) > 0
    )
    identifiers = fields.List(fields.Str())
    fieldOfScience = fields.Str()
    keywords = fields.List(
        fields.Str(),
        required=True,
        validate=lambda list: len(list) > 0
    )
    participants = fields.List(fields.Nested(
        ParticipantsValidationSchema),
        required=True,
        validate=lambda list: len(list) > 0
    )
    accessType = fields.Dict(
        required=True
    )
    embargoDate = fields.Str()
    restrictionGrounds = fields.Str()
    license = fields.Dict(
        required=True
    )
    otherLicenseUrl = fields.Str()
    dataCatalog = fields.Str()
    files = fields.List(fields.Dict())
    directories = fields.List(fields.Dict())
    remote_resources = fields.List(fields.Dict())
