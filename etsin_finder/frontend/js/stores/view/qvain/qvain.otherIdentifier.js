import { action, makeObservable } from 'mobx'
import * as yup from 'yup'
import ReferenceField from './qvain.referenceField'

export const otherIdentifierSchema = yup
  .string()
  .typeError('qvain.validationMessages.otherIdentifiers.string')
  .min(10, 'qvain.validationMessages.otherIdentifiers.min')
  .url('qvain.validationMessages.otherIdentifiers.url')
  .max(1000, 'qvain.validationMessages.otherIdentifiers.max')

export const otherIdentifiersArraySchema = yup.array().of(otherIdentifierSchema).nullable()

class OtherIdentifiers extends ReferenceField {
  constructor(...args) {
    super(...args)
    this.reset()
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.reset()
    this.storage = dataset.other_identifier ? dataset.other_identifier.map(oid => oid.notation) : []
  }

  @action cleanupBeforeBackend = () => {
    const { validateStr, addItemStr } = this
    if (!validateStr()) {
      return false
    }
    addItemStr()
    return true
  }

  Schema = otherIdentifiersArraySchema

  itemSchema = otherIdentifierSchema

  translationsRoot = 'qvain.description.otherIdentifiers'

  alreadyAddedError = `${this.translationsRoot}.alreadyAdded`
}

export default OtherIdentifiers
