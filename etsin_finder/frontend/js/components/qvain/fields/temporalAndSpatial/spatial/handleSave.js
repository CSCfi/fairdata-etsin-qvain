import { spatialNameSchema, spatialAltitudeSchema } from '../../../utils/formValidation'

export default async Field => {
  const { inEdit, save, clearInEdit, setValidationError } = Field

  try {
    await spatialNameSchema.validate(inEdit.name)
    await spatialAltitudeSchema.validate(inEdit.altitude)
  } catch (e) {
    setValidationError(e.message)
    return
  }

  await save()
  clearInEdit()
}
