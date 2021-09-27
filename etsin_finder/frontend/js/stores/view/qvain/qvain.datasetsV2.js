import { action, computed, makeObservable, observable } from 'mobx'

import Tabs from './qvain.datasetsV2.tabs'

class QvainDatasetsV2 {
  constructor(QvainDatasets) {
    makeObservable(this)
    this.tabs = new Tabs()
    this.QvainDatasets = QvainDatasets
    this.reset()
  }

  @action.bound reset() {
    this.showCount = { initial: 10, current: 10, increment: 10 }
  }

  @observable showCount

  @computed get moreAvailable() {
    return this.showCount.current < this.QvainDatasets.datasetGroups.length
  }

  @action.bound setShowCount({ initial, current, increment }) {
    this.showCount = { initial, current, increment }
  }

  @action.bound showMore() {
    this.showCount.current += this.showCount.increment
  }

  @computed get datasets() {
    return this.QvainDatasets.datasets
  }

  @computed get datasetGroups() {
    return this.QvainDatasets.datasetGroups.slice(0, this.showCount.current)
  }
}

export default QvainDatasetsV2
