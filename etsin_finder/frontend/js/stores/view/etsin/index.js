import { action, observable, computed, makeObservable } from 'mobx'
import { isAbort } from '@/utils/AbortClient'
import EtsinDatasetV3 from './etsin.storesV3'
import { DatasetProcessorV3 } from './processor/etsin.dataset'
import createFilesStore from './etsin.files'
import FilesProcessor from './processor/etsin.files'
import EtsinSearch from './etsin.search.js'

const errorTranslations = {
  dataset: {
    404: 'error.notFound',
    503: 'error.notLoaded',
  },
}

class Etsin {
  constructor({ Env, Access, Accessibility, Locale }) {
    this.Env = Env
    this.Access = Access
    this.accessibility = Accessibility
    this.Locale = Locale
    this.Search = new EtsinSearch(this.Env)

    this.EtsinDatasetClass = EtsinDatasetV3
    this.DatasetProcessorClass = DatasetProcessorV3

    this.EtsinDataset = new this.EtsinDatasetClass({ Access, Locale })
    this.datasetProcessor = new this.DatasetProcessorClass(this.Env)
    this.filesProcessor = new FilesProcessor(this.Env)

    makeObservable(this)
  }

  @observable requests = {
    dataset: [],
    custom: [],
  }

  @observable errors = {
    dataset: [],
    emails: [],
    custom: [],
    Access: this.Access,
    Locale: this.Locale,
  }

  @observable isLoading = {
    dataset: false,
    files: false,
    packages: false,
  }

  @computed get allErrors() {
    return Object.values(this.errors).flat()
  }

  @computed get hasErrors() {
    return this.allErrors.length !== 0
  }

  @computed get datasetErrorTranslations() {
    return this.errors.dataset.map(error => error)
  }

  @computed get isDownloadPossible() {
    return (
      !this.isLoading.packages &&
      this.EtsinDataset.isDownloadAllowed &&
      !this.filesProcessor.Packages.error
    )
  }

  @action.bound reset() {
    this.abortAllRequests()
    this.EtsinDataset = new this.EtsinDatasetClass({ Access: this.Access, Locale: this.Locale })
    this.Files = createFilesStore(this.Env)
    this.Search = new EtsinSearch(this.Env)

    this.requests = {
      dataset: [],
      custom: [],
    }

    this.errors = {
      dataset: [],
      emails: [],
      custom: [],
    }

    this.isLoading = {
      dataset: false,
      files: false,
      packages: false,
    }
  }

  @action.bound setCustomError(message) {
    this.errors.custom = message
  }

  @action.bound abortAllRequests() {
    Object.values(this.requests).forEach(component =>
      component.forEach(r => {
        r?.abort()
      })
    )
  }

  @action.bound abortRequest(component, id) {
    const request = this.requests[component].find(p => p.id === id)
    if (request) request.abort()
  }

  constructResolvedCb(component, cb) {
    return action(data => {
      this.EtsinDataset.set(component, data)
      if (cb) cb(data)
    })
  }

  constructRejectedCb(component) {
    return action((error, translationFunction) => {
      if (isAbort(error)) {
        return
      }
      if (error.response) {
        this.errors[component] = [
          ...this.errors[component],
          {
            ...error,
            translation:
              translationFunction?.(error) ||
              errorTranslations?.[component]?.[error.response.status] ||
              'error.undefined',
          },
        ]
      } else {
        this.errors[component] = [
          ...this.errors[component],
          { error, translation: translationFunction?.(error) || 'error.undefined' },
        ]
      }
      console.error(`Error when fetching ${component}:`, error)
    })
  }

  @action
  fetchData = async id => {
    this.reset()
    this.setLoadingOn()

    await this.fetchDataset(id)

    if (!this.EtsinDataset.identifier) return []

    const promises = [this.fetchFiles()]

    return Promise.all(promises).finally(() => {
      this.requests = {}
    })
  }

  @action fetchDataset = async id => {
    this.requests.dataset = [
      this.datasetProcessor.fetch({
        id,
        resolved: this.constructResolvedCb('dataset', this.updateAccess),
        rejected: this.constructRejectedCb('dataset'),
      }),
    ]

    this.requests.dataset.push(
      this.datasetProcessor.fetchEmails({
        id,
        resolved: this.constructResolvedCb('emails'),
        rejected: this.constructRejectedCb('emails'),
      })
    )

    const promises = [...this.requests.dataset.map(r => r.promise)]
    return Promise.all(promises).finally(() => {
      this.setLoadingOff('dataset')
    })
  }

  @action
  fetchFiles = async () => {
    this.requests.files = [
      this.filesProcessor.fetch({
        dataset: this.EtsinDataset,
        resolved: this.constructResolvedCb('files'),
        rejected: this.constructRejectedCb('files'),
      }),
    ]

    return Promise.resolve(this.requests.files[0].promise).finally(() => {
      this.setLoadingOff('files')
    })
  }

  @action
  fetchPackages = async () => {
    if (!this.EtsinDataset.isDownloadAllowed) return null

    this.isLoading.packages = true
    this.requests.packages = [
      this.filesProcessor.fetchPackages({
        dataset: this.EtsinDataset,
        resolved: this.constructResolvedCb('packages'),
        rejected: this.constructRejectedCb('packages'),
      }),
    ]

    return Promise.resolve(this.requests.packages[0].promise).finally(() => {
      this.setLoadingOff('packages')
    })
  }

  @action updateAccess = data => {
    this.Access.updateAccess(
      data.access_rights,
      data.has_permit || false,
      data.application_state || undefined
    )
  }

  @action.bound setLoadingOn() {
    this.accessibility.announcePolite(this.Locale.translate('dataset.loading'))
    this.isLoading.dataset = true
    this.isLoading.files = true
  }

  @action.bound setLoadingOff(component) {
    this.isLoading[component] = false
  }
}

export default Etsin
