import { action } from 'mobx'
import SingleValueField from './qvain.singleValueField'

class MultiLanguageField extends SingleValueField {
  constructor(Parent, Schema) {
    super(Parent, Schema, { fi: '', en: '' })
    this.Parent = Parent
  }

  @action set = (value, lang) => {
    this.value[lang] = value
    this.setValidationError(null)
    this.Parent.setChanged(true)
  }

  toBackend = () => this.value
}

export default MultiLanguageField
