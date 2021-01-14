"""Validation schemas for service configuration"""
from marshmallow import Schema, fields
from marshmallow.validate import Length

class MetaxServiceConfigurationSchema(Schema):
    """Schema for configuring Metax connection"""

    HOST = fields.Str(required=True, validate=Length(min=1))
    USER = fields.Str(
        required=True,
        validate=Length(min=1)
    )
    PASSWORD = fields.Str(
        required=True,
        validate=Length(min=1)
    )
    VERIFY_SSL = fields.Boolean()
    HTTPS_PROXY = fields.Str()
