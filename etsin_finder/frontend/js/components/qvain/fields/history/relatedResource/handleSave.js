import { relatedResourceNameSchema, relatedResourceTypeSchema } from '../../../utils/formValidation'

export default async (Field, options = {}) => {
  const { inEdit, save, clearInEdit, setValidationError } = Field

  try {
    await relatedResourceNameSchema.validate(inEdit.name, { strict: true })
    if (!options.noRelationType) {
      await relatedResourceTypeSchema.validate(inEdit.relationType, { strict: true })
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
