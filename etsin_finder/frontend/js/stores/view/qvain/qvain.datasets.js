import { computed, observable, action, makeObservable, runInAction } from 'mobx'
import PromiseManager from '../../../utils/promiseManager'
import Modal from './modal'

import { filterGroups } from './qvain.datasets.filters'
import AbortClient, { isAbort } from '@/utils/AbortClient'

import Tabs from '../tabs'
import ShareV3 from './qvain.datasetsV3.share'
import Sort from './qvain.datasetsV2.sort'
import Adapter from './qvain.adapter'

class QvainDatasets {
  constructor(Env, Auth, Locale) {
    makeObservable(this)
    this.Env = Env
    this.Auth = Auth
    this.Locale = Locale
    this.tabs = new Tabs({ ownDatasets: 'qvain.datasets.tabs.own' }, 'ownDatasets')
    this.ownDatasets = new QvainDatasetList({
      Locale,
      Auth,
      Env,
      params: {
        pagination: false,
        only_owned_or_shared: true,
        publishing_channels: 'qvain',
        ordering: '-created',
        latest_versions: true,
        fields: [
          'created',
          'data_catalog',
          'dataset_versions',
          'draft_of',
          'id',
          'metadata_owner',
          'next_draft',
          'persistent_identifier',
          'state',
          'title',
        ].join(','),
      },
    })
    this.adminDatasets = new QvainDatasetList({
      Locale,
      Auth,
      Env,
      params: {
        pagination: false,
        only_admin: true,
        publishing_channels: 'qvain',
        ordering: '-created',
        latest_versions: true,
        fields: [
          'created',
          'data_catalog',
          'dataset_versions',
          'draft_of',
          'id',
          'metadata_owner',
          'next_draft',
          'persistent_identifier',
          'state',
          'title',
        ].join(','),
      },
    })

    this.shareV3 = new ShareV3(Env, Auth, this)
    this.promiseManager = new PromiseManager()
    this.removeModal = new Modal()
    this.shareModal = new Modal()
    this.client = new AbortClient()
  }

  @computed get share() {
    return this.shareV3
  }

  @observable _error = null

  @observable minDatasetsForSearchTool = 5

  @observable publishedDataset = null

  @action.bound reset() {
    this.ownDatasets.reset()
    this.adminDatasets.reset()
    this.publishedDataset = null
  }

  @action
  setPublishedDataset = publishedDataset => {
    this.reset()
    this.publishedDataset = publishedDataset
  }

  @action.bound setSearchTerm(term = '') {
    this.currentDatasets.setSearchTerm(term)
  }

  @action.bound removeDatasetChanges(dataset) {
    delete dataset.next_draft
  }

  @computed get currentDatasets() {
    return this[this.tabs.active]
  }

  @computed get moreAvailable() {
    return this.currentDatasets?.moreAvailable
  }

  @action.bound showMore() {
    return this.currentDatasets?.showMore()
  }

  @computed get isLoadingDatasets() {
    return this.currentDatasets?.isLoadingDatasets
  }

  @computed get isDatasetsFetched() {
    return this.currentDatasets?.isFetched
  }

  @computed get error() {
    return this._error || this.currentDatasets?.error
  }

  @computed get showCount() {
    return this.currentDatasets?.showCount
  }

  @computed get datasetGroups() {
    return this.currentDatasets?.datasetGroups
  }

  @computed get filteredGroups() {
    return this.currentDatasets?.filteredGroups
  }

  @computed get searchTerm() {
    return this.currentDatasets?.searchTerm
  }

  @computed get sort() {
    return this.currentDatasets?.sort
  }

  @action.bound setError(error) {
    this.currentDatasets?.setError(error)
  }

  @action.bound setShowCount(showCount) {
    this.currentDatasets?.setShowCount(showCount)
  }

  @action.bound removeDataset(dataset) {
    this.currentDatasets?.removeDataset(dataset)
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

  loadDataset = async id => {
    await this[id].loadDatasets()
  }
}

export default QvainDatasets

class QvainDatasetList {
  constructor(args) {
    makeObservable(this)
    this.Locale = args.Locale
    this.Auth = args.Auth
    this.Env = args.Env
    this.params = args.params
    this.onLoad = args.onLoad
    this.promiseManager = new PromiseManager()
    this.client = new AbortClient()
    this.sort = new Sort(this.Locale)
  }

  @observable datasets = []

  @observable error = null

  @observable showCount = { initial: 10, current: 10, increment: 10 }

  @observable loadTime = new Date()

  @observable searchTerm = ''

  @observable isLoading = false

  @observable isFetched = false

  @action.bound setSearchTerm(term = '') {
    this.searchTerm = term
  }

  @action.bound reset() {
    if (this.datasets.replace) {
      this.datasets.replace([])
    } else {
      // datasets.replace does not work in tests that mock mobx
      this.datasets = []
    }
    this.error = null
    this.client.abort()
    this.showCount = { initial: 10, current: 10, increment: 10 }
    this.loadTime = new Date()
    this.searchTerm = ''
    this.isFetched = false
    this.isLoading = false
  }

  @action loadDatasets = async () => {
    try {
      this.clearError()
      this.isLoading = true
      const response = await this.promiseManager.add(
        this.client.get(this.Env.metaxV3Url('datasets'), { params: this.params }),
        'datasets'
      )
      const adapter = new Adapter(this.Auth)
      const latestDatasets = response.data.map(d => adapter.convertV3ToV2(d))

      // Attach drafts to original datasets
      const allDatasets = latestDatasets
        .map(d => (d.dataset_version_set.length > 0 ? d.dataset_version_set : [d]))
        .flat()
      const datasets = allDatasets.filter(dataset => !dataset.draft_of)
      const datasetDrafts = allDatasets.filter(dataset => dataset.draft_of)
      this.attachDrafts(datasets, datasetDrafts)

      // Set latest versions as "top-level" datasets
      this.setDatasets(latestDatasets)
    } catch (error) {
      if (!isAbort(error)) {
        console.error(error)
        this.setError(error?.response?.data || error)
      }
    } finally {
      runInAction(() => {
        this.isLoading = false
        this.isFetched = true
      })
    }
  }

  @action.bound setDatasets(datasets) {
    this.datasets = datasets
    this.onLoad?.()
  }

  @action.bound attachDrafts(datasets, drafts) {
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

  @action.bound removeDataset(dataset) {
    dataset.date_removed = new Date() // datasets that have date_removed are ignored in the list
  }

  @action.bound setError(error) {
    this.error = error
  }

  @action.bound clearError() {
    this.error = null
  }

  @computed get moreAvailable() {
    return this.showCount.current < filterGroups(this.searchTerm, this.datasetGroups).length
  }

  @action.bound setShowCount({ initial, current, increment }) {
    this.showCount = { initial, current, increment }
  }

  @action.bound showMore() {
    this.showCount = {
      ...this.showCount,
      current: this.showCount.current + this.showCount.increment,
    }
  }

  @computed get isLoadingDatasets() {
    return this.promiseManager.count('datasets') > 0
  }

  @computed get filteredGroups() {
    const groups = filterGroups(this.searchTerm, this.datasetGroups)
    return this.sort.sorted(groups).slice(0, this.showCount.current)
  }

  @computed get datasetGroups() {
    // Group datasets by version sets
    const datasetVersions = this.datasets.map(d =>
      d.dataset_version_set.length > 0 ? d.dataset_version_set : [d]
    )
    // Remove versions that are removed or drafts of an existing dataset
    return datasetVersions
      .map(versions => versions.filter(v => !v.draft_of && !v.date_removed))
      .filter(versions => versions.length > 0)
  }
}
