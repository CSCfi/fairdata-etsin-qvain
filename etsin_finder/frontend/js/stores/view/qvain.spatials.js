import uuid from 'uuid/v4'
import Field from './qvain.field'

const Spatial = (
  uiid = uuid(),
  name = '',
  altitude = 0,
  address = '',
  geometry = [],
  location = undefined
) => ({
  uiid,
  name,
  altitude,
  address,
  geometry,
  location,
})

class Spatials extends Field {
  constructor(Parent) {
    super(Parent, Spatial, 'spatials')
  }

  toBackend = () =>
    this.Parent.spatials.map((spatial) => ({
      geographic_name: spatial.name,
      alt: spatial.altitude,
      full_address: spatial.address,
      as_wkt: spatial.geometry.map((geo) => geo.value),
      place_uri: spatial.location
        ? { identifier: spatial.location.url }
        : { identifier: undefined },
    }))
}

export const Location = (name, url) => ({
  name,
  url,
})

export const SpatialModel = (spatialData) => ({
  uiid: uuid(),
  name: spatialData.geographic_name,
  altitude: spatialData.alt,
  address: spatialData.full_address,
  geometry: spatialData.as_wkt
    ? spatialData.as_wkt.map((geo) => ({ value: geo, uiid: uuid() }))
    : [],
  location: spatialData.place_uri
    ? Location(spatialData.place_uri.pref_label, spatialData.place_uri.identifier)
    : undefined,
})

export default Spatials
