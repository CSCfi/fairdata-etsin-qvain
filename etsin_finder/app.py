"""Main app initialization file"""

import os
import logging
import logging.config

from flask import Flask
from flask_mail import Mail

from etsin_finder.app_config import get_app_config
from etsin_finder.cache import CatalogRecordCache, RemsCache
from etsin_finder.utils.utils import executing_travis, get_log_config
from etsin_finder.utils.converters import IdentifierConverter
from etsin_finder.utils.flags import validate_flags, initialize_supported_flags

from etsin_finder.services import common_service_v2
from etsin_finder.services import qvain_service
from etsin_finder.services import qvain_service_v2


def create_app():
    """Create flask app

    Returns:
        object: The flask.Flask app instance object.

    """
    is_testing = bool(os.environ.get('TESTING', False))
    app = Flask(__name__, template_folder="./frontend/build")

    app.config.update(get_app_config(is_testing))
    initialize_supported_flags(app)
    if not app.testing and not executing_travis():
        _setup_app_logging(app)
    validate_config(app)
    if not executing_travis():
        app.config.update({'SAML_PATH': '/home/etsin-user'})
        app.config.update({'SAML_PATH_ETSIN': '/home/etsin-user/etsin'})
        app.config.update({'SAML_PATH_QVAIN': '/home/etsin-user/qvain'})
    app.mail = Mail(app)
    app.cr_cache = CatalogRecordCache(app)
    app.rems_cache = RemsCache(app)
    app.url_map.converters['id'] = IdentifierConverter

    return app

def validate_config(app):
    """Validate required config options"""
    app.logger.info("Validating configuration")
    validate_flags(app)
    with app.app_context():
        qvain_service.validate_config(True)
        qvain_service_v2.validate_config(True)
        common_service_v2.validate_config(True)

def _setup_app_logging(app):
    """Setup app logging

    Load the logging configurations for the flask app.

    Args:
        app (object): flask.Flask object instance.

    """
    log_file_path = app.config.get('APP_LOG_PATH', None)
    log_lvl = app.config.get('APP_LOG_LEVEL', 'INFO')
    config = get_log_config(log_file_path, log_lvl)
    if config:
        logging.config.dictConfig(config)
    else:
        app.logger.error('Logging not correctly set up due to missing app log path configuration')


app = create_app()
