import { makeObservable, action, computed } from 'mobx'
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
    super(Parent, accessRightsDescriptionSchema)
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

  @computed get charactersRemaining() {
    return {
      fi: 50000 - (this.value?.fi?.length || 0),
      en: 50000 - (this.value?.en?.length || 0),
      sv: 50000 - (this.value?.sv?.length || 0),
    }
  }

  schema = accessRightsDescriptionSchema
}

export default AccessRightsDescription
