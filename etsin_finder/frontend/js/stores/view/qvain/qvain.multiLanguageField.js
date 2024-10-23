import { makeObservable, override } from 'mobx'
import SingleValueField from './qvain.singleValueField'
import removeEmpty from '@/utils/removeEmpty'

class MultiLanguageField extends SingleValueField {
  constructor(Parent, Schema) {
    super(Parent, Schema, { fi: '', en: '' })
    this.Parent = Parent
    makeObservable(this)
  }

  @override set(value, lang) {
    this.value[lang] = value
    this.setValidationError(null)
    this.Parent.setChanged(true)
  }

  toBackend = () => removeEmpty(this.value)
}

export default MultiLanguageField
