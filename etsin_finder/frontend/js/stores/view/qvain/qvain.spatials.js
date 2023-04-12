import { makeObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'
import '../../../utils/extendYup'

import { touch } from './track'
import Field from './qvain.field'

const numberToString = number => {
  if (typeof number === 'number') {
    return number.toString()
  }
  return number
}

// SPATIAL VALIDATION
export const spatialNameSchema = yup
  .string()
  .typeError('qvain.validationMessages.temporalAndSpatial.spatial.nameRequired')
  .required('qvain.validationMessages.temporalAndSpatial.spatial.nameRequired')

export const spatialAltitudeSchema = yup
  .string()
  .number()
  .typeError('qvain.validationMessages.temporalAndSpatial.spatial.altitudeNan')

export const spatialSchema = yup.object().shape({
  name: spatialNameSchema,
  altitude: spatialAltitudeSchema,
})

export const Spatial = ({
  uiid = uuidv4(),
  name = '',
  altitude = '',
  address = '',
  geometry = [],
  location = undefined,
} = {}) => ({
  uiid,
  name,
  altitude: numberToString(altitude),
  address,
  geometry,
  location,
})

class Spatials extends Field {
  constructor(Parent, spatials = []) {
    super(Parent, Spatial, SpatialModel, 'spatials')
    makeObservable(this)

    this.fromBackend({ spatial: spatials }, Parent)
  }

  clone = () => new Spatials(this.Parent, this.toBackend())

  spatialToBackend = spatial => ({
    geographic_name: spatial.name,
    alt: spatial.altitude,
    full_address: spatial.address,
    as_wkt: spatial.geometry.map(geo => geo.value),
    place_uri: spatial.location ? { identifier: spatial.location.url } : { identifier: undefined },
  })

  toBackend = () => this.storage.map(this.spatialToBackend)

  fromBackend = (dataset, Qvain) => {
    if (dataset.spatial) {
      dataset.spatial.forEach(spatial => {
        touch(spatial.place_uri)
      })
    }
    return this.fromBackendBase(dataset.spatial, Qvain)
  }

  schema = spatialSchema

  translationsRoot = 'qvain.geographics'
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
