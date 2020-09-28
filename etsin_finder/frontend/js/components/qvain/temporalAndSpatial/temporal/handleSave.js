import { temporalDateSchema } from '../../utils/formValidation'

export default async (Store, Field) => {
  const { inEdit, reset, setValidationError, addTemporal } = Field
  try {
    await temporalDateSchema.validate(inEdit)
  } catch (e) {
    setValidationError(e.message)
    return
  }
  addTemporal()
  reset()
}
