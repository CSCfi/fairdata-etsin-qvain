export default async (Store, Field) => {
  const { inEdit, create, setValidationError, addTemporal, schema } = Field
  try {
    await schema.validate(inEdit, { strict: true })
  } catch (e) {
    setValidationError(e.message)
    return
  }
  addTemporal()
  create()
}
