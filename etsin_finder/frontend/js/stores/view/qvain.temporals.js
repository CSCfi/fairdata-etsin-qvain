import uuid from 'uuid/v4'
import { computed, action } from 'mobx'
import Field from './qvain.field'

const Temporal = (
  uiid = uuid(),
  startDate = undefined,
  endDate = undefined
) => ({
  uiid,
  startDate,
  endDate
})

class Temporals extends Field {
  constructor(Parent) {
    super(Parent, Temporal, 'temporals')
  }

  @computed get renderable() {
    return this.Parent.temporals.map(temporal => ({
      start: temporal.startDate,
      end: temporal.endDate,
      uiid: temporal.uiid
    }))
  }

  @action removeTemporal = (uiid) => {
    this.Parent.temporals = this.Parent.temporals.filter(temp => temp.uiid !== uiid)
  }

  toBackend = () =>
    this.Parent.temporals.map((temporal) => ({
      start_date: temporal.startDate,
      end_date: temporal.endDate
    }))
}

export const SpatialModel = (data) => ({
  uiid: uuid(),
  startDate: data.start_date,
  endDate: data.end_date
})

export default Temporals
