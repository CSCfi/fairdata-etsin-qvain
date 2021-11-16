import axios from 'axios'
import { observable, action, computed, makeObservable, reaction } from 'mobx'
import PromiseManager from '../../../utils/promiseManager'
import urls from '../../../utils/urls'

class Lock {
  constructor(Qvain, Auth) {
    this.Qvain = Qvain
    this.Auth = Auth
    makeObservable(this)
    this.promiseManager = new PromiseManager()
    this.poll = this.poll.bind(this)
    this.handleDatasetChange = this.handleDatasetChange.bind(this)
    this.unload = this.unload.bind(this)
    reaction(() => this.Qvain.datasetIdentifier, this.handleDatasetChange)
  }

  pollInterval = 30000

  requestTimeout = 10000

  enabled = false

  @observable lockData = {}

  @observable loading = false

  @observable isInitialLoad = false

  pollTimeoutId = null

  pollingEnabled = false

  handleDatasetChange(newIdentifier, oldIdentifier) {
    if (!this.enabled) {
      return
    }

    if (this.haveLock && this.lockData?.dataset && this.lockData.dataset === oldIdentifier) {
      this.stopPoll()
    }
    if (this.Qvain.datasetIdentifier) {
      this.startPoll()
    }
  }

  @action async enable() {
    this.enabled = true
    if (this.Qvain.datasetIdentifier) {
      await this.startPoll()
    }
  }

  @action async disable() {
    await this.stopPoll()
    this.enabled = false
  }

  @computed get haveLock() {
    return !!(this.lockData?.user === this.Auth?.userName)
  }

  @computed get lockUser() {
    return this.lockData?.user
  }

  @computed get isLoading() {
    return this.promiseManager.count('requestLock') > 0
  }

  @computed get isPolling() {
    return this.promiseManager.count('pollLock') > 0
  }

  @computed get isLoadingForced() {
    return this.promiseManager.count('requestLockForced') > 0
  }

  @computed get promises() {
    return this.promiseManager.promises
  }

  @action setLockData(dataset, user) {
    this.lockData = {
      dataset,
      user,
    }
  }

  clearPollTimeout() {
    clearTimeout(this.pollTimeoutId)
    this.pollTimeoutId = null
  }

  async startPoll() {
    this.pollingEnabled = true
    this.setInitialLoad(true)
    this.clearPollTimeout()
    this.poll()
  }

  async stopPoll() {
    this.pollingEnabled = false
    this.setInitialLoad(false)
    this.clearPollTimeout()
    this.promiseManager.promises.forEach(p => p.cancel())
    await this.release()
  }

  @action setInitialLoad(val) {
    this.isInitialLoad = val
  }

  async poll() {
    const doPoll = async () => {
      this.clearPollTimeout()
      await this.request()
      this.setInitialLoad(false)
      if (this.pollingEnabled) {
        this.pollTimeoutId = setTimeout(this.poll, this.pollInterval)
      }
    }
    await this.promiseManager.add(doPoll(), 'pollLock')
  }

  async request(options = {}) {
    const dataset = this.Qvain.datasetIdentifier
    if (!dataset || !this.enabled) {
      return
    }
    const { force } = options
    if (this.isLoading && !force) {
      return
    }

    const doRequest = async () => {
      const data = { force: !!force }
      let responseData
      try {
        const resp = await axios.put(urls.qvain.datasetLock(dataset), data, {
          timeout: this.requestTimeout,
        })
        responseData = resp?.data
      } catch (err) {
        if (!err.response) {
          console.warn(err)
        }
        if (err.response?.data?.user_id) {
          responseData = err.response?.data
        }
      }

      if (responseData) {
        this.setLockData(responseData.cr_id, responseData.user_id)
      }
    }

    const promiseTags = ['requestLock']
    if (force) {
      promiseTags.push('requestLockForced')
    }

    await this.promiseManager.add(doRequest(), ...promiseTags)
  }

  async release() {
    if (!this.enabled) {
      return
    }
    const dataset = this.lockData?.dataset
    this.setLockData(undefined, undefined)
    if (dataset) {
      await axios.delete(urls.qvain.datasetLock(dataset), {
        timeout: this.requestTimeout,
      })
    }
  }

  unload() {
    // release lock on window unload
    if (!this.enabled) {
      return
    }
    const dataset = this.lockData?.dataset
    if (dataset && window.fetch) {
      window.fetch(urls.qvain.datasetLock(dataset), {
        keepalive: true,
        method: 'DELETE',
      })
    }
  }
}

export default Lock
