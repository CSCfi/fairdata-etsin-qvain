import { observable, action, makeObservable } from 'mobx'

class QvainDatasets {
  constructor() {
    makeObservable(this)
  }

  @observable publishedDataset = null

  @action
  setPublishedDataset = identifier => {
    this.publishedDataset = identifier
  }
}

export default new QvainDatasets()
