import { override, makeObservable } from 'mobx'
import { keywordsSchema, keywordsArraySchema } from '../../../components/qvain/utils/formValidation'
import ReferenceField from './qvain.referenceField'

class Keywords extends ReferenceField {
  constructor(Parent, defaultStorageFactory = () => [], defaultItem = undefined) {
    super(Parent, defaultStorageFactory, defaultItem)
    this.reset()
    makeObservable(this)
  }

  @override
  addItemStr() {
    if (this.itemStr.length > 0) {
      const keywordsInString = this.itemStr.split(',').map(word => word.trim())
      const noEmptyKeywords = keywordsInString.filter(kw => kw !== '')
      const uniqKeywords = [...new Set(noEmptyKeywords)]
      const keywordsToStore = uniqKeywords.filter(word => !this.storage.includes(word))
      this.set([...this.storage, ...keywordsToStore])
      this.removeItemStr()
    }
  }

  fromBackend = dataset => {
    this.storage = dataset.keyword || []
    this.removeItemStr()
  }

  toBackend = () => this.storage

  itemSchema = keywordsSchema

  Schema = keywordsArraySchema

  translationsRoot = 'qvain.description.keywords'
}

export default Keywords
