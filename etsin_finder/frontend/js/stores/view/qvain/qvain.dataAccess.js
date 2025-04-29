import * as yup from 'yup'

import SingleValueField from './qvain.singleValueField'
import MultiLanguageField from './qvain.multiLanguageField'
import { ACCESS_TYPE_URL } from '@/utils/constants'
import removeEmpty from '@/utils/removeEmpty'

export const dataAccessMultilanguageSchema = yup.object().shape({
  fi: yup
    .string()
    .typeError('qvain.validationMessages.description.string')
    .max(50000, 'qvain.validationMessages.description.max'),
  en: yup
    .string()
    .typeError('qvain.validationMessages.description.string')
    .max(50000, 'qvain.validationMessages.description.max'),
})

class DataAccess {
  constructor(Parent) {
    this.Parent = Parent
    this.remsApprovalType = new SingleValueField(this) // schema
    this.applicationInstructions = new MultiLanguageField(this, dataAccessMultilanguageSchema, {
      characterLimit: 1,
    })
    this.terms = new MultiLanguageField(this, dataAccessMultilanguageSchema, {
      characterLimit: 50000,
    })
    this.reviewerInstructions = new MultiLanguageField(this, dataAccessMultilanguageSchema, {
      characterLimit: 50000,
    })
  }

  reset() {
    this.remsApprovalType.reset()
    this.applicationInstructions.reset()
    this.terms.reset()
    this.reviewerInstructions.reset()
  }

  validate() {
    this.remsApprovalType.validate()
    this.applicationInstructions.validate()
    this.terms.validate()
    this.reviewerInstructions.validate()
  }

  multiLanguageFieldFromBackend(field, value) {
    field.reset()
    if (value) {
      for (const lang of Object.keys(value)) {
        field.value[lang] = value[lang]
      }
    }
  }

  fromBackend = dataset => {
    this.reset()
    const accessRights = dataset.access_rights
    if (!accessRights) {
      return
    }
    this.remsApprovalType.value = accessRights.rems_approval_type
    this.multiLanguageFieldFromBackend(
      this.applicationInstructions,
      accessRights.data_access_application_instructions
    )
    this.multiLanguageFieldFromBackend(this.terms, accessRights.data_access_terms)
    this.multiLanguageFieldFromBackend(
      this.reviewerInstructions,
      accessRights.data_access_reviewer_instructions
    )
  }

  toBackend = () =>
    removeEmpty({
      rems_approval_type: this.remsApprovalType.value,
      data_access_application_instructions: this.applicationInstructions.value,
      data_access_terms: this.terms.value,
      data_access_reviewer_instructions: this.reviewerInstructions.value,
    })

  shouldShowDataAccess(accessType) {
    return (
      accessType.url === ACCESS_TYPE_URL.PERMIT || accessType.url === ACCESS_TYPE_URL.RESTRICTED
    )
  }

  setChanged(value) {
    this.Parent.setChanged(value)
  }
}

export default DataAccess
