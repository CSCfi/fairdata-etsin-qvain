import { spatialNameSchema, spatialAltitudeSchema } from '../../../utils/formValidation'

export default async Field => {
  const { inEdit, save, clearInEdit, setValidationError } = Field
  try {
    await spatialNameSchema.validate(inEdit.name, { strict: true })
    await spatialAltitudeSchema.validate(inEdit.altitude, { strict: true })
  } catch (e) {
    setValidationError(e.message)
    return
  }
  await save()
  clearInEdit()
}
