import { relatedResourceNameSchema } from '../../utils/formValidation'

export default async (Field) => {
  const { inEdit, save, clearInEdit, setValidationError } = Field

  try {
    await relatedResourceNameSchema.validate(inEdit.name)

    if ((inEdit.name.fi || inEdit.name.en) && !inEdit.name.und) {
      inEdit.name.und = inEdit.name.fi || inEdit.name.en
    }

    await save()
    clearInEdit()
  } catch (e) {
    setValidationError(e.message)
  }
}
