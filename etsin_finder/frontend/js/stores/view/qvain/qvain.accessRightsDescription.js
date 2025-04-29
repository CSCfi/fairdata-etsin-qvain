import { makeObservable, action } from 'mobx'
import * as yup from 'yup'

import MultiLanguageField from './qvain.multiLanguageField'

export const accessRightsDescriptionSchema = yup.object().shape({
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

// Validation for draft datasets: description is optional
export const accessRightsDescriptionDraftSchema = accessRightsDescriptionSchema.nullable()

class AccessRightsDescription extends MultiLanguageField {
  constructor(Parent) {
    super(Parent, accessRightsDescriptionSchema, { characterLimit: 50000 })
    makeObservable(this)
  }

  @action
  fromBackend = dataset => {
    this.value = {
      en: dataset.access_rights?.description?.en || '',
      fi: dataset.access_rights?.description?.fi || '',
      sv: dataset.access_rights?.description?.sv || '',
    }
  }

  schema = accessRightsDescriptionSchema
}

export default AccessRightsDescription
