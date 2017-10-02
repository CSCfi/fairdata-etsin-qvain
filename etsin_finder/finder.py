from flask import Flask
import logging
from logging.handlers import RotatingFileHandler
from .app_config import get_app_config

def create_app(config=None):
    app = Flask('etsin_finder', static_folder="./frontend/dist", template_folder="./frontend")
    _set_app_config(app, config)
    if not app.testing:
        _setup_app_logging(app)
    return app

def _set_app_config(app, config):
    if config:
        app.config.update(config)
    else:
        app.config.update(get_app_config())

    app.logger.info("Application configuration: {0}".format(app.config))

def _setup_app_logging(app):
    level = logging.getLevelName(app.config.get('APP_LOG_LEVEL', 'INFO'))
    log_file_path = app.config.get('APP_LOG_PATH', None)
    if log_file_path:
        handler = RotatingFileHandler(log_file_path, maxBytes=10000000, mode='a', backupCount=30)
        handler.setLevel(level)
        app.logger.setLevel(level)
        app.logger.addHandler(handler)
    else:
        app.logger.error('Logging not correctly set up due to missing app log path configuration')

app = create_app()
