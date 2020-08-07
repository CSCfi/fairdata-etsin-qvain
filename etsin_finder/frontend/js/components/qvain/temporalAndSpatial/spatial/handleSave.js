import { spatialNameSchema, spatialAltitudeSchema } from '../../utils/formValidation'

export default async (Field, translationsRoot) => {
  const { inEdit, save, clearInEdit, setValidationError } = Field
  const altNanError = `${translationsRoot}.error.altitudeNan`
  try {
    await spatialNameSchema.validate(inEdit.name)
  } catch (e) {
    setValidationError(e.message)
    return;
  }
  // number validation translation cannot be placed into validationForm because number() doesn't have message argument
  try {
    await spatialAltitudeSchema.validate(inEdit.altitude)
  } catch (e) {
    if (inEdit.altitude) {
      setValidationError(altNanError)
      return;
    }
  }
  await save()
  clearInEdit()
}
