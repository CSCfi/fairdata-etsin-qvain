import { observable, action, makeObservable, override } from 'mobx'

import { PublicItemsView } from '../common.files.views'

import PromiseManager from '../../../utils/promiseManager'

const EtsinFilesMixin = superclass =>
  class extends superclass {
    // File hierarchy for files that are accessible through a public dataset. Does not support editing.
    constructor(Env) {
      super(Env)
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

    getEquivalentItemScope = item => {
      // Return topmost path that contains the same files as current item
      if (!item.parent) {
        return '/'
      }
      if (item.parent.directChildCount === 1) {
        return this.getEquivalentItemScope(item.parent)
      }
      return this.getItemPath(item)
    }

    getUseCategoryLabel(item) {
      return item.originalMetadata?.use_category?.pref_label || null
    }

    getFileTypeLabel(item) {
      return item.originalMetadata?.file_type?.pref_label || null
    }
  }

export default EtsinFilesMixin
