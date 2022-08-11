import { makeObservable, action, computed } from 'mobx'
import * as yup from 'yup'

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
    super(Parent, descriptionSchema)
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

  @computed get charactersRemaining() {
    return {
      fi: 50000 - (this.value?.fi?.length || 0),
      en: 50000 - (this.value?.en?.length || 0),
      sv: 50000 - (this.value?.sv?.length || 0),
    }
  }

  schema = descriptionSchema
}

export default Description
