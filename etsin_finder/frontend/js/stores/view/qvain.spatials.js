import uuid from 'uuid/v4'
import { observable, action } from 'mobx'

const Spatial = (
  uiid = uuid(),
  name = '',
  altitude = 0,
  address = '',
  geometry = [],
  location = { url: '' }
) => ({
  uiid,
  name,
  altitude,
  address,
  geometry,
  location,
})

class Spatials {
  constructor(Qvain) {
    this.Qvain = Qvain
    this.init()
  }

  init() {}

  @observable hasChanged

  @observable spatialInEdit

  @observable editMode

  @action setChanged = val => {
    this.hasChanged = val
  }

  @action startNewSpatial = () => {
    this.setChanged(false)
    this.editMode = false
    this.spatialInEdit = Spatial()
  }

  @action changeSpatialAttribute = (attribute, value) => {
    this.setChanged(true)
    this.spatialInEdit[attribute] = value
  }

  @action saveSpatial = () => {
    this.setChanged(false)
    this.editMode = false
    const editedSpatial = this.Qvain.spatials.find(s => s.uiid === this.spatialInEdit.uiid)
    if (editedSpatial) {
      const indexOfSpatial = this.Qvain.spatials.indexOf(editedSpatial)
      this.Qvain.spatials[indexOfSpatial] = {
        ...this.spatialInEdit,
        geometry: [...this.spatialInEdit.geometry],
        location: { ...this.spatialInEdit.location },
      }
    } else {
      this.Qvain.spatials.push({
        ...this.spatialInEdit,
        geometry: [...this.spatialInEdit.geometry],
        location: { ...this.spatialInEdit.location },
      })
    }
  }

  @action clearSpatialInEdit = () => {
    this.setChanged(false)
    this.editMode = false
    this.spatialInEdit = undefined
  }

  @action removeSpatial = uiid => {
    this.Qvain.spatials = this.Qvain.spatials.filter(spatial => spatial.uiid !== uiid)
  }

  @action editSpatial = uiid => {
    this.setChanged(false)
    this.editMode = true
    const spatial = this.Qvain.spatials.find(s => s.uiid === uiid)
    this.spatialInEdit = {
      ...spatial,
      geometry: [...spatial.geometry.map(geo => ({ ...geo }))],
      location: { ...spatial.location },
    }
  }

  toBackend = () =>
    this.Qvain.spatials.map(spatial => ({
      geographic_name: spatial.name,
      alt: spatial.altitude,
      full_address: spatial.address,
      as_wkt: spatial.geometry.map(geo => geo.value),
      place_uri: { identifier: spatial.location.url },
    }))
}

export const Location = (name, url) => ({
  name,
  url,
})

export const SpatialModel = spatialData => ({
  uiid: uuid(),
  name: spatialData.geographic_name,
  altitude: spatialData.alt,
  address: spatialData.full_address,
  geometry: spatialData.as_wkt.map(geo => ({ value: geo, uiid: uuid() })),
  location: Location(spatialData.place_uri.pref_label, spatialData.place_uri.identifier),
})

export default Spatials
