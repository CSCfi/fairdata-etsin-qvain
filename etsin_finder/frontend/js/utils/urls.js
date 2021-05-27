export default {
  language: () => '/api/language',
  rems: dataset => `/api/rems/${dataset}`,
  format: (dataset, format) => `/api/format?cr_id=${dataset}&format=${format}`,
  dataset: dataset => `/api/dataset/${dataset}`,
  email: dataset => `/api/email/${dataset}`,
  qvain: {
    datasets: () => '/api/qvain/datasets',
    dataset: dataset => `/api/qvain/datasets/${dataset}`,
    datasetFiles: dataset => `/api/qvain/datasets/${dataset}/files`,
    fileCharacteristics: file => `/api/qvain/files/${file}/file_characteristics`,
  },
  common: {
    datasetProjects: dataset => `/api/common/datasets/${dataset}/projects`,
    datasetUserMetadata: dataset => `/api/common/datasets/${dataset}/user_metadata`,
    directoryFiles: directory => `/api/common/directories/${directory}/files`,
    projectFiles: project => `/api/common/projects/${project}/files`,
  },
  dl: {
    packages: () => '/api/download/requests',
    authorize: () => '/api/download/authorize',
    subscriptions: () => '/api/download/subscriptions',
  },
  rpc: {
    changeCumulativeState: () => '/api/rpc/datasets/change_cumulative_state',
    createNewVersion: () => '/api/rpc/datasets/create_new_version',
    createDraft: () => '/api/rpc/datasets/create_draft',
    publishDataset: () => '/api/rpc/datasets/publish_dataset',
    mergeDraft: () => '/api/rpc/datasets/merge_draft',
  },
}
