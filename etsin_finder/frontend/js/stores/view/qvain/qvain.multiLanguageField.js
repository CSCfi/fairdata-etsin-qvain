import { computed, makeObservable, override } from 'mobx'
import SingleValueField from './qvain.singleValueField'
import removeEmpty from '@/utils/removeEmpty'

class MultiLanguageField extends SingleValueField {
  constructor(Parent, Schema, { characterLimit } = {}) {
    super(Parent, Schema, { fi: '', en: '' })
    this.Parent = Parent
    this.characterLimit = characterLimit
    makeObservable(this)
  }

  @override set(value, lang) {
    this.value[lang] = value
    this.setValidationError(null)
    this.Parent.setChanged(true)
  }

  @computed
  get charactersRemaining() {
    if (this.characterLimit == null) {
      return undefined
    }
    const remaining = {}
    for (const lang of Object.keys(this.value)) {
      remaining[lang] = this.characterLimit - this.value[lang].length
    }
    return remaining
  }

  toBackend = () => removeEmpty(this.value)
}

export default MultiLanguageField
