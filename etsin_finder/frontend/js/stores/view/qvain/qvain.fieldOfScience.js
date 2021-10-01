import { action, makeObservable } from 'mobx'
import * as yup from 'yup'
import ReferenceField, { referenceObjectSchema } from './qvain.referenceField'
import { touch } from './track'

export const fieldsOfScienceSchema = yup.array().of(referenceObjectSchema)

class FieldOfSciences extends ReferenceField {
  constructor(...args) {
    super(...args)
    makeObservable(this)
  }

  @action fromBackend = dataset => {
    this.reset()
    if (dataset.field_of_science !== undefined) {
      touch(dataset.field_of_science)
      this.storage = dataset.field_of_science.map(element =>
        this.Model(element.pref_label, element.identifier)
      )
    }
  }

  Model = (name, url) => ({
    name,
    url,
  })

  schema = fieldsOfScienceSchema
}

export default FieldOfSciences
