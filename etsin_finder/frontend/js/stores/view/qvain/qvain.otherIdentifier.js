import { action, makeObservable } from 'mobx'
import ReferenceField from './qvain.referenceField'
import {
  otherIdentifierSchema,
  otherIdentifiersArraySchema,
} from '../../../components/qvain/utils/formValidation'

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
