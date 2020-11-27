import { action, makeObservable } from 'mobx'
import ReferenceField from './qvain.referenceField'

class OtherIdentifiers extends ReferenceField {
  constructor(...args) {
    super(...args)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.reset()
    this.storage = dataset.other_identifier ? dataset.other_identifier.map(oid => oid.notation) : []
  }
}

export default OtherIdentifiers
