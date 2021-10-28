import { v4 as uuidv4 } from 'uuid'
import { computed, action, makeObservable, override } from 'mobx'
import * as yup from 'yup'
import Field from './qvain.field'

export const TemporalTemplate = (uiid = uuidv4(), startDate = undefined, endDate = undefined) => ({
  uiid,
  startDate,
  endDate,
})

// TEMPORAL VALIDATION
export const temporalDateSchema = yup.object().shape({
  startDate: yup
    .string()
    .date()
    .when('endDate', {
      is: undefined,
      then: yup
        .string()
        .date()
        .required('qvain.validationMessages.temporalAndSpatial.temporal.dateMissing'),
      otherwise: yup.string().date(),
    }),
  endDate: yup.string().date(),
})

class Temporals extends Field {
  constructor(Parent) {
    super(Parent, TemporalTemplate, TemporalModel, 'temporals')
    this.Parent = Parent
    makeObservable(this)
  }

  @computed get renderable() {
    return this.storage.map(temporal => ({
      start: temporal.startDate,
      end: temporal.endDate,
      uiid: temporal.uiid,
    }))
  }

  @override reset() {
    super.reset()
    super.create()
  }

  @override clearInEdit() {
    return this.create()
  }

  @action removeTemporal = uiid => {
    this.storage = this.storage.filter(temp => temp.uiid !== uiid)
    this.Parent.setChanged(true)
  }

  toBackend = () => {
    if ((this.inEdit || {}).startDate && (this.inEdit || {}).endDate) {
      this.save()
    }

    return this.storage.map(temporal => ({
      start_date: temporal.startDate && new Date(temporal.startDate).toISOString(),
      end_date: temporal.endDate && new Date(temporal.endDate).toISOString(),
    }))
  }

  fromBackend = (dataset, Qvain) => this.fromBackendBase(dataset.temporal, Qvain)

  schema = temporalDateSchema

  translationsRoot = 'qvain.temporalAndSpatial.temporal'
}

export const TemporalModel = data => ({
  uiid: uuidv4(),
  startDate: data.start_date,
  endDate: data.end_date,
})

export default Temporals
