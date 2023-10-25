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
    datasetLock: dataset => `/api/qvain/datasets/${dataset}/lock`,
    fileCharacteristics: file => `/api/qvain/files/${file}/file_characteristics`,
    datasetEditorPermissions: dataset => `/api/qvain/datasets/${dataset}/editor_permissions`,
    datasetEditorPermissionsUser: (dataset, username) =>
      `/api/qvain/datasets/${dataset}/editor_permissions/${username}`,
  },
  common: {
    datasetProjects: dataset => `/api/common/datasets/${dataset}/projects`,
    relatedDatasets: dataset => `/api/common/datasets/${dataset}/related`,
    datasetUserMetadata: dataset => `/api/common/datasets/${dataset}/user_metadata`,
    directoryFiles: directory => `/api/common/directories/${directory}/files`,
    projectFiles: project => `/api/common/projects/${project}/files`,
  },
  ldap: {
    searchUser: str => `/api/ldap/users/${str}`,
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
  crossRef: {
    search: term =>
      `https://api.crossref.org/works?order=desc&rows=5&mailto=fairdata@csc.fi&select=author,title,DOI,score,abstract&query.bibliographic=${term}`,
  },
  metaxV3: {
    dataset: (metaxV3, dataset) => `${metaxV3}/v3/datasets/${dataset}`,
    datasets: metaxV3 => `${metaxV3}/v3/datasets`,
    datasetData: (metaxV3, dataset) => `${metaxV3}/v3/datasets/${dataset}/data`,
    datasetFormat: (metaxV3, dataset, format) => `${metaxV3}/v3/datasets/${dataset}/metadata-download?format=${format}`,
    directories: metaxV3 => `${metaxV3}/v3/directories`,
    referenceData: (metaxV3, referenceData) => `${metaxV3}/v3/reference-data/${referenceData}`,
    user: metaxV3 => `${metaxV3}/auth/user`,
    '': metaxV3 => `${metaxV3}`,
  },
}
