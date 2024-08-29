import { DOWNLOAD_API_REQUEST_STATUS } from '../../js/utils/constants'
const { PENDING, STARTED, SUCCESS } = DOWNLOAD_API_REQUEST_STATUS

// Generate errors for matching dataset identifiers
const errors = {
  503: [503, { code: 503, message: 'service unvailable' }],
  500: [500, { code: 500, message: 'internal server error' }],
}

class FakeDownload {
  // Mock implementation of the download service internals.
  // Currently supports only one directory/file in package scope.

  packageCounter = 0

  processingDelay = 0

  packagesByDataset = {}

  subscriptionsByDataset = {}

  reset() {
    this.packageCounter = 0
    this.pendingDelay = 0
    this.startedDelay = 0
    this.packagesByDataset = {}
    this.subscriptionsByDataset = {}
  }

  genPackageName = path => {
    const id = `package-${this.packageCounter}${path.replace(/[\W_]+/g, '-')}.zip`
    this.packageCounter += 1
    return id
  }

  setProcessingDelay(pending, started) {
    this.pendingDelay = pending || 0
    this.startedDelay = started || 0
  }

  getPackage(dataset, path) {
    const datasetPackages = this.packagesByDataset[dataset]
    if (!datasetPackages) {
      return null
    }
    const pack = datasetPackages[path]
    if (!pack) {
      return null
    }
    return pack
  }

  getDatasetPackages(dataset) {
    const datasetPackages = this.packagesByDataset[dataset]
    if (!datasetPackages) {
      return null
    }
    return datasetPackages
  }

  addSubscription(dataset, path, email) {
    if (!this.subscriptionsByDataset[dataset]) {
      this.subscriptionsByDataset[dataset] = {}
    }
    if (!this.subscriptionsByDataset[dataset][path]) {
      this.subscriptionsByDataset[dataset][path] = []
    }
    this.subscriptionsByDataset[dataset][path].push(email)
  }

  createPackage(dataset, path) {
    const pack = this.getPackage(dataset, path)
    if (pack) {
      return pack
    }

    if (!this.packagesByDataset[dataset]) {
      this.packagesByDataset[dataset] = {}
    }

    const newPackage = {
      package: this.genPackageName(path),
      status: PENDING,
      scope: [path],
    }
    this.packagesByDataset[dataset][path] = newPackage

    const processStarted = () => {
      if (this.startedDelay > 0) {
        newPackage.status = STARTED
        window.setTimeout(() => {
          newPackage.status = SUCCESS
        }, this.startedDelay)
      } else {
        newPackage.status = SUCCESS
      }
    }

    const processPending = () => {
      if (this.pendingDelay > 0) {
        window.setTimeout(() => {
          processStarted()
        }, this.pendingDelay)
      } else {
        processStarted()
      }
    }

    processPending()
    return newPackage
  }
}

export const fakeDownload = new FakeDownload()

const getParams = (url, data) => {
  const params = { ...(data && JSON.parse(data)) }
  const queryString = url.split('?')[1]
  if (queryString) {
    const queryParams = new URLSearchParams(queryString)
    for (const [key, value] of queryParams.entries()) {
      params[key] = value
    }
  }
  return params
}

const formatPackageResponse = packages => {
  // In the download API, the root package is in the root object, and has no scope.
  // Other packages are listed in the partial array.
  //
  // This converts the mock package object from
  // {
  //   '/' : { scope: ['/'], package: 'x.zip' },
  //   '/path': { scope: ['/path'], package: 'y.zip' }
  // }
  // to
  // {
  //   package: 'x.zip',
  //   partial: [
  //     { scope: ['/path'], package: 'y.zip' }
  //   ]
  // }
  if (!packages) {
    return [200, {}]
  }
  const obj = {}
  Object.entries(packages).forEach(([path, pack]) => {
    if (path === '/') {
      Object.assign(obj, pack)
      delete obj.scope
    } else {
      if (!obj.partial) {
        obj.partial = []
      }
      obj.partial.push(pack)
    }
  })
  return [200, JSON.parse(JSON.stringify(obj))]
}

export const applyMockAdapter = mockAdapter => {
  // Use mockAdapter to mock axios responses for the Download API.

  mockAdapter.onGet('/api/download/status').reply(200, '') // status ok
  mockAdapter.onGet(RegExp('^/api/download/requests')).reply(({ url, data }) => {
    const params = getParams(url, data)
    if (errors[params.cr_id]) {
      return errors[params.cr_id]
    }

    const packages = fakeDownload.getDatasetPackages(params.cr_id)
    return formatPackageResponse(packages)
  })

  mockAdapter.onPost(RegExp('^/api/download/requests')).reply(({ url, data }) => {
    const params = getParams(url, data)
    if (errors[params.cr_id]) {
      return errors[params.cr_id]
    }
    let path = '/'
    if (params.scope) {
      path = params.scope[0]
    }
    const createdPackages = {
      [path]: fakeDownload.createPackage(params.cr_id, path),
    }
    return formatPackageResponse(createdPackages)
  })

  mockAdapter.onPost(RegExp('^/api/download/authorize')).reply(({ url, data }) => {
    const params = getParams(url, data)
    const { cr_id, file, package: pack } = params
    if (errors[cr_id]) {
      return errors[cr_id]
    }
    if (file) {
      return [200, { url: `file_dl_url?cr_id=${cr_id}&file=${file}` }]
    }
    return [200, { url: `package_dl_url?cr_id=${cr_id}&package=${pack}` }]
  })

  mockAdapter.onPost(RegExp('^/api/download/subscriptions')).reply(({ url, data }) => {
    const params = getParams(url, data)
    if (errors[params.cr_id]) {
      return errors[params.cr_id]
    }
    let path = '/'
    if (params.scope) {
      path = params.scope[0]
    }
    const createdPackages = {
      [path]: fakeDownload.createPackage(params.cr_id, path),
    }
    fakeDownload.addSubscription(params.cr_id, path, params.email)
    return [200, '']
  })
}
