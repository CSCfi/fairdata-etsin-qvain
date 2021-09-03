import { action, makeObservable } from 'mobx'
import * as yup from 'yup'

import MultiLanguageField from './qvain.multiLanguageField'

export const descriptionSchema = yup.object().shape({
  fi: yup.mixed().when('en', {
    is: val => val.length > 0,
    then: yup
      .string()
      .typeError('qvain.validationMessages.description.string')
      .max(50000, 'qvain.validationMessages.description.max'),
    otherwise: yup
      .string()
      .typeError('qvain.validationMessages.description.string')
      .max(50000, 'qvain.validationMessages.description.max')
      .required('qvain.validationMessages.description.required'),
  }),
  en: yup
    .string()
    .typeError('qvain.validationMessages.description.string')
    .max(50000, 'qvain.validationMessages.description.max'),
})

// Validation for draft datasets: description is not .required()
export const descriptionDraftSchema = yup
  .object()
  .shape({
    fi: yup.mixed().when('en', {
      is: val => val.length > 0,
      then: yup
        .string()
        .typeError('qvain.validationMessages.description.string')
        .max(50000, 'qvain.validationMessages.description.max'),
      otherwise: yup
        .string()
        .typeError('qvain.validationMessages.description.string')
        .max(50000, 'qvain.validationMessages.description.max'),
    }),
    en: yup
      .string()
      .typeError('qvain.validationMessages.description.string')
      .max(50000, 'qvain.validationMessages.description.max'),
  })
  .nullable()

class Description extends MultiLanguageField {
  constructor(Parent) {
    super(Parent, descriptionSchema)
    makeObservable(this)
  }

  @action
  fromBackend = dataset => {
    this.value = { en: dataset.description?.en || '', fi: dataset.description?.fi || '' }
  }

  schema = descriptionSchema
}

export default Description
