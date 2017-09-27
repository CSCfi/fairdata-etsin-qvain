from flask import Flask
import logging
from logging.handlers import RotatingFileHandler
import yaml
import os
from utils import executing_travis
from app_config import get_app_config

app = Flask(__name__)
log = app.logger

def set_app_config(app):
    app.config.update(get_app_config())
    import pprint
    pprint.pprint("Application configuration:")
    pprint.pprint(app.config)

def setup_app_logging(app):
    level = logging.getLevelName(app.config.get('APP_LOG_LEVEL', 'INFO'))
    log_file_path = app.config.get('APP_LOG_PATH', None)
    if log_file_path:
        handler = RotatingFileHandler(log_file_path, maxBytes=10000000, mode='a', backupCount=30)
        handler.setLevel(level)
        log.setLevel(level)
        log.addHandler(handler)
    else:
        log.error('Logging not correctly set up due to missing app log path configuration')

set_app_config(app)
setup_app_logging(app)
import views
