export default {
  download: {
    packages: () => '/api/v3/download/requests',
    authorize: () => '/api/v3/download/authorize',
    subscriptions: () => '/api/v3/download/subscriptions',
    status: () => '/api/v3/download/status',
  },
  language: () => '/api/language',
  rems: (dataset: string) => `/api/rems/${dataset}`,
  format: (dataset: string, format: string) => `/api/format?cr_id=${dataset}&format=${format}`,
  dataset: (dataset: string) => `/api/dataset/${dataset}`,
  email: (dataset: string) => `/api/email/${dataset}`,
  qvain: {
    datasets: () => '/api/qvain/datasets',
    dataset: (dataset: string) => `/api/qvain/datasets/${dataset}`,
    datasetFiles: (dataset: string) => `/api/qvain/datasets/${dataset}/files`,
    datasetLock: (dataset: string) => `/api/qvain/datasets/${dataset}/lock`,
    fileCharacteristics: (file: string) => `/api/qvain/files/${file}/file_characteristics`,
    datasetEditorPermissions: (dataset: string) =>
      `/api/qvain/datasets/${dataset}/editor_permissions`,
    datasetEditorPermissionsUser: (dataset: string, username: string) =>
      `/api/qvain/datasets/${dataset}/editor_permissions/${username}`,
  },
  common: {
    datasetProjects: (dataset: string) => `/api/common/datasets/${dataset}/projects`,
    relatedDatasets: (dataset: string) => `/api/common/datasets/${dataset}/related`,
    datasetUserMetadata: (dataset: string) => `/api/common/datasets/${dataset}/user_metadata`,
    directoryFiles: (directory: string) => `/api/common/directories/${directory}/files`,
    projectFiles: (project: string) => `/api/common/projects/${project}/files`,
  },
  ldap: {
    searchUser: (str: string) => `/api/ldap/users/${str}`,
  },
  dl: {
    packages: () => '/api/download/requests',
    authorize: () => '/api/download/authorize',
    subscriptions: () => '/api/download/subscriptions',
    status: () => '/api/download/status',
  },
  rpc: {
    changeCumulativeState: () => '/api/rpc/datasets/change_cumulative_state',
    createNewVersion: () => '/api/rpc/datasets/create_new_version',
    createDraft: () => '/api/rpc/datasets/create_draft',
    publishDataset: () => '/api/rpc/datasets/publish_dataset',
    mergeDraft: () => '/api/rpc/datasets/merge_draft',
  },
  crossRef: {
    search: (term: string) =>
      `https://api.crossref.org/works?order=desc&rows=5&mailto=fairdata@csc.fi&select=author,title,DOI,score,abstract&query.bibliographic=${term}`,
  },
  metaxV3: {
    dataCatalog: (catalog: string) => `/v3/data-catalogs/${catalog}`,
    dataset: (dataset: string) => `/v3/datasets/${dataset}`,
    datasetPublish: (dataset: string) => `/v3/datasets/${dataset}/publish`,
    datasetCreateDraft: (dataset: string) => `/v3/datasets/${dataset}/create-draft`,
    datasetNewVersion: (dataset: string) => `/v3/datasets/${dataset}/new-version`,
    datasets: () => `/v3/datasets`,
    aggregates: () => `/v3/datasets/aggregates`,
    datasetData: (dataset: string) => `/v3/datasets/${dataset}/data`,
    datasetFormat: (dataset: string, format: string) =>
      `/v3/datasets/${dataset}/metadata-download?format=${format}`,
    datasetContact: (dataset: string) => `/v3/datasets/${dataset}/contact`,
    directories: () => `/v3/directories`,
    fileCharacteristics: (file: string) => `/v3/files/${file}/characteristics`,
    organizations: () => `/v3/organizations?pagination=false`,
    referenceData: (referenceData: string) => `/v3/reference-data/${referenceData}`,
    user: () => `/v3/auth/user`,
    base: () => '',
    datasetPermissions: (dataset: string) => `/v3/datasets/${dataset}/permissions`,
    datasetPermissionsEditors: (dataset: string) => `/v3/datasets/${dataset}/permissions/editors`,
    datasetPermissionsEditor: (dataset: string, username: string) =>
      `/v3/datasets/${dataset}/permissions/editors/${username}`,
    datasetREMSApplication: (dataset: string, application: number) =>
      `/v3/datasets/${dataset}/rems-applications/${application}`,
    datasetREMSApplicationSubmit: (dataset: string, application: number) =>
      `/v3/datasets/${dataset}/rems-applications/${application}/submit`,
    datasetREMSApplications: (dataset: string) => `/v3/datasets/${dataset}/rems-applications`,
    datasetREMSApplicationBase: (dataset: string) =>
      `/v3/datasets/${dataset}/rems-application-base`,
    datasetREMSApplicationCounts: (dataset: string) =>
      `/v3/datasets/${dataset}/rems-application-counts`,
    downloadAuthorize: () => '/v3/download/authorize',
    downloadStatus: () => '/v3/download/status',
    downloadDatasetAvailable: (dataset: string) => `/v3/download/available/${dataset}`,
    remsApplications: () => `/v3/rems/applications?roles=handler`,
    remsApplicationsTodo: () => `/v3/rems/applications/todo`,
    remsApplicationsHandled: () => `/v3/rems/applications/handled`,
    remsApplication: (application: string) => `/v3/rems/applications/${application}`,
    remsApplicationApprove: (application: string) => `/v3/rems/applications/${application}/approve`,
    remsApplicationReject: (application: string) => `/v3/rems/applications/${application}/reject`,
    remsApplicationClose: (application: string) => `/v3/rems/applications/${application}/close`,
    remsApplicationReturn: (application: string) => `/v3/rems/applications/${application}/return`,
  },
}
