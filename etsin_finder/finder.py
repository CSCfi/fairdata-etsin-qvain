# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Main app initialization file"""

import logging
from logging.handlers import RotatingFileHandler

from flask import Flask
from flask_mail import Mail
from flask_restful import Api
from flask.logging import default_handler

from etsin_finder.app_config import get_app_config, get_memcached_config
from etsin_finder.cache import CatalogRecordCache, RemsCache
from etsin_finder.utils import executing_travis


def create_app():
    """
    Create Flask app.

    :return:
    """
    app = Flask(__name__, template_folder="./frontend/build")
    app.config.update(get_app_config())

    if not app.testing and not executing_travis():
        _setup_app_logging(app)
    if not executing_travis():
        app.config.update({'SAML_PATH': '/home/etsin-user'})

    app.logger.info("Application configuration: {0}".format(app.config))
    return app


def _setup_app_logging(app):
    log_file_path = app.config.get('APP_LOG_PATH', None)
    if log_file_path:
        level = logging.getLevelName(app.config.get('APP_LOG_LEVEL', 'INFO'))
        app.logger.setLevel(level)

        handler = RotatingFileHandler(log_file_path, maxBytes=10000000, mode='a', backupCount=30)
        handler.setLevel(level)
        formatter = logging.Formatter(
            "[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
        handler.setFormatter(formatter)
        app.logger.addHandler(handler)
        default_handler.setFormatter(formatter)
    else:
        app.logger.error('Logging not correctly set up due to missing app log path configuration')


def _do_imports():
    import etsin_finder.views


def _add_restful_resources():
    from etsin_finder.resources import Contact, Dataset, User, Session, Files, Download
    api.add_resource(Dataset, '/api/dataset/<string:cr_id>')
    api.add_resource(Files, '/api/files/<string:cr_id>')
    api.add_resource(Contact, '/api/email/<string:cr_id>')
    api.add_resource(User, '/api/user')
    api.add_resource(Session, '/api/session')
    api.add_resource(Download, '/api/dl')


app = create_app()
mail = Mail(app)
api = Api(app)
cr_cache = CatalogRecordCache(get_memcached_config())
rems_cache = RemsCache(get_memcached_config())
_add_restful_resources()
_do_imports()

if __name__ == "__main__":
    app.run()
