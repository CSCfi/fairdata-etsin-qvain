import { observable, action } from 'mobx'

import { dirIdentifierKey, fileIdentifierKey } from './common.files.items'
import { PromiseManager } from './common.files.utils'
import { PublicItemsView } from './common.files.views'

import FilesBase from './common.files'

class Files extends FilesBase {
  // File hierarchy for files that are accessible through a public dataset. Does not support editing.

  constructor() {
    super()
    this.View = new PublicItemsView(this)
    this.promiseManager = new PromiseManager()
    this.reset()
  }

  @observable inInfo = null

  cancelOnReset = (promise) => (this.promiseManager.add(promise))

  @action reset() {
    super.reset.call(this)
    this.View.reset()
    this.promiseManager.reset()
    this.inInfo = null
  }

  @action setInInfo = (item) => {
    this.inInfo = item
  }

  getUseCategoryLabel = (item) => {
    const key = item.type === 'file' ? fileIdentifierKey(item) : dirIdentifierKey(item)
    if (this.originalMetadata[key]) {
      return this.originalMetadata[key].useCategoryLabel
    }
    return null
  }

  getFileTypeLabel = (item) => {
    const key = item.type === 'file' ? fileIdentifierKey(item) : dirIdentifierKey(item)
    if (this.originalMetadata[key]) {
      return this.originalMetadata[key].fileTypeLabel
    }
    return null
  }
}

export default Files
