import { makeObservable, action } from 'mobx'
import * as yup from 'yup'
import MultiLanguageField from './qvain.multiLanguageField'

export const titleSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup
      .string()
      .typeError('qvain.validationMessages.title.string')
      .max(500, 'qvain.validationMessages.title.max'),
    otherwise: yup
      .string()
      .typeError('qvain.validationMessages.title.string')
      .max(500, 'qvain.validationMessages.title.max')
      .required('qvain.validationMessages.title.required'),
  }),
  en: yup
    .string()
    .typeError('qvain.validationMessages.title.string')
    .max(500, 'qvain.validationMessages.title.max'),
})

class Title extends MultiLanguageField {
  constructor(Parent) {
    super(Parent, titleSchema)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.value = { en: dataset.title?.en || '', fi: dataset.title?.fi || '' }
  }
}

export default Title
