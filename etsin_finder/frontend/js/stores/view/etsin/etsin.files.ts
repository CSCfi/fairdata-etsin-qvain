import { action, observable } from 'mobx'

import type Env from '@/stores/domain/env'
import PromiseManager from '../../../utils/promiseManager'
import { FilesBaseV3 } from '../common.files'
import { PublicItemsView } from '../common.files.views'

export class EtsinFiles extends FilesBaseV3 {
  View: PublicItemsView

  // File hierarchy for files that are accessible through a public dataset. Does not support editing.
  constructor(Env: Env) {
    super(Env)
    this.View = new PublicItemsView(this)
    this.promiseManager = new PromiseManager()
    this.reset()
  }

  @observable accessor inInfo = null

  @observable accessor files = []

  @observable accessor directories = []

  @action.bound reset() {
    super.reset.call(this)
    this.View.reset()
    this.inInfo = null
  }

  @action setInInfo = (item: any) => {
    this.inInfo = item
  }

  getEquivalentItemScope = (item: any): string => {
    // Return topmost path that contains the same files as current item
    if (!item.parent) {
      return '/'
    }
    if (item.parent.directChildCount === 1) {
      return this.getEquivalentItemScope(item.parent)
    }
    return this.getItemPath(item)
  }

  getUseCategoryLabel(item: any) {
    return item.originalMetadata?.use_category?.pref_label || null
  }

  getFileTypeLabel(item: any) {
    return item.originalMetadata?.file_type?.pref_label || null
  }
}

const createFilesStore = (Env: Env) => new EtsinFiles(Env)

export default createFilesStore
