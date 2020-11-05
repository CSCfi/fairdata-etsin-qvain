import { action, makeObservable } from 'mobx'

import SingleValueField from './qvain.singleValueField'
import { embargoExpDateSchema } from '../../../components/qvain/utils/formValidation'

class EmbargoExpDate extends SingleValueField {
  constructor(Parent) {
    super(Parent, embargoExpDateSchema)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.value = dataset.access_rights.available || undefined
  }
}

export default EmbargoExpDate
