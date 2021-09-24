import { makeObservable, override } from 'mobx'
import * as yup from 'yup'
import SingleValueField from './qvain.singleValueField'
import { touch } from './track'

export const restrictionGroundsIdentifierSchema = yup
  .string()
  .typeError('qvain.validationMessages.restrictionGrounds.string')
  .url('qvain.validationMessages.restrictionGrounds.url')
  .required('qvain.validationMessages.restrictionGrounds.required')

export const restrictionGroundsMetaxSchema = yup
  .array()
  .of(
    yup
      .object()
      .shape({
        identifier: restrictionGroundsIdentifierSchema,
      })
      .required('qvain.validationMessages.restrictionGrounds.required')
      .noUnknown()
  )
  .min(1)
  .required('qvain.validationMessages.restrictionGrounds.required')

class RestrictionGrounds extends SingleValueField {
  constructor(Parent) {
    super(Parent, restrictionGroundsIdentifierSchema)
    makeObservable(this)
  }

  fromBackend = dataset => {
    const rg = dataset.access_rights?.restriction_grounds
      ? dataset.access_rights.restriction_grounds[0]
      : undefined
    touch(dataset.access_rights?.restriction_grounds)
    this.value = rg ? this.Model(rg.pref_label, rg.identifier) : undefined
  }

  toBackend = () => (this.value ? [{ identifier: this.value.identifier }] : undefined)

  @override validate() {
    if (!this.Schema) return undefined
    return this.Schema.validate(this.value?.identifier || '', { strict: true })
      .then(() => {
        this.setValidationError(null)
      })
      .catch(err => {
        this.setValidationError(err.errors)
      })
  }

  Model = (name, identifier) => ({
    name,
    identifier,
  })

  schema = restrictionGroundsIdentifierSchema
}

export default RestrictionGrounds
