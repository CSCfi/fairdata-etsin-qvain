import { action, makeObservable } from 'mobx'
import * as yup from 'yup'
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
