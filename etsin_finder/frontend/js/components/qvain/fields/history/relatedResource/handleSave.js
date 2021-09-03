export default async (Field, options = {}) => {
  const { inEdit, save, clearInEdit, setValidationError, nameSchema, typeSchema } = Field

  try {
    await nameSchema.validate(inEdit.name, { strict: true })
    if (!options.noRelationType) {
      await typeSchema.validate(inEdit.relationType, { strict: true })
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
