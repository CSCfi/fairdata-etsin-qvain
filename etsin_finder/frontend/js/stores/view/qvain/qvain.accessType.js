import { action, makeObservable } from 'mobx'
import * as yup from 'yup'

import SingleValueField from './qvain.singleValueField'
import { ACCESS_TYPE_URL } from '../../../utils/constants'

export const accessTypeSchema = yup.object().shape({
  name: yup.object().nullable(),
  url: yup
    .string()
    .typeError('qvain.validationMessages.accessType.string')
    .url('qvain.validationMessages.accessType.url')
    .required('qvain.validationMessages.accessType.required'),
})

const Model = (name, url) => ({
  name,
  url,
})

const defaultValue = Model(undefined, ACCESS_TYPE_URL.OPEN)

class AccessType extends SingleValueField {
  constructor(Parent) {
    super(Parent, accessTypeSchema, defaultValue)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    const at = dataset.access_rights.access_type ? dataset.access_rights.access_type : undefined
    this.value = at ? this.Model(at.pref_label, at.identifier) : this.defaultValue
  }

  Model = Model
}

export default AccessType
