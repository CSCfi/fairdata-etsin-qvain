# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Main finder initialization file"""

from flask_restful import Api
from etsin_finder.app import app
from etsin_finder.app_config import get_download_api_v2_config

def add_download_v2_resources(api):
    """Set download API v2 endpoints"""
    from etsin_finder.download_resources import (
        DownloadRequests
    )
    api.add_resource(DownloadRequests, '/api/v2/dl/requests')


def add_restful_resources(app):
    """Set Flask Restful API endpoints

    Args:
        app (object): flask.Flask object instance.

    """
    api = Api(app)
    from etsin_finder.resources import (
        REMSApplyForPermission,
        Contact,
        Dataset,
        V2Dataset,
        DatasetMetadata,
        User,
        Session,
        Files,
        Download,
        AppConfig
    )
    from etsin_finder.qvain_light_resources import (
        ProjectFiles,
        DirectoryFiles,
        FileCharacteristics,
        QvainDatasets,
        QvainDataset
    )
    from etsin_finder.qvain_light_rpc import (
        QvainDatasetChangeCumulativeState,
        QvainDatasetRefreshDirectoryContent,
        QvainDatasetFixDeprecated
    )

    from etsin_finder.qvain_light_rpc_v2 import (
        QvainDatasetChangeCumulativeState as V2QvainDatasetChangeCumulativeState,
        QvainDatasetCreateNewVersion as V2QvainDatasetCreateNewVersion,
        QvainDatasetPublishDataset as V2QvainDatasetPublishDataset,
        QvainDatasetMergeDraft as V2QvainDatasetMergeDraft,
        QvainDatasetCreateDraft as V2QvainDatasetCreateDraft
    )

    from etsin_finder.qvain_light_resources_v2 import (
        QvainDataset as V2QvainDataset,
        QvainDatasets as V2QvainDatasets,
        QvainDatasetFiles as V2QvainDatasetFiles,
        FileCharacteristics as V2FileCharacteristics,
    )

    from etsin_finder.common_resources_v2 import (
        ProjectFiles as V2ProjectFiles,
        DirectoryFiles as V2DirectoryFiles,
        DatasetUserMetadata as V2DatasetUserMetadata,
        DatasetProjects as V2DatasetProjects,
    )

    # Download API v2 endpoints
    if get_download_api_v2_config(app.testing):
        add_download_v2_resources(api)

    # Common Qvain Light and Etsin endpoints for Metax v2
    api.add_resource(V2DatasetUserMetadata, '/api/v2/common/datasets/<id:cr_id>/user_metadata', endpoint='v2_dataset_user_metadata')
    api.add_resource(V2DatasetProjects, '/api/v2/common/datasets/<id:cr_id>/projects', endpoint='v2_dataset_projects')
    api.add_resource(V2ProjectFiles, '/api/v2/common/projects/<string:pid>/files', endpoint='v2_project_files')
    api.add_resource(V2DirectoryFiles, '/api/v2/common/directories/<string:dir_id>/files', endpoint='v2_directory_files')

    # Qvain light API endpoints for Metax v2
    api.add_resource(V2FileCharacteristics, '/api/v2/qvain/files/<string:file_id>/file_characteristics', endpoint='v2_file_characteristics')
    api.add_resource(V2QvainDatasets, '/api/v2/qvain/datasets', endpoint='v2_datasets')
    api.add_resource(V2QvainDataset, '/api/v2/qvain/datasets/<id:cr_id>', endpoint='v2_dataset_edit')
    api.add_resource(V2QvainDatasetFiles, '/api/v2/qvain/datasets/<id:cr_id>/files', endpoint='v2_dataset_files')

    # Qvain light API RPC endpoints for Metax v2
    api.add_resource(V2QvainDatasetChangeCumulativeState, '/api/v2/rpc/datasets/change_cumulative_state', endpoint='v2_change_cumulative_state')
    api.add_resource(V2QvainDatasetCreateNewVersion, '/api/v2/rpc/datasets/create_new_version', endpoint='v2_create_new_version')
    api.add_resource(V2QvainDatasetCreateDraft, '/api/v2/rpc/datasets/create_draft', endpoint='v2_create_draft')
    api.add_resource(V2QvainDatasetPublishDataset, '/api/v2/rpc/datasets/publish_dataset', endpoint='v2_publish_dataset')
    api.add_resource(V2QvainDatasetMergeDraft, '/api/v2/rpc/datasets/merge_draft', endpoint='v2_merge_draft')

    # Etsin API endpoint for Metax v2 dataset, needed for draft_of
    api.add_resource(V2Dataset, '/api/v2/dataset/<id:cr_id>', endpoint='v2_etsin_dataset')

    # Etsin API endpoints
    api.add_resource(Dataset, '/api/dataset/<id:cr_id>')
    api.add_resource(DatasetMetadata, '/api/format')
    api.add_resource(Files, '/api/files/<id:cr_id>')
    api.add_resource(Contact, '/api/email/<id:cr_id>')
    api.add_resource(User, '/api/user')
    api.add_resource(Session, '/api/session')
    api.add_resource(Download, '/api/dl')
    api.add_resource(AppConfig, '/api/app_config')

    # Qvain light API endpoints
    api.add_resource(ProjectFiles, '/api/qvain/projects/<string:pid>/files')
    api.add_resource(DirectoryFiles, '/api/qvain/directories/<string:dir_id>/files')
    api.add_resource(FileCharacteristics, '/api/qvain/files/<string:file_id>/file_characteristics')
    api.add_resource(QvainDatasets, '/api/qvain/datasets')
    api.add_resource(QvainDataset, '/api/qvain/datasets/<id:cr_id>')

    # Qvain light API RPC endpoints
    api.add_resource(QvainDatasetChangeCumulativeState, '/api/rpc/datasets/change_cumulative_state')
    api.add_resource(QvainDatasetRefreshDirectoryContent, '/api/rpc/datasets/refresh_directory_content')
    api.add_resource(QvainDatasetFixDeprecated, '/api/rpc/datasets/fix_deprecated')

    # REMS API endpoints
    api.add_resource(REMSApplyForPermission, '/api/rems/<id:cr_id>')


add_restful_resources(app)
import etsin_finder.views

if __name__ == "__main__":
    app.run()
