import { observable, action, makeObservable, runInAction, computed } from 'mobx'
import urls from '../../utils/urls'

import { DOWNLOAD_API_REQUEST_STATUS } from '../../utils/constants'
import Notifications from './packages.notifications'
import AbortClient from '@/utils/AbortClient'

class Packages {
  // Download API package handling

  constructor(Env, useV3) {
    this.Env = Env
    this.Notifications = new Notifications(this)
    this.client = new AbortClient()
    this.useV3 = useV3
    makeObservable(this)
  }

  initialPollInterval = 1e3

  pollMultiplier = 1.2

  pollInterval = this.initialPollInterval

  pollTimeout = null

  @observable loadingDataset = false

  @observable error = null

  @observable datasetIdentifier = null

  @observable packages = {}

  @observable packageModalPath = null

  @observable manualDownloadUrlGetter = null

  @computed get sizeLimit() {
    return this.Env.packageSizeLimit
  }

  @action.bound openManualDownloadModal(item) {
    this.manualDownloadUrlGetter = item
    this.Notifications.setEmailError(null)
  }

  @action.bound closeManualDownloadModal() {
    this.manualDownloadUrlGetter = null
  }

  @action.bound openPackageModal(path) {
    this.packageModalPath = path
    this.Notifications.setEmailError(null)
  }

  @action.bound closePackageModal() {
    this.packageModalPath = null
  }

  @action clearPackages() {
    this.packages = {}
    this.error = null
  }

  @action reset() {
    this.datasetIdentifier = null
    this.clearPackages()
    this.setPollInterval(1e3, 1.2)
    this.clearPollTimeout()
    this.Notifications.reset()
  }

  setPollInterval(interval, multiplier) {
    this.initialPollInterval = interval
    this.pollInterval = interval
    this.pollMultiplier = multiplier
  }

  get(path) {
    return this.packages[path]
  }

  @action clearPollTimeout() {
    if (this.pollTimeout !== null) {
      window.clearTimeout(this.pollTimeout)
      this.pollTimeout = null
    }
  }

  @action setPollTimeout(func) {
    this.clearPollTimeout()
    this.pollTimeout = window.setTimeout(func, this.pollInterval)
  }

  @action schedulePoll() {
    // Poll status periodically if there are pending packages
    if (
      Object.values(this.packages).some(
        pack =>
          pack.status === DOWNLOAD_API_REQUEST_STATUS.PENDING ||
          pack.status === DOWNLOAD_API_REQUEST_STATUS.STARTED
      )
    ) {
      this.setPollTimeout(async () => {
        await this.fetch(this.datasetIdentifier)
      })
      runInAction(() => {
        const maxInterval = 10e3
        this.pollInterval = Math.min(this.pollInterval * this.pollMultiplier, maxInterval)
      })
    } else {
      this.pollInterval = this.initialPollInterval
      this.clearPollTimeout()
    }
  }

  @action updatePackage(path, pack) {
    if (!pack?.status) return
    if (pack.scope && pack.scope.length !== 1) {
      return
    }
    this.packages[path] = pack
  }

  @action updatePartials(partial) {
    if (!partial) {
      return
    }
    partial.forEach(pack => this.updatePackage(pack.scope[0], pack))
  }

  @action setRequestingPackageCreation(path, value) {
    this.packages[path] = { ...this.packages[path], requestingPackageCreation: value }
  }

  createPackage = async params => {
    const scope = params.scope || ['/']
    try {
      scope.forEach(path => {
        this.setRequestingPackageCreation(path, true)
      })
      const url = this.useV3
        ? this.Env.metaxV3Url('download', 'packages', params.cr_id)
        : urls.dl.packages()
      const resp = await this.client.post(url, params)
      const { partial, ...full } = resp.data

      this.Notifications.subscribe(params)

      this.updatePartials(partial)
      this.updatePackage('/', full)
      this.clearError()
    } catch (err) {
      console.error(err)
      this.setError(err)
    } finally {
      scope.forEach(path => {
        this.setRequestingPackageCreation(path, false)
      })
    }
    this.pollInterval = this.initialPollInterval
    this.schedulePoll()
  }

  getParamsForPath(path) {
    const params = {
      cr_id: this.datasetIdentifier,
    }
    if (path !== '/') {
      params.scope = [path]
    }
    return params
  }

  createPackageFromPath = async path => {
    const params = this.getParamsForPath(path)
    return this.createPackage(params)
  }

  @action setLoadingDataset(val) {
    this.loadingDataset = val
  }

  @action setError = error => {
    this.error = error
  }

  @action clearError = () => {
    this.error = null
  }

  async fetch(datasetIdentifier) {
    try {
      // Fetch list of available downloadable packages

      runInAction(() => {
        if (this.datasetIdentifier !== datasetIdentifier) {
          this.clearPackages()
          this.setLoadingDataset(true)
        }
        this.datasetIdentifier = datasetIdentifier
      })

      let response
      try {
        const url = this.useV3
          ? `${this.Env.metaxV3Url('download', 'packages', datasetIdentifier)}`
          : `${urls.dl.packages()}?cr_id=${datasetIdentifier}`
        response = await this.client.get(url)
        this.clearError()
      } catch (err) {
        this.clearPackages()
        console.error(err)
        this.setError(err)
        return
      }

      const { partial, ...full } = response.data
      runInAction(() => {
        if (Object.keys(full).length > 0) {
          this.packages['/'] = full
        }
        this.updatePartials(partial)
      })
    } finally {
      this.schedulePoll()
      this.setLoadingDataset(false)
    }
  }

  packageIsTooLarge(Files, item) {
    if (!item) {
      // check size of full download
      if (Files.root) {
        return Files.root.existingByteSize > this.sizeLimit
      }
    } else if (item.type === 'directory') {
      return item.existingByteSize > this.sizeLimit
    }
    return false
  }
}

export default Packages
