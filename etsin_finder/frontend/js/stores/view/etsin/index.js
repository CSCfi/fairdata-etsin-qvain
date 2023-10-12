import { action, observable, computed, makeObservable, runInAction } from 'mobx'
import translate from 'counterpart'
import { isAbort } from '@/utils/AbortClient'
import EtsinDatasetV2 from './etsin.stores'
import EtsinDatasetV3 from './etsin.storesV3'
import DatasetProcessorV2, { DatasetProcessorV3 } from './processor/etsin.dataset'
import createFilesStore from './etsin.files'
import RelationsProcessor from './processor/etsin.relations'
import FilesProcessor from './processor/etsin.files'

const errorTranslations = {
  dataset: {
    404: 'error.notFound',
    503: 'error.notLoaded',
  },
}

class Etsin {
  constructor({ Env, Access, Accessibility, Locale }) {
    this.env = Env
    this.Access = Access
    this.accessibility = Accessibility
    this.Locale = Locale
    this.useDatasetV3 = this.env.Flags.flagEnabled('ETSIN.METAX_V3.FRONTEND')

    if (this.useDatasetV3) {
      this.EtsinDatasetClass = EtsinDatasetV3
      this.DatasetProcessorClass = DatasetProcessorV3
    } else {
      this.EtsinDatasetClass = EtsinDatasetV2
      this.DatasetProcessorClass = DatasetProcessorV2
    }

    this.EtsinDataset = new this.EtsinDatasetClass({ Access, Locale })
    this.datasetProcessor = new this.DatasetProcessorClass(this.env)
    this.relationsProcessor = new RelationsProcessor(this.env)
    this.filesProcessor = new FilesProcessor(this.env)
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
    this.Files = createFilesStore(this.env)

    this.requests = {
      dataset: [],
      relations: [],
      versions: [],
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
        r.abort()
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
      this.isLoading[component] = false
      if (cb) cb(data)
    })
  }

  constructRejectedCb(component) {
    return action((error, translationFunction) => {
      this.isLoading[component] = false
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
    if (!this.useDatasetV3) {
      await this.fetchVersions()
    } else
      runInAction(() => {
        this.isLoading.versions = false
      })

    await this.fetchFiles()


    this.requests = {}
  }

  @action fetchDataset = async id => {
    this.requests.dataset = [
      this.datasetProcessor.fetch({
        id,
        resolved: this.constructResolvedCb('dataset', this.updateAccess),
        rejected: this.constructRejectedCb('dataset'),
      }),
    ]

    const bypassRelations = () => {
      this.isLoading.relations = false
      return []
    }

    this.requests.relations = this.useDatasetV3
      ? bypassRelations()
      : [
          this.relationsProcessor.fetch({
            id,
            resolved: this.constructResolvedCb('relations'),
            rejected: this.constructRejectedCb('relations'),
          }),
        ]

    const promises = [
      ...this.requests.dataset.map(r => r.promise),
      ...this.requests.relations.map(r => r.promise),
    ]
    return Promise.all(promises)
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

    return this.requests.files[0].promise
  }

  @action
  fetchPackages = async () => {
    if (!this.EtsinDataset.isDownloadAllowed) return null

    this.isLoading.packages = true
    this.requests.packages = [
      this.filesProcessor.fetchPackages({
        catalogRecord: this.EtsinDataset.catalogRecord,
        resolved: this.constructResolvedCb('packages'),
        rejected: this.constructRejectedCb('packages'),
      }),
    ]
    return this.requests.packages[0].promise
  }

  @action
  fetchVersions = async () => {
    if (!this.EtsinDataset.datasetVersions) {
      this.isLoading.versions = false
      return []
    }

    runInAction(() => {
      this.requests.versions = Object.values(this.EtsinDataset.datasetVersions).map(version =>
        this.datasetProcessor.fetch({
          id: version.identifier,
          resolved: this.constructResolvedCb('versions'),
          rejected: this.constructRejectedCb('versions'),
        })
      )
    })

    const promises = this.requests.versions.map(r => r.promise)
    return Promise.all(promises)
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
}

export default Etsin
