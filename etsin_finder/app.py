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

from etsin_finder.utils.flags import flag_enabled


def get_add_resource(app):
    """Return function for registering MethodView to a URL."""

    def add_resource(view, url, **kwargs):
        app.add_url_rule(url, view_func=view.as_view(view.__name__), **kwargs)

    return add_resource


def add_download_resources(app):
    """Set download API endpoints"""
    from etsin_finder.resources.download_resources_common import Status
    from etsin_finder.resources.download_resources_v2 import (
        PackageRequestsV2,
        AuthorizeV2,
        SubscriptionsV2,
        NotificationsV2
    )

    add_resource = get_add_resource(app)
    add_resource(PackageRequestsV2, "/api/download/requests", endpoint="dl_requests")
    add_resource(AuthorizeV2, "/api/download/authorize", endpoint="dl_download")
    add_resource(Status, "/api/download/status", endpoint="dl_status")

    if flag_enabled("DOWNLOAD_API_V2.EMAIL.BACKEND", app):
        add_resource(
            SubscriptionsV2, "/api/download/subscriptions", endpoint="dl_subscriptions"
        )
        add_resource(
            NotificationsV2, "/api/download/notifications", endpoint="dl_notifications"
        )

    if flag_enabled("ETSIN.METAX_V3.BACKEND", app):
        from etsin_finder.resources.download_resources_v3 import (
            PackageRequestsV3,
            AuthorizeV3,
            SubscriptionsV3,
            NotificationsV3
        )
        add_resource(PackageRequestsV3, "/api/v3/download/requests")
        add_resource(AuthorizeV3, "/api/v3/download/authorize")
        add_resource(Status, "/api/v3/download/status")

        if flag_enabled("DOWNLOAD_API_V2.EMAIL.BACKEND", app):
            add_resource(SubscriptionsV3, "/api/v3/download/subscriptions",)
            add_resource(NotificationsV3, "/api/v3/download/notifications",)


def add_restful_resources(app):
    """Set Flask Restful API endpoints

    Args:
        app (object): flask.Flask object instance.

    """
    add_resource = get_add_resource(app)
    from etsin_finder.resources.etsin_resources import (
        REMSApplyForPermission,
        Contact,
        Dataset,
        DatasetMetadata,
        RelatedDatasets,
        User,
        Language,
        Session,
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

    add_download_resources(app)

    # Common Qvain and Etsin endpoints
    add_resource(DatasetUserMetadata, "/api/common/datasets/<id:cr_id>/user_metadata")
    add_resource(DatasetProjects, "/api/common/datasets/<id:cr_id>/projects")
    add_resource(RelatedDatasets, "/api/common/datasets/<id:cr_id>/related")
    add_resource(ProjectFiles, "/api/common/projects/<string:pid>/files")
    add_resource(DirectoryFiles, "/api/common/directories/<string:dir_id>/files")

    # Qvain API endpoints
    add_resource(
        FileCharacteristics, "/api/qvain/files/<string:file_id>/file_characteristics"
    )
    add_resource(QvainDatasets, "/api/qvain/datasets")
    add_resource(QvainDataset, "/api/qvain/datasets/<id:cr_id>")
    add_resource(QvainDatasetFiles, "/api/qvain/datasets/<id:cr_id>/files")
    add_resource(QvainDatasetLock, "/api/qvain/datasets/<id:cr_id>/lock")
    add_resource(
        QvainDatasetEditorPermissions,
        "/api/qvain/datasets/<id:cr_id>/editor_permissions",
    )
    add_resource(
        QvainDatasetEditorPermissionsUser,
        "/api/qvain/datasets/<id:cr_id>/editor_permissions/<string:user_id>",
    )

    # Qvain API RPC endpoints
    add_resource(
        QvainDatasetChangeCumulativeState, "/api/rpc/datasets/change_cumulative_state"
    )
    add_resource(QvainDatasetCreateNewVersion, "/api/rpc/datasets/create_new_version")
    add_resource(QvainDatasetCreateDraft, "/api/rpc/datasets/create_draft")
    add_resource(QvainDatasetPublishDataset, "/api/rpc/datasets/publish_dataset")
    add_resource(QvainDatasetMergeDraft, "/api/rpc/datasets/merge_draft")

    # Etsin API endpoints
    add_resource(Dataset, "/api/dataset/<id:cr_id>")
    add_resource(DatasetMetadata, "/api/format")
    add_resource(Contact, "/api/email/<id:cr_id>")
    add_resource(User, "/api/user")
    add_resource(Language, "/api/language")
    add_resource(Session, "/api/session")
    add_resource(AppConfig, "/api/app_config")
    add_resource(SupportedFlags, "/api/supported_flags")

    # REMS API endpoints
    add_resource(REMSApplyForPermission, "/api/rems/<id:cr_id>")

    # LDAP API endpoints
    add_resource(SearchUser, "/api/ldap/users/<string:name>")


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
