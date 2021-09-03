export default async Field => {
  const { inEdit, save, clearInEdit, setValidationError, schema } = Field
  try {
    await schema.validate(inEdit, { strict: true })

    if ((inEdit.name.fi || inEdit.name.en) && !inEdit.name.und) {
      inEdit.name.und = inEdit.name.fi || inEdit.name.en
    }

    await save()
    clearInEdit()
  } catch (e) {
    setValidationError(e.message)
  }
}
