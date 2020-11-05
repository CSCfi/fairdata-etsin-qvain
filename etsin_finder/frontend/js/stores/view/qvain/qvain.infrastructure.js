import { action, makeObservable } from 'mobx'
import ReferenceField from './qvain.referenceField'

class Infrastructures extends ReferenceField {
  constructor(...args) {
    super(...args)
    makeObservable(this)
  }


  @action
  fromBackend = dataset => {
    // infrastructures
    this.reset()
    if (dataset.infrastructure !== undefined) {
      this.storage = dataset.infrastructure.map(element =>
        this.Model(element.pref_label, element.identifier)
      )
    }
  }

  Model = InfrastructureModel
}

export const InfrastructureModel = (name, url) => ({
  name,
  url,
})

export default Infrastructures
