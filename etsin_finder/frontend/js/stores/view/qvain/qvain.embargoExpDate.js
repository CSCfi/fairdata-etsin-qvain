import { action, makeObservable } from 'mobx'
import yup from '../../../utils/extendedYup'
import SingleValueField from './qvain.singleValueField'

export const embargoExpDateSchema = yup.string().date().nullable()

class EmbargoExpDate extends SingleValueField {
  constructor(Parent) {
    super(Parent, embargoExpDateSchema)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.value = dataset.access_rights.available || undefined
  }

  schema = embargoExpDateSchema
}

export default EmbargoExpDate
