import { action, makeObservable } from 'mobx'
import moment from 'moment'
import * as yup from 'yup'
import SingleValueField from './qvain.singleValueField'

export const issuedDateSchema = yup.string().date().nullable()

class IssuedDate extends SingleValueField {
  constructor(Parent) {
    super(Parent, issuedDateSchema, moment().format('YYYY-MM-DD'))
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.value = dataset.issued || undefined
  }

  schema = issuedDateSchema
}

export default IssuedDate
