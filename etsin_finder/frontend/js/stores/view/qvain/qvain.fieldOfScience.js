import { action, makeObservable } from 'mobx'
import ReferenceField from './qvain.referenceField'

class FieldOfSciences extends ReferenceField {
  constructor(...args) {
    super(...args)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.reset()
    if (dataset.field_of_science !== undefined) {
      this.storage = dataset.field_of_science.map(element =>
        this.Model(element.pref_label, element.identifier)
      )
    }
  }

  Model = (name, url) => ({
    name,
    url,
  })
}

export default FieldOfSciences
