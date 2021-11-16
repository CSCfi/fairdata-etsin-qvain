"""Main app initialization file"""

import os
import logging
import logging.config

from flask import Flask
from flask_mail import Mail

from etsin_finder.app_config import load_app_config
from etsin_finder.cache import CatalogRecordCache, RemsCache
from etsin_finder.utils.utils import executing_cicd, get_log_config
from etsin_finder.utils.converters import IdentifierConverter
from etsin_finder.utils.flags import validate_flags, initialize_supported_flags

from flask_restful import Api
from etsin_finder.utils.flags import flag_enabled


def add_download_resources(api):
    """Set download API endpoints"""
    from etsin_finder.resources.download_resources import (
        Requests,
        Authorize,
        Subscriptions,
        Notifications,
    )

    api.add_resource(Requests, "/api/download/requests", endpoint="dl_requests")
    api.add_resource(Authorize, "/api/download/authorize", endpoint="dl_download")

    if flag_enabled("DOWNLOAD_API_V2.EMAIL.BACKEND", api.app):
        api.add_resource(
            Subscriptions, "/api/download/subscriptions", endpoint="dl_subscriptions"
        )
        api.add_resource(
            Notifications, "/api/download/notifications", endpoint="dl_notifications"
        )


def add_restful_resources(app):
    """Set Flask Restful API endpoints

    Args:
        app (object): flask.Flask object instance.

    """
    api = Api(app)
    from etsin_finder.resources.etsin_resources import (
        REMSApplyForPermission,
        Contact,
        Dataset,
        DatasetMetadata,
        User,
        Language,
        Session,
        Files,
        AppConfig,
        SupportedFlags,
    )

    from etsin_finder.resources.qvain_rpc import (
        QvainDatasetChangeCumulativeState,
        QvainDatasetCreateNewVersion,
        QvainDatasetPublishDataset,
        QvainDatasetMergeDraft,
        QvainDatasetCreateDraft,
    )

    from etsin_finder.resources.qvain_resources import (
        QvainDataset,
        QvainDatasets,
        QvainDatasetFiles,
        QvainDatasetEditorPermissions,
        QvainDatasetEditorPermissionsUser,
        QvainDatasetLock,
        FileCharacteristics,
    )

    from etsin_finder.resources.common_resources import (
        ProjectFiles,
        DirectoryFiles,
        DatasetUserMetadata,
        DatasetProjects,
    )

    from etsin_finder.resources.ldap_resources import SearchUser

    add_download_resources(api)

    # Common Qvain and Etsin endpoints
    api.add_resource(
        DatasetUserMetadata, "/api/common/datasets/<id:cr_id>/user_metadata"
    )
    api.add_resource(DatasetProjects, "/api/common/datasets/<id:cr_id>/projects")
    api.add_resource(ProjectFiles, "/api/common/projects/<string:pid>/files")
    api.add_resource(DirectoryFiles, "/api/common/directories/<string:dir_id>/files")

    # Qvain API endpoints
    api.add_resource(
        FileCharacteristics, "/api/qvain/files/<string:file_id>/file_characteristics"
    )
    api.add_resource(QvainDatasets, "/api/qvain/datasets")
    api.add_resource(QvainDataset, "/api/qvain/datasets/<id:cr_id>")
    api.add_resource(QvainDatasetFiles, "/api/qvain/datasets/<id:cr_id>/files")
    api.add_resource(QvainDatasetLock, "/api/qvain/datasets/<id:cr_id>/lock")
    api.add_resource(
        QvainDatasetEditorPermissions,
        "/api/qvain/datasets/<id:cr_id>/editor_permissions",
    )
    api.add_resource(
        QvainDatasetEditorPermissionsUser,
        "/api/qvain/datasets/<id:cr_id>/editor_permissions/<string:user_id>",
    )

    # Qvain API RPC endpoints
    api.add_resource(
        QvainDatasetChangeCumulativeState, "/api/rpc/datasets/change_cumulative_state"
    )
    api.add_resource(
        QvainDatasetCreateNewVersion, "/api/rpc/datasets/create_new_version"
    )
    api.add_resource(QvainDatasetCreateDraft, "/api/rpc/datasets/create_draft")
    api.add_resource(QvainDatasetPublishDataset, "/api/rpc/datasets/publish_dataset")
    api.add_resource(QvainDatasetMergeDraft, "/api/rpc/datasets/merge_draft")

    # Etsin API endpoints
    api.add_resource(Dataset, "/api/dataset/<id:cr_id>")
    api.add_resource(DatasetMetadata, "/api/format")
    api.add_resource(Files, "/api/files/<id:cr_id>")
    api.add_resource(Contact, "/api/email/<id:cr_id>")
    api.add_resource(User, "/api/user")
    api.add_resource(Language, "/api/language")
    api.add_resource(Session, "/api/session")
    api.add_resource(AppConfig, "/api/app_config")
    api.add_resource(SupportedFlags, "/api/supported_flags")

    # REMS API endpoints
    api.add_resource(REMSApplyForPermission, "/api/rems/<id:cr_id>")

    # LDAP API endpoints
    api.add_resource(SearchUser, "/api/ldap/users/<string:name>")


def add_views(app):
    """Add views to app"""
    from etsin_finder.views.index_views import index_views
    from etsin_finder.views.auth_views import auth_views
    from etsin_finder.views.dev_views import dev_views

    app.register_blueprint(index_views)
    app.register_blueprint(auth_views)

    # add development helper views
    if app.config.get("DEV_VIEWS"):
        app.register_blueprint(dev_views)


def validate_config(app):
    """Validate required config options"""
    app.logger.info("Validating configuration")
    with app.app_context():
        from etsin_finder.services import (
            common_service,
            qvain_service,
            cr_service,
            download_metadata_service,
            download_service,
            ldap_service,
        )

        # Services that use app parameter
        validate_flags(app)
        cr_service.MetaxAPIService(app)
        download_metadata_service.DatasetMetadataService(app)
        download_service.DownloadAPIService(app).validate_config(False)

        # Services that use app context
        common_service.MetaxCommonAPIService().validate_config(False)
        qvain_service.MetaxQvainAPIService().validate_config(False)
        ldap_service.LDAPIdmService().validate_config(False)
    app.logger.info("Done validating")


def _setup_app_logging(app):
    """Setup app logging

    Load the logging configurations for the flask app.

    Args:
        app (object): flask.Flask object instance.

    """
    log_file_path = app.config.get("APP_LOG_PATH", None)
    log_lvl = app.config.get("APP_LOG_LEVEL", "INFO")
    config = get_log_config(log_file_path, log_lvl)
    if config:
        logging.config.dictConfig(config)
    else:
        app.logger.error(
            "Logging not correctly set up due to missing app log path configuration"
        )


def create_app(testing=None):
    """Create flask app

    Args:
        testing (bool): If enabled, use testing configuration

    Returns:
        object: The flask.Flask app instance object.

    """
    if testing is None:
        testing = bool(os.environ.get("TESTING", False))

    app = Flask(__name__, template_folder="./frontend/build")

    app.config.update(load_app_config(testing))
    initialize_supported_flags(app)
    if not app.testing and not executing_cicd():
        _setup_app_logging(app)
    validate_config(app)
    if not executing_cicd():
        app.config.update({"SAML_PATH": "/home/etsin-user"})
        app.config.update({"SAML_PATH_ETSIN": "/home/etsin-user/etsin"})
        app.config.update({"SAML_PATH_QVAIN": "/home/etsin-user/qvain"})
    app.mail = Mail(app)
    app.cr_cache = CatalogRecordCache(app)
    app.cr_permission_cache = CatalogRecordCache(app, ttl=60, prefix="cr_permission_")
    app.cr_lock_cache = CatalogRecordCache(
        app, ttl=60, prefix="cr_lock_", noreply=False
    )
    app.rems_cache = RemsCache(app)
    app.url_map.converters["id"] = IdentifierConverter

    add_restful_resources(app)
    add_views(app)

    return app
