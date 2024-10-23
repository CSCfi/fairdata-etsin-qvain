"""Validation schemas for service configuration."""

from marshmallow import Schema, fields
from marshmallow.validate import Length


class MetaxServiceConfigurationSchema(Schema):
    """Schema for configuring Metax connection."""

    HOST = fields.Str(required=True, validate=Length(min=1))
    USER = fields.Str(required=True, validate=Length(min=1))
    PASSWORD = fields.Str(required=True, validate=Length(min=1))
    VERIFY_SSL = fields.Boolean()
    HTTPS_PROXY = fields.Str()


class DownloadServiceConfigurationSchema(Schema):
    """Schema for configuring Download Service connection."""

    HOST = fields.Str(required=True, validate=Length(min=1))
    PORT = fields.Int(required=True)
    AUTH_TOKEN = fields.Str(required=True)
    PUBLIC_HOST = fields.Str(required=True)
    PUBLIC_PORT = fields.Int(required=True)
    HTTPS_PROXY = fields.Str(allow_none=True)
    VERIFY_SSL = fields.Boolean(allow_none=True)


class LDAPIdmServiceConfigurationSchema(Schema):
    """Schema for LDAP Idm Service."""

    HOST = fields.Str(required=True, validate=Length(min=1))
    BIND = fields.Str(required=True, validate=Length(min=1))
    PASSWORD = fields.Str(required=True, validate=Length(min=1))
    STRATEGY = fields.Str(allow_none=True)
    USER_FILTERS = fields.Str(allow_none=True)
    PROJECT_FILTERS = fields.Str(allow_none=True)
