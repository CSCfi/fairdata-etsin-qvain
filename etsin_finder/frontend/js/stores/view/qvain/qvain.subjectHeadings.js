import { action, makeObservable } from 'mobx'
import ReferenceField from './qvain.referenceField'
import { touch } from './track'

class SubjectHeadings extends ReferenceField {
  constructor(...args) {
    super(...args)
    makeObservable(this)
  }

  @action
  fromBackend = (dataset) => {
    this.reset()
    if (dataset.theme !== undefined) {
      touch(dataset.theme)
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
