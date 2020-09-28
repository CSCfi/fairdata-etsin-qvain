import SingleValueField from './qvain.singleValueField'
import { embargoExpDateSchema } from '../../components/qvain/utils/formValidation'

class EmbargoExpDate extends SingleValueField {
  constructor(Parent) {
    super(Parent, embargoExpDateSchema)
  }

  fromBackend = dataset => {
    this.value = dataset.access_rights.available || undefined
  }
}

export default EmbargoExpDate
