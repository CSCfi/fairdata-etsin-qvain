import { action, makeObservable } from 'mobx'
import * as yup from 'yup'

import SingleValueField from './qvain.singleValueField'
import { ACCESS_TYPE_URL } from '../../../utils/constants'
import { touch } from './track'

export const accessTypeIdentifierSchema = yup
  .string()
  .typeError('qvain.validationMessages.accessType.string')
  .url('qvain.validationMessages.accessType.url')
  .required('qvain.validationMessages.accessType.required')

export const accessTypeQvainSchema = yup
  .object()
  .shape({
    name: yup.object().nullable(),
    url: accessTypeIdentifierSchema,
  })
  .noUnknown()

export const accessTypeMetaxSchema = yup
  .object()
  .shape({
    identifier: accessTypeIdentifierSchema,
  })
  .noUnknown()

const Model = (name, url) => ({
  name,
  url,
})

const defaultValue = Model(undefined, ACCESS_TYPE_URL.OPEN)

class AccessType extends SingleValueField {
  constructor(Parent) {
    super(Parent, accessTypeQvainSchema, defaultValue)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    const at = dataset.access_rights?.access_type ? dataset.access_rights?.access_type : undefined
    touch(dataset.access_rights?.access_type)
    this.value = at ? this.Model({ ...at.pref_label }, at.identifier) : this.defaultValue
  }

  toBackend = () => this.value?.url && { identifier: this.value.url }

  Model = Model
}

export default AccessType
