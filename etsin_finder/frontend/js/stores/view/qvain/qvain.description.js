import { action, makeObservable } from 'mobx'

import { descriptionSchema } from '../../../components/qvain/utils/formValidation'
import MultiLanguageField from './qvain.multiLanguageField'

class Description extends MultiLanguageField {
  constructor(Parent) {
    super(Parent, descriptionSchema)
    makeObservable(this)
  }

  @action
  fromBackend = dataset => {
    this.value = { en: dataset.description?.en || '', fi: dataset.description?.fi || '' }
  }
}

export default Description
