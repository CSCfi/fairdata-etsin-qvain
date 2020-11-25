import { action, makeObservable } from 'mobx'
import ReferenceField from './qvain.referenceField'

class Keywords extends ReferenceField {
  constructor(Parent, defaultStorageFactory = () => [], defaultItem = undefined) {
    super(Parent, defaultStorageFactory, defaultItem)
    makeObservable(this)
  }

  @action
  addKeyword = () => {
    if (this.itemStr.length > 0) {
      const keywordsInString = this.itemStr.split(',').map(word => word.trim())
      const noEmptyKeywords = keywordsInString.filter(kw => kw !== '')
      const uniqKeywords = [...new Set(noEmptyKeywords)]
      const keywordsToStore = uniqKeywords.filter(word => !this.storage.includes(word))
      this.set([...this.storage, ...keywordsToStore])
      this.removeItemStr()
      this.changed = true
    }
  }

  fromBackend = dataset => {
    this.storage = dataset.keyword || []
    this.removeItemStr()
  }

  toBackend = () => this.storage
}

export default Keywords
