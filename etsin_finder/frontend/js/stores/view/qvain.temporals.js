import { v4 as uuidv4 } from 'uuid'
import { computed, action } from 'mobx'
import Field from './qvain.field'

const Temporal = (uiid = uuidv4(), startDate = undefined, endDate = undefined) => ({
  uiid,
  startDate,
  endDate,
})

class Temporals extends Field {
  constructor(Parent) {
    super(Parent, Temporal, TemporalModel, 'temporals')
  }

  @computed get renderable() {
    return this.storage.map(temporal => ({
      start: temporal.startDate,
      end: temporal.endDate,
      uiid: temporal.uiid,
    }))
  }

  @action reset() {
    super.reset()
    super.create()
  }

  @action fromBackend(dataset, Qvain) {
    super.fromBackend(dataset, Qvain)
    console.log('here')
    super.create()
  }

  @action addTemporal = () => {
    this.storage = [...this.storage, this.inEdit]
  }

  @action removeTemporal = uiid => {
    this.storage = this.storage.filter(temp => temp.uiid !== uiid)
  }

  toBackend = () =>
    this.storage.map(temporal => ({
      start_date: new Date(temporal.startDate).toISOString(),
      end_date: new Date(temporal.endDate).toISOString(),
    }))
}

export const TemporalModel = data => ({
  uiid: uuidv4(),
  startDate: data.start_date,
  endDate: data.end_date,
})

export default Temporals
