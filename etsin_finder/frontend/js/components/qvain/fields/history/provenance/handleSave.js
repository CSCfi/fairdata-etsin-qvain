import {
  provenanceNameSchema,
  provenanceStartDateSchema,
  provenanceEndDateSchema,
} from '../../../utils/formValidation'

export default async Field => {
  const { inEdit, save, clearInEdit, setValidationError } = Field

  try {
    await provenanceNameSchema.validate(inEdit.name, { strict: true })
    if (inEdit.startDate || inEdit.endDate) {
      await provenanceStartDateSchema.validate(inEdit.startDate, { strict: true })
      await provenanceEndDateSchema.validate(inEdit.endDate, { strict: true })
    }

    if ((inEdit.name.fi || inEdit.name.en) && !inEdit.name.und) {
      inEdit.name.und = inEdit.name.fi || inEdit.name.en
    }

    await save()
    clearInEdit()
  } catch (e) {
    setValidationError(e.message)
  }
}
