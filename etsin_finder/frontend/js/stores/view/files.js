import { observable, action, makeObservable, override } from 'mobx'

import { dirIdentifierKey, fileIdentifierKey } from './common.files.items'
import { PublicItemsView } from './common.files.views'

import FilesBase from './common.files'
import PromiseManager from '../../utils/promiseManager'

class Files extends FilesBase {
  // File hierarchy for files that are accessible through a public dataset. Does not support editing.

  constructor() {
    super()
    makeObservable(this)
    this.View = new PublicItemsView(this)
    this.promiseManager = new PromiseManager()
    this.reset()
  }

  @observable inInfo = null

  @observable files = []

  @observable directories = []

  @override reset() {
    super.reset.call(this)
    this.View.reset()
    this.inInfo = null
  }

  @action setInInfo = item => {
    this.inInfo = item
  }

  getUseCategoryLabel = item => {
    const key = item.type === 'file' ? fileIdentifierKey(item) : dirIdentifierKey(item)
    if (this.originalMetadata[key]) {
      return this.originalMetadata[key].useCategoryLabel
    }
    return null
  }

  getFileTypeLabel = item => {
    const key = item.type === 'file' ? fileIdentifierKey(item) : dirIdentifierKey(item)
    if (this.originalMetadata[key]) {
      return this.originalMetadata[key].fileTypeLabel
    }
    return null
  }
}

export default Files
