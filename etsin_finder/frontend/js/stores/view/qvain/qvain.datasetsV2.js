import { action, computed, makeObservable, observable } from 'mobx'

import Tabs from './tabs'
import Share from './qvain.datasetsV2.share'
import Sort from './qvain.datasetsV2.sort'

class QvainDatasetsV2 {
  constructor(QvainDatasets, Locale) {
    makeObservable(this)
    this.tabs = new Tabs({ all: 'qvain.datasets.tabs.all' }, 'all')
    this.share = new Share()
    this.QvainDatasets = QvainDatasets
    this.sort = new Sort(Locale)
    this.reset()
  }

  @action.bound reset() {
    this.showCount = { initial: 10, current: 10, increment: 10 }
  }

  @observable showCount

  @computed get moreAvailable() {
    return this.showCount.current < this.QvainDatasets.filteredGroups.length
  }

  @action.bound setShowCount({ initial, current, increment }) {
    this.showCount = { initial, current, increment }
  }

  @action.bound showMore() {
    this.showCount.current += this.showCount.increment
  }

  @computed get filteredGroups() {
    return this.sort.sorted(this.QvainDatasets.filteredGroups).slice(0, this.showCount.current)
  }
}

export default QvainDatasetsV2
