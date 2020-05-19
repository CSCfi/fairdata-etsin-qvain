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
    from etsin_finder.resources import REMSApplyForPermission, Contact, Dataset, User, Session, Files, Download
    from etsin_finder.qvain_light_resources import (
        ProjectFiles, FileDirectory, FileCharacteristics, UserDatasets,
        QvainDataset, QvainDatasetEdit, QvainDatasetDelete
    )
    from etsin_finder.qvain_light_rpc import (
        QvainDatasetChangeCumulativeState, QvainDatasetRefreshDirectoryContent,
        QvainDatasetFixDeprecated
    )

    from etsin_finder.qvain_light_rpc_v2 import (
        QvainDatasetChangeCumulativeState as V2QvainDatasetChangeCumulativeState,
        QvainDatasetFixDeprecated as V2QvainDatasetFixDeprecated,
        QvainDatasetCreateNewVersion as V2QvainDatasetCreateNewVersion,
        QvainDatasetPublishDataset as V2QvainDatasetPublishDataset,
        QvainDatasetMergeDraft as V2QvainDatasetMergeDraft,
        QvainDatasetCreateDraft as V2QvainDatasetCreateDraft
    )

    from etsin_finder.qvain_light_resources_v2 import (
        QvainDatasetEdit as V2QvainDatasetEdit,
        ProjectFiles as V2ProjectFiles,
        FileDirectory as V2FileDirectory,
        FileCharacteristics as V2FileCharacteristics,
        UserDatasets as V2UserDatasets,
        QvainDatasetDelete as V2QvainDatasetDelete,
        QvainDataset as V2QvainDataset,
        QvainDatasetUserMetadata as V2QvainDatasetUserMetadata,
        QvainDatasetProjects as V2QvainDatasetProjects,
        QvainDatasetFiles as V2QvainDatasetFiles
    )

    # Qvain light API endpoints for Metax v2
    api.add_resource(V2ProjectFiles, '/api/v2/files/project/<string:pid>', endpoint='v2_project_files')
    api.add_resource(V2FileDirectory, '/api/v2/files/directory/<string:dir_id>', endpoint='v2_file_directory')
    api.add_resource(V2FileCharacteristics, '/api/v2/files/file_characteristics/<string:file_id>', endpoint='v2_file_characteristics')
    api.add_resource(V2UserDatasets, '/api/v2/datasets/<string:user_id>', endpoint='v2_user_datasets')
    api.add_resource(V2QvainDatasetDelete, '/api/v2/dataset/<string:cr_id>', endpoint='v2_user_datasets_delete')
    api.add_resource(V2QvainDataset, '/api/v2/dataset', endpoint='v2_dataset')
    api.add_resource(V2QvainDatasetEdit, '/api/v2/datasets/edit/<string:cr_id>', endpoint='v2_dataset_edit')
    api.add_resource(V2QvainDatasetUserMetadata, '/api/v2/datasets/user_metadata/<string:cr_id>', endpoint='v2_dataset_user_metadata')
    api.add_resource(V2QvainDatasetProjects, '/api/v2/datasets/projects/<string:cr_id>', endpoint='v2_dataset_projects')
    api.add_resource(V2QvainDatasetFiles, '/api/v2/datasets/files/<string:cr_id>', endpoint='v2_dataset_files')

    # Qvain light API RPC endpoints for Metax v2
    api.add_resource(V2QvainDatasetChangeCumulativeState, '/api/v2/rpc/datasets/change_cumulative_state', endpoint='v2_change_cumulative_state')
    api.add_resource(V2QvainDatasetFixDeprecated, '/api/v2/rpc/datasets/fix_deprecated', endpoint='v2_fix_deprecated')
    api.add_resource(V2QvainDatasetCreateNewVersion, '/api/v2/rpc/datasets/create_new_version', endpoint='v2_create_new_version')
    api.add_resource(V2QvainDatasetCreateDraft, '/api/v2/rpc/datasets/create_draft', endpoint='v2_create_draft')
    api.add_resource(V2QvainDatasetPublishDataset, '/api/v2/rpc/datasets/publish_dataset', endpoint='v2_publish_dataset')
    api.add_resource(V2QvainDatasetMergeDraft, '/api/v2/rpc/datasets/merge_draft', endpoint='v2_merge_draft')

    # Etsin API endpoints
    api.add_resource(Dataset, '/api/dataset/<string:cr_id>')
    api.add_resource(Files, '/api/files/<string:cr_id>')
    api.add_resource(Contact, '/api/email/<string:cr_id>')
    api.add_resource(User, '/api/user')
    api.add_resource(Session, '/api/session')
    api.add_resource(Download, '/api/dl')

    # Qvain light API endpoints
    api.add_resource(ProjectFiles, '/api/files/project/<string:pid>')
    api.add_resource(FileDirectory, '/api/files/directory/<string:dir_id>')
    api.add_resource(FileCharacteristics, '/api/files/file_characteristics/<string:file_id>')
    api.add_resource(UserDatasets, '/api/datasets/<string:user_id>')
    api.add_resource(QvainDatasetDelete, '/api/dataset/<string:cr_id>')
    api.add_resource(QvainDataset, '/api/dataset')
    api.add_resource(QvainDatasetEdit, '/api/datasets/edit/<string:cr_id>')
    # Qvain light API RPC endpoints
    api.add_resource(QvainDatasetChangeCumulativeState, '/api/rpc/datasets/change_cumulative_state')
    api.add_resource(QvainDatasetRefreshDirectoryContent, '/api/rpc/datasets/refresh_directory_content')
    api.add_resource(QvainDatasetFixDeprecated, '/api/rpc/datasets/fix_deprecated')
    # REMS API endpoints
    api.add_resource(REMSApplyForPermission, '/api/rems/<string:cr_id>')
    # api.add_resource(REMSCreateUser, '/api/users/create')
    # api.add_resource(REMSGetEntitlements, '/api/entitlements')
    # api.add_resource(REMSGetApplications, '/api/applications/<string:application_id>')
    # api.add_resource(REMSCreateNewApplication, '/api/applications/create')


app = create_app()
add_restful_resources(app)
import etsin_finder.views

if __name__ == "__main__":
    app.run()
