import { action } from 'mobx'

import ReferenceField from './qvain.referenceField'
import { touch } from './track'

class DatasetLanguages extends ReferenceField {
  constructor(...args) {
    super(...args)
  }

  @action fromBackend = dataset => {
    if (dataset.language !== undefined) {
      touch(dataset.language)
      this.storage = dataset.language.map(element =>
        this.Model(element.pref_label, element.identifier)
      )
    }
  }

  Model = (name, url) => ({
    name,
    url,
  })
}

export default DatasetLanguages
