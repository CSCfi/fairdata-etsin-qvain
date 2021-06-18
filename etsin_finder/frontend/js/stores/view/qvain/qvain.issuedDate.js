import { action, makeObservable } from 'mobx'
import moment from 'moment'
import yup from '../../../utils/extendedYup'
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
}

export default IssuedDate
