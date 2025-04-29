import { makeObservable, action } from 'mobx'
import * as yup from 'yup'
import '@/utils/extendYup'

import MultiLanguageField from './qvain.multiLanguageField'

const descriptionSchemaBase = yup.object().shape({
  fi: yup
    .string()
    .typeError('qvain.validationMessages.description.string')
    .max(50000, 'qvain.validationMessages.description.max'),
  en: yup
    .string()
    .typeError('qvain.validationMessages.description.string')
    .max(50000, 'qvain.validationMessages.description.max'),
  sv: yup
    .string()
    .typeError('qvain.validationMessages.description.string')
    .max(50000, 'qvain.validationMessages.description.max'),
})

export const descriptionSchema = descriptionSchemaBase
  .requireTranslation('qvain.validationMessages.description.required')
  .required('qvain.validationMessages.description.required')

// Validation for draft datasets: description is optional
export const descriptionDraftSchema = descriptionSchemaBase.nullable()

class Description extends MultiLanguageField {
  constructor(Parent) {
    super(Parent, descriptionSchema, { characterLimit: 50000 })
    makeObservable(this)
  }

  @action
  fromBackend = dataset => {
    this.value = {
      en: dataset.description?.en || '',
      fi: dataset.description?.fi || '',
      sv: dataset.description?.sv || '',
    }
  }

  schema = descriptionSchema
}

export default Description
