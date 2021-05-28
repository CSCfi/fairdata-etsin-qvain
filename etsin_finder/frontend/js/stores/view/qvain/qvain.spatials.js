import { makeObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import Field from './qvain.field'

const numberToString = number => {
  if (typeof number === 'number') {
    return number.toString()
  }
  return number
}

export const Spatial = (
  uiid = uuidv4(),
  name = '',
  altitude = '',
  address = '',
  geometry = [],
  location = undefined
) => ({
  uiid,
  name,
  altitude: numberToString(altitude),
  address,
  geometry,
  location,
})

class Spatials extends Field {
  constructor(Parent) {
    super(Parent, Spatial, SpatialModel, 'spatials')
    makeObservable(this)
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

  fromBackend = (dataset, Qvain) => this.fromBackendBase(dataset.spatial, Qvain)
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
