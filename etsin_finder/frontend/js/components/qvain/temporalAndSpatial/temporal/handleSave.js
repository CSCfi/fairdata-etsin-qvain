import { temporalDateSchema } from '../../utils/formValidation'

export default async (Store, Field) => {
  const { inEdit, create, setValidationError } = Field
  const { addToField } = Store
  try {
    await temporalDateSchema.validate(inEdit)
  } catch (e) {
    setValidationError(e.message)
    return
  }
  addToField('temporals', inEdit)
  create()
}
