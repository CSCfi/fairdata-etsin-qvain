import moment from 'moment'
import SingleValueField from './qvain.singleValueField'
import { issuedDateSchema } from '../../../components/qvain/utils/formValidation'

class IssuedDate extends SingleValueField {
  constructor(Parent) {
    super(Parent, issuedDateSchema, moment().format('YYYY-MM-DD'))
  }

  fromBackend = dataset => {
    this.value = dataset.issued || undefined
  }
}

export default IssuedDate
