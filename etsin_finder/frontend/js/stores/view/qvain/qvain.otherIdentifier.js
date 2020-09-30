import { action } from 'mobx'
import ReferenceField from './qvain.referenceField'

class OtherIdentifiers extends ReferenceField {
  @action fromBackend = dataset => {
    this.reset()
    this.storage = dataset.other_identifier ? dataset.other_identifier.map(oid => oid.notation) : []
  }
}

export default OtherIdentifiers
