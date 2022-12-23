import { computed, observable, action, makeObservable } from 'mobx'
import PromiseManager from '../../../utils/promiseManager'
import Modal from './modal'
import urls from '../../../utils/urls'

import { filterGroups, groupDatasetsByVersionSet } from './qvain.datasets.filters'
import AbortClient, { isAbort } from '@/utils/AbortClient'

class QvainDatasets {
  constructor() {
    makeObservable(this)
    this.promiseManager = new PromiseManager()
    this.removeModal = new Modal()
    this.shareModal = new Modal()
    this.client = new AbortClient()
  }

  @observable datasets = []

  @observable error = null

  @observable page = 1

  @observable datasetsPerPage = 20

  @observable minDatasetsForSearchTool = 5

  @observable publishedDataset = null

  @observable searchTerm = ''

  @observable loadTime = new Date()

  @action.bound reset() {
    this.datasets.replace([])
    this.error = null
    this.page = 1
    this.publishedDataset = null
    this.removeModal.close()
    this.shareModal.close()
    this.client.abort()
  }

  @action.bound setDatasets(datasets) {
    this.datasets = datasets
    this.loadTime = new Date()
  }

  @action.bound setPage(page) {
    let newPage = page
    if (this.pageCount < newPage) {
      this.page = this.pageCount
    }
    if (newPage < 1) {
      newPage = 1
    }
    this.page = newPage
  }

  @action
  setDatasetsPerPage = datasetsPerPage => {
    this.datasetsPerPage = datasetsPerPage
  }

  @action
  setPublishedDataset = identifier => {
    this.publishedDataset = identifier
  }

  @action.bound setSearchTerm(term) {
    this.searchTerm = term
  }

  @action.bound setError(error) {
    this.error = error
  }

  @action.bound clearError() {
    this.error = null
  }

  @computed get pageCount() {
    return Math.ceil(this.count / this.datasetsPerPage)
  }

  @computed get datasetGroupsOnPage() {
    const pageIndex = this.page - 1
    const { datasetsPerPage } = this
    return this.filteredGroups.slice(pageIndex * datasetsPerPage, (pageIndex + 1) * datasetsPerPage)
  }

  @computed get datasetGroups() {
    return groupDatasetsByVersionSet(this.datasets)
  }

  @computed get filteredGroups() {
    return filterGroups(this.searchTerm, this.datasetGroups)
  }

  @computed get count() {
    return this.filteredGroups.length
  }

  @computed get isLoadingDatasets() {
    return this.promiseManager.count('datasets') > 0
  }

  @action.bound removeDatasetChanges(dataset) {
    const datasetIndex = this.datasets.findIndex(d => d.identifier === dataset.identifier)
    if (datasetIndex >= 0) {
      delete dataset.next_draft
    }
  }

  @action.bound removeDataset(dataset) {
    const { datasets } = this
    const { identifier } = dataset
    const datasetIndex = datasets.findIndex(d => d.identifier === identifier)
    if (datasetIndex >= 0) {
      datasets.replace(datasets.filter(d => d.identifier !== identifier))
    }
  }

  attachDrafts = (datasets, drafts) => {
    // Assign draft dataset to next_draft field of original dataset, so all fields
    // of the draft are available from the original dataset instead of just identifiers.
    const datasetsById = {}
    datasets.forEach(dataset => {
      datasetsById[dataset.identifier] = dataset
    })
    drafts.forEach(draft => {
      const dataset = datasetsById[draft.draft_of.identifier]
      if (dataset && dataset.next_draft && dataset.next_draft.identifier === draft.identifier) {
        Object.assign(dataset.next_draft, draft)
      }
    })
  }

  loadDatasets = async () => {
    this.clearError()
    try {
      const url = urls.qvain.datasets()
      const response = await this.promiseManager.add(
        this.client.get(url, { params: { no_pagination: true } }),
        'datasets'
      )
      const data = response.data || []
      const datasets = data.filter(dataset => !dataset.draft_of)
      const datasetDrafts = data.filter(dataset => dataset.draft_of)
      this.attachDrafts(datasets, datasetDrafts)
      this.setDatasets(datasets)
      this.setPage(1)
    } catch (error) {
      if (!isAbort(error)) {
        console.error(error)
        this.setError(error?.response?.data || error)
      }
    }
  }
}

export default QvainDatasets
