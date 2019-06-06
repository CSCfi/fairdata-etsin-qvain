from marshmallow import Schema, fields
from marshmallow.validate import Length
import json

class LangValidationSchema(Schema):
    en = fields.Str()
    fi = fields.Str()

class ParticipantsValidationSchema(Schema):
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
    email = fields.Email(required=True)
    identifier = fields.Str()
    organization = fields.Str()

class DatasetValidationSchema(Schema):
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
    accessType = fields.Str(
        required=True,
        validate=Length(min=1)
    )
    restrictionGrounds = fields.Str()
    license = fields.Str(
        required=True,
        validate=Length(min=1)
    )
