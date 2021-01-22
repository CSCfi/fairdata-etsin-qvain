export default {
  v1: {
    datasets: () => '/api/qvain/datasets',
    dataset: dataset => `/api/qvain/datasets/${dataset}`,
    directoryFiles: directory => `/api/qvain/directories/${directory}/files`,
    projectFiles: project => `/api/qvain/projects/${project}/files`,
    fileCharacteristics: file => `/api/qvain/files/${file}/file_characteristics`,
    rpc: {
      changeCumulativeState: () => '/api/rpc/datasets/change_cumulative_state',
      fixDeprecated: () => '/api/rpc/datasets/fix_deprecated',
      refreshDirectoryContent: () => '/api/rpc/datasets/refresh_directory_ontent',
    },
  },
  v2: {
    datasets: () => '/api/v2/qvain/datasets',
    dataset: dataset => `/api/v2/qvain/datasets/${dataset}`,
    datasetFiles: dataset => `/api/v2/qvain/datasets/${dataset}/files`,
    datasetProjects: dataset => `/api/v2/common/datasets/${dataset}/projects`,
    datasetUserMetadata: dataset => `/api/v2/common/datasets/${dataset}/user_metadata`,
    directoryFiles: directory => `/api/v2/common/directories/${directory}/files`,
    projectFiles: project => `/api/v2/common/projects/${project}/files`,
    fileCharacteristics: file => `/api/v2/qvain/files/${file}/file_characteristics`,
    packages: () => '/api/v2/dl/requests',
    rpc: {
      changeCumulativeState: () => '/api/v2/rpc/datasets/change_cumulative_state',
      createNewVersion: () => '/api/v2/rpc/datasets/create_new_version',
      createDraft: () => '/api/v2/rpc/datasets/create_draft',
      publishDataset: () => '/api/v2/rpc/datasets/publish_dataset',
      mergeDraft: () => '/api/v2/rpc/datasets/merge_draft',
    },
  },
}
