# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Main app initialization file"""

import os
import logging
import logging.config

from flask import Flask
from flask_mail import Mail
from flask_restful import Api
from flask.logging import default_handler

from etsin_finder.app_config import get_app_config
from etsin_finder.cache import CatalogRecordCache, RemsCache
from etsin_finder.utils import executing_travis, get_log_config


def create_app():
    """
    Create Flask app.

    :return:
    """
    is_testing = bool(os.environ.get('TESTING', False))
    app = Flask(__name__, template_folder="./frontend/build")
    app.config.update(get_app_config(is_testing))
    if not app.testing and not executing_travis():
        _setup_app_logging(app)
    if not executing_travis():
        app.config.update({'SAML_PATH': '/home/etsin-user'})
    app.mail = Mail(app)
    app.cr_cache = CatalogRecordCache(app)
    app.rems_cache = RemsCache(app)

    return app


def _setup_app_logging(app):
    log_file_path = app.config.get('APP_LOG_PATH', None)
    log_lvl = app.config.get('APP_LOG_LEVEL', 'INFO')
    config = get_log_config(log_file_path, log_lvl)
    if config:
        logging.config.dictConfig(config)
    else:
        app.logger.error('Logging not correctly set up due to missing app log path configuration')


def add_restful_resources(app):
    """
    Set Flask Restful API endpoints

    :param app:
    :return:
    """
    api = Api(app)
    from etsin_finder.resources import Contact, Dataset, User, Session, Files, Download
    from etsin_finder.qvain_light_resources import ProjectFiles, FileDirectory, UserDatasets, QvainDataset, QvainDatasetDelete
    from etsin_finder.qvain_light_rpc import QvainDatasetChangeCumulativeState, QvainDatasetRefreshDirectoryContent

    api.add_resource(Dataset, '/api/dataset/<string:cr_id>')
    api.add_resource(Files, '/api/files/<string:cr_id>')
    api.add_resource(Contact, '/api/email/<string:cr_id>')
    api.add_resource(User, '/api/user')
    api.add_resource(Session, '/api/session')
    api.add_resource(Download, '/api/dl')
    # Qvain light API endpoints
    api.add_resource(ProjectFiles, '/api/files/project/<string:pid>')
    api.add_resource(FileDirectory, '/api/files/directory/<string:dir_id>')
    api.add_resource(UserDatasets, '/api/datasets/<string:user_id>')
    api.add_resource(QvainDatasetDelete, '/api/dataset/<string:cr_id>')
    api.add_resource(QvainDataset, '/api/dataset')
    # Qvain light API RPC endpoints
    api.add_resource(QvainDatasetChangeCumulativeState, '/api/rpc/datasets/change_cumulative_state')
    api.add_resource(QvainDatasetRefreshDirectoryContent, '/api/rpc/datasets/refresh_directory_content')

app = create_app()
add_restful_resources(app)
import etsin_finder.views

if __name__ == "__main__":
    app.run()
