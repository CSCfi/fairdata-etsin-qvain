import { computed, observable, action, makeObservable } from 'mobx'
import PromiseManager from '../../../utils/promiseManager'
import Modal from './modal'
import urls from '../../../utils/urls'

import { filterGroups, groupDatasetsByVersionSet } from './qvain.datasets.filters'
import AbortClient, { isAbort } from '@/utils/AbortClient'

import Tabs from './tabs'
import Share from './qvain.datasetsV2.share'
import ShareV3 from './qvain.datasetsV3.share'
import Sort from './qvain.datasetsV2.sort'

class QvainDatasets {
  constructor(Env, Locale) {
    makeObservable(this)
    this.Env = Env
    this.tabs = new Tabs({ all: 'qvain.datasets.tabs.all' }, 'all')
    this.shareV2 = new Share()
    this.shareV3 = new ShareV3(Env)
    this.sort = new Sort(Locale)
    this.promiseManager = new PromiseManager()
    this.removeModal = new Modal()
    this.shareModal = new Modal()
    this.client = new AbortClient()
    this.reset()
  }

  @computed get share() {
    if (this.Env.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')) {
      return this.shareV3
    }
    return this.shareV2
  }

  @observable showCount

  @computed get moreAvailable() {
    return this.showCount.current < filterGroups(this.searchTerm, this.datasetGroups).length
  }

  @action.bound setShowCount({ initial, current, increment }) {
    this.showCount = { initial, current, increment }
  }

  @action.bound showMore() {
    this.showCount.current += this.showCount.increment
  }

  @computed get filteredGroups() {
    const groups = filterGroups(this.searchTerm, this.datasetGroups)
    return this.sort.sorted(groups).slice(0, this.showCount.current)
  }

  @observable datasets = []

  @observable error = null

  @observable minDatasetsForSearchTool = 5

  @observable publishedDataset = null

  @observable searchTerm = ''

  @observable loadTime = new Date()

  @action.bound reset() {
    if (this.datasets.replace) {
      this.datasets.replace([])
    } else {
      // datasets.replace does not work in tests that mock mobx
      this.datasets = []
    }
    this.error = null
    this.publishedDataset = null
    this.removeModal.close()
    this.shareModal.close()
    this.client.abort()
    this.showCount = { initial: 10, current: 10, increment: 10 }
  }

  @action.bound setDatasets(datasets) {
    this.datasets = datasets
    this.loadTime = new Date()
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

  @computed get datasetGroups() {
    return groupDatasetsByVersionSet(this.datasets)
  }

  @computed get isLoadingDatasets() {
    return this.promiseManager.count('datasets') > 0
  }

  @action.bound removeDatasetChanges(dataset) {
    delete dataset.next_draft
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
    } catch (error) {
      if (!isAbort(error)) {
        console.error(error)
        this.setError(error?.response?.data || error)
      }
    }
  }
}

export default QvainDatasets
