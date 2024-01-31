import { action, observable, computed, makeObservable, runInAction } from 'mobx'
import translate from 'counterpart'
import { isAbort } from '@/utils/AbortClient'
import EtsinDatasetV2 from './etsin.stores'
import EtsinDatasetV3 from './etsin.storesV3'
import DatasetProcessorV2, { DatasetProcessorV3 } from './processor/etsin.dataset'
import createFilesStore from './etsin.files'
import RelationsProcessor from './processor/etsin.relations'
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
    this.useDatasetV3 = this.Env.Flags.flagEnabled('ETSIN.METAX_V3.FRONTEND')
    this.Search = new EtsinSearch(this.Env)

    if (this.useDatasetV3) {
      this.EtsinDatasetClass = EtsinDatasetV3
      this.DatasetProcessorClass = DatasetProcessorV3
    } else {
      this.EtsinDatasetClass = EtsinDatasetV2
      this.DatasetProcessorClass = DatasetProcessorV2
    }

    this.EtsinDataset = new this.EtsinDatasetClass({ Access, Locale })
    this.datasetProcessor = new this.DatasetProcessorClass(this.Env)
    this.relationsProcessor = new RelationsProcessor(this.Env)
    this.filesProcessor = new FilesProcessor(this.Env)

    makeObservable(this)
  }

  @observable requests = {
    dataset: [],
    relations: [],
    versions: [],
    custom: [],
  }

  @observable errors = {
    dataset: [],
    relations: [],
    versions: [],
    custom: [],
    Access: this.Access,
    Locale: this.Locale,
  }

  @observable isLoading = {
    dataset: false,
    relations: false,
    versions: false,
    files: false,
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

  @action.bound reset() {
    this.abortAllRequests()
    this.EtsinDataset = new this.EtsinDatasetClass({ Access: this.Access, Locale: this.Locale })
    this.Files = createFilesStore(this.Env)
    this.Search = new EtsinSearch(this.Env)

    this.requests = {
      dataset: [],
      relations: [],
      versions: [],
      custom: [],
    }

    this.errors = {
      dataset: [],
      relations: [],
      versions: [],
      custom: [],
    }

    this.isLoading = {
      dataset: false,
      relations: false,
      versions: false,
      files: false,
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

    let promises
    if (!this.useDatasetV3) {
      promises = [this.fetchVersions(), this.fetchRelations(id), this.fetchFiles()]
    } else {
      runInAction(() => {
        this.isLoading.versions = false
        this.isLoading.relations = false
      })
      promises = [this.fetchFiles()]
    }

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

  @action
  fetchVersions = async () => {
    if (!this.EtsinDataset.v2VersionSet) {
      this.setLoadingOff('versions')
      return []
    }

    runInAction(() => {
      this.requests.versions = Object.values(this.EtsinDataset.v2VersionSet).map(version => {
        if (version.identifier === this.EtsinDataset.identifier) return null
        return this.datasetProcessor.fetch({
          id: version.identifier,
          resolved: this.constructResolvedCb('versions'),
          rejected: this.constructRejectedCb('versions'),
        })
      })
    })

    const promises = this.requests.versions.filter(r => r).map(r => r.promise)
    return Promise.all(promises).finally(() => {
      runInAction(() => {
        this.EtsinDataset.versions.push(this.EtsinDataset)
      })
      this.setLoadingOff('versions')
    })
  }

  @action
  fetchRelations = async id => {
    if (this.EtsinDataset.isRemoved || this.EtsinDataset.isDeprecated) {
      runInAction(() => {
        this.requests.relations = [
          this.relationsProcessor.fetch({
            id,
            resolved: this.constructResolvedCb('relations'),
            rejected: this.constructRejectedCb('relations'),
          }),
        ]
      })

      const promises = [...this.requests.relations.map(r => r.promise)]
      return Promise.all(promises).finally(() => this.setLoadingOff('relations'))
    }

    this.setLoadingOff('relations')
    return []
  }

  @action updateAccess = data => {
    const accessRights = this.useDatasetV3
      ? data.access_rights
      : data.catalog_record.research_dataset.access_rights
    this.Access.updateAccess(
      accessRights,
      data.has_permit || false,
      data.application_state || undefined
    )
  }

  @action.bound setLoadingOn() {
    this.accessibility.announcePolite(translate('dataset.loading'))
    this.isLoading.dataset = true
    this.isLoading.relations = true
    this.isLoading.versions = true
    this.isLoading.files = true
  }

  @action.bound setLoadingOff(component) {
    this.isLoading[component] = false
  }
}

export default Etsin
