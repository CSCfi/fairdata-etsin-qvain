import { makeObservable, action } from 'mobx'
import MultiLanguageField from './qvain.multiLanguageField'
import { titleSchema } from '../../../components/qvain/utils/formValidation'

class Title extends MultiLanguageField {
  constructor(Parent) {
    super(Parent, titleSchema)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.value = { en: dataset.title.en || '', fi: dataset.title.fi || '' }
  }
}

export default Title
