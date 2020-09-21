import { v4 as uuidv4 } from 'uuid'
import Field from './qvain.field'

const Spatial = (
  uiid = uuidv4(),
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
  constructor(Qvain, spatials = []) {
    super(Qvain, Spatial, SpatialModel, 'spatials')
    this.Qvain = Qvain
    this.fromBackend(spatials, Qvain)
  }

  clone = () => this

  spatialToBackend = spatial => ({
    geographic_name: spatial.name,
    alt: spatial.altitude,
    full_address: spatial.address,
    as_wkt: spatial.geometry.map(geo => geo.value),
    place_uri: spatial.location ? { identifier: spatial.location.url } : { identifier: undefined },
  })

  toBackend = () => this.storage.map(this.spatialToBackend)
}

export const Location = (name, url) => ({
  name,
  url,
})

export const SpatialModel = spatialData => ({
  uiid: uuidv4(),
  name: spatialData.geographic_name,
  altitude: spatialData.alt,
  address: spatialData.full_address,
  geometry: spatialData.as_wkt
    ? spatialData.as_wkt.map(geo => ({ value: geo, key: uuidv4() }))
    : [],
  location: spatialData.place_uri
    ? Location(spatialData.place_uri.pref_label, spatialData.place_uri.identifier)
    : undefined,
})

export default Spatials
