/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import WKT from 'terraformer-wkt-parser'
import { OpenStreetMapProvider } from 'leaflet-geosearch'

// functions for map component
class Map {
  constructor(Locale) {
    this.Locale = Locale
  }

  createBounds = minmax => {
    const minY = minmax[0]
    const minX = minmax[1]
    const maxY = minmax[2]
    const maxX = minmax[3]
    // X and Y might be the wrong way around here
    return [
      [minX, minY],
      [maxX, maxY],
    ]
  }

  makeGeometry(geometry, location) {
    if (geometry?.length > 0) {
      return new Promise(resolve => {
        resolve(this.makeGeometryFromWKT(geometry))
      })
    }
    return this.makeGeometryFromPlace(location)
  }

  makeGeometryFromWKT = wkt => {
    const geometry = []
    wkt.map(string => {
      const converted = WKT.parse(string)
      converted.bounds = this.createBounds(converted.bbox())
      geometry.push(converted)
      return true
    })
    return geometry
  }

  // converts place name to latitude and longitude
  // coordinate format is [lat, lng]
  makeGeometryFromPlace = location => {
    const provider = new OpenStreetMapProvider()
    return provider
      .search({ query: this.Locale.getValueTranslation(location) })
      .then(results => [
        { type: 'Rectangle', coordinates: [results[0].bounds], bounds: results[0].bounds },
      ])
      .catch(err => {
        console.log(err)
      })
  }
}

export default Map
