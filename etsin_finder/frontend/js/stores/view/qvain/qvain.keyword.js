import { override, makeObservable } from 'mobx'
import * as yup from 'yup'
import ReferenceField from './qvain.referenceField'

export const keywordsSchema = yup
  .string()
  .typeError('qvain.validationMessages.keywords.string')
  .max(1000, 'qvain.validationMessages.keywords.max')

export const keywordsArraySchema = yup
  .array()
  .of(keywordsSchema)
  .required('qvain.validationMessages.keywords.required')

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
