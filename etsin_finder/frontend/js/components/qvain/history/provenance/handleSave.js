import { provenanceNameSchema } from '../../utils/formValidation'

export default async (Field) => {
  const { inEdit, save, clearInEdit, setValidationError } = Field

  try {
    await provenanceNameSchema.validate(inEdit.name)

    if ((inEdit.name.fi || inEdit.name.en) && !inEdit.name.und) {
      inEdit.name.und = inEdit.name.fi || inEdit.name.en
    }

    await save()
    clearInEdit()
  } catch (e) {
    setValidationError(e.message)
  }
}
