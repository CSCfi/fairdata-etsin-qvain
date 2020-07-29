import { observable, action } from 'mobx'

class QvainDatasets {
  @observable publishedDataset = null

  @action
  setPublishedDataset = (identifier) => {
    this.publishedDataset = identifier
  }
}

export default new QvainDatasets()
