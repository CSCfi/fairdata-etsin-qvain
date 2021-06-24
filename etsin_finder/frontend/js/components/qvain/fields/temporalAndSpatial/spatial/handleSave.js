export default async Field => {
  const { inEdit, save, clearInEdit, setValidationError, schema } = Field

  try {
    await schema.validate(inEdit, { strict: true })
  } catch (e) {
    setValidationError(e.message)
    return
  }

  await save()
  clearInEdit()
}
