import { action } from 'mobx'
import ReferenceField from './qvain.referenceField'

class Infrastructures extends ReferenceField {
  @action
  fromBackend = dataset => {
    // infrastructures
    this.reset()
    if (dataset.infrastructure !== undefined) {
      this.storage = dataset.infrastructure.map(element =>
        InfrastructureModel(element.pref_label, element.identifier)
      )
    }
  }
}

export const InfrastructureModel = (name, url) => ({
  name,
  url,
})

export default Infrastructures
