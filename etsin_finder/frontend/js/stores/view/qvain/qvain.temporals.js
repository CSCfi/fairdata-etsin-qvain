import { v4 as uuidv4 } from 'uuid'
import { computed, action, makeObservable, override } from 'mobx'
import Field from './qvain.field'

const Temporal = (uiid = uuidv4(), startDate = undefined, endDate = undefined) => ({
  uiid,
  startDate,
  endDate,
})

class Temporals extends Field {
  constructor(Parent) {
    super(Parent, Temporal, TemporalModel, 'temporals')
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

  @action addTemporal = () => {
    this.storage = [...this.storage, this.inEdit]
  }

  @action removeTemporal = uiid => {
    this.storage = this.storage.filter(temp => temp.uiid !== uiid)
  }

  toBackend = () => {
    // save on submit if Temporal is filled are filled but not added
    if ((this.inEdit || {}).startDate && (this.inEdit || {}).endDate) {
      this.save()
    }

    return this.storage.map(temporal => ({
      start_date: temporal.startDate && new Date(temporal.startDate).toISOString(),
      end_date: temporal.endDate && new Date(temporal.endDate).toISOString(),
    }))
  }

  fromBackend = (dataset, Qvain) => this.fromBackendBase(dataset.temporal, Qvain)
}

export const TemporalModel = data => ({
  uiid: uuidv4(),
  startDate: data.start_date,
  endDate: data.end_date,
})

export default Temporals
