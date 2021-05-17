import { observable, action, makeObservable, runInAction } from 'mobx'
import axios from 'axios'
import urls from '../../components/qvain/utils/urls'

import { DOWNLOAD_API_REQUEST_STATUS } from '../../utils/constants'
import Notifications from './packages.notifications'

class Packages {
  // Download API package handling

  constructor(Env) {
    this.Env = Env
    this.Notifications = new Notifications(this)
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
      const resp = await axios.post(urls.v2.packages(), params)
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
      const { downloadApiV2 } = this.Env
      if (!downloadApiV2) {
        return
      }

      runInAction(() => {
        if (this.datasetIdentifier !== datasetIdentifier) {
          this.clearPackages()
          this.setLoadingDataset(true)
        }
        this.datasetIdentifier = datasetIdentifier
      })

      let response
      try {
        const url = `${urls.v2.packages()}?cr_id=${datasetIdentifier}`
        response = await axios.get(url)
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
}

export default Packages
