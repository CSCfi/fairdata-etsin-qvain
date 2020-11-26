import { action, makeObservable } from 'mobx'
import ReferenceField from './qvain.referenceField'

class SubjectHeadings extends ReferenceField {
  constructor(...args) {
    super(...args)
    makeObservable(this)
  }

  @action
  fromBackend = dataset => {
    this.reset()
    if (dataset.theme !== undefined) {
      this.storage = dataset.theme.map(element =>
        this.Model(element.pref_label, element.identifier)
      )
    }
  }

  Model = SubjectHeadingModel
}

export const SubjectHeadingModel = (name, url) => ({
  name,
  url,
})

export default SubjectHeadings
