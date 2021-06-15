import { makeObservable, override } from 'mobx'
import SingleValueField from './qvain.singleValueField'
import { restrictionGroundsSchema } from '../../../components/qvain/utils/formValidation'

class RestrictionGrounds extends SingleValueField {
  constructor(Parent) {
    super(Parent, restrictionGroundsSchema)
    makeObservable(this)
  }

  fromBackend = dataset => {
    const rg = dataset.access_rights.restriction_grounds
      ? dataset.access_rights.restriction_grounds[0]
      : undefined
    this.value = rg ? this.Model(rg.pref_label, rg.identifier) : undefined
  }

  toBackend = () => (this.value ? this.value.identifier : undefined)

  @override validate() {
    if (!this.Schema) return undefined
    return this.Schema.validate(this.value.identifier || '', { strict: true })
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
}

export default RestrictionGrounds
