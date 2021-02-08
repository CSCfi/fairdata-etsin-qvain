import { observable, action, makeObservable } from 'mobx'

class QvainDatasets {
  constructor() {
    makeObservable(this)
  }

  @observable datasetsPerPage = 20

  @observable minDatasetsForSearchTool = 5

  @observable publishedDataset = null

  @action
  setDatasetsPerPage = (datasetsPerPage) => {
    this.datasetsPerPage = datasetsPerPage
  }

  @action
  setPublishedDataset = identifier => {
    this.publishedDataset = identifier
  }
}

export default new QvainDatasets()
