import { action, observable, computed, makeObservable, runInAction } from 'mobx'
import translate from 'counterpart'
import {isAbort} from "@/utils/AbortClient"
import Files from '../files'
import EtsinDataset from './etsin.stores'
import DatasetProcessorV2 from './processor/etsin.dataset'
import RelationsProcessor from './processor/etsin.relations'
import FilesProcessor from './processor/etsin.files'

const errorTranslations = {
  dataset: {
    404: "error.notFound",
    503: "error.notLoaded"
  }
}

class Etsin {
  constructor({ Env, Access, Accessibility }) {
    this.Env = Env
    this.Access = Access
    this.Accessibility = Accessibility
    this.Files = new Files()
    this.EtsinDataset = new EtsinDataset(Access)
    this.datasetProcessor = new DatasetProcessorV2()
    this.relationsProcessor = new RelationsProcessor()
    this.filesProcessor = new FilesProcessor(Env)
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
    this.Files = new Files()
    this.EtsinDataset = new EtsinDataset(this.Access)
  
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
      files: false
    }  
  }

  @action.bound setCustomError(message) {
    this.errors.custom = message
  }

  @action.bound abortAllRequests() {
    Object.values(this.requests).forEach(component => component.forEach(r => {r.abort()}))
  }

  @action.bound abortRequest(component, id) {
    const request = this.requests[component].find(p => p.id === id)
    if(request) request.abort()
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
      if(isAbort(error)) {
        return
      }
      if(error.response) {
        this.errors[component] = [...this.errors[component], {
          ...error, 
          translation: translationFunction?.(error) || 
          errorTranslations?.[component]?.[error.response.status] || 
          "error.undefined"
        }]
      } else {
        this.errors[component] = [...this.errors[component], {error, translation: translationFunction?.(error) || "error.undefined"}]
      }
      console.error(`Error when fetching ${component}:`, error)
    })
  }

  @action
  fetchData = async id => {
    this.reset()
    this.setLoadingOn()
    await this.fetchDataset(id)
    await this.fetchVersions()
    await this.fetchFiles()
    await this.fetchPackages()
    this.requests = {}
  }

  @action fetchDataset = async (id) => {
    this.requests.dataset = [this.datasetProcessor.fetch({
      id,
      resolved: this.constructResolvedCb('dataset', this.updateAccess),
      rejected: this.constructRejectedCb('dataset'),
    })]
    this.requests.relations = [this.relationsProcessor.fetch({
      id,
      resolved: this.constructResolvedCb('relations'),
      rejected: this.constructRejectedCb('relations'),
    })]

    const promises = [...this.requests.dataset.map(r => r.promise), ...this.requests.relations.map(r => r.promise)]
    return Promise.all(promises)
  }

  @action
  fetchFiles = async () => {
    this.requests.files = [this.filesProcessor.fetch({
      catalogRecord: this.EtsinDataset.catalogRecord,
      resolved: this.constructResolvedCb('files'),
      rejected: this.constructRejectedCb('files'),
    })]

    return this.requests.files[0].promise
  }

  @action
  fetchPackages = async () => {
    if (!this.EtsinDataset.isDownloadAllowed) return null

    this.isLoading.packages = true
    this.requests.packages = [this.filesProcessor.fetchPackages({
      catalogRecord: this.EtsinDataset.catalogRecord,
      resolved: this.constructResolvedCb("packages"),
      rejected: this.constructRejectedCb("packages"),
    })]
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
    this.Access.updateAccess(
      data.catalog_record.research_dataset.access_rights,
      data.has_permit || false,
      data.application_state || undefined
    )
  }

  @action.bound setLoadingOn() {
    this.Accessibility.announcePolite(translate('dataset.loading'))
    this.isLoading.dataset = true
    this.isLoading.relations = true
    this.isLoading.versions = true
    this.isLoading.files = true
  }
}

export default Etsin
