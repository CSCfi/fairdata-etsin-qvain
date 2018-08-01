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

import checkDataLang from '../../utils/checkDataLang'

// functions for map component
class Map {
  getBounds = coordinates => {
    // sometimes objects are four levels deep. so bounds are not calculated correctly.
    // if (coordinates[0]) {
    //   console.log('1')
    //   if (coordinates[0][0]) {
    //     console.log('2')
    //     if (coordinates[0][0][0]) {
    //       console.log('3')
    //       if (coordinates[0][0][0][0]) {
    //         // [[[[123, 323], [322, 233]], []], []]
    //         console.log('4')
    //         if (coordinates[0][0][0][0][0]) {
    //           console.log('5')
    //         }
    //       }
    //     }
    //   }
    // }

    let biggestX = -1000
    let biggestY = -1000
    let smallestX = 1000
    let smallestY = 1000
    // TODO: use all geometries to calculate bounds

    // Compare current coordinate point to other points
    const compareCoordinate = single => {
      const x = single[0]
      if (x > biggestX) {
        biggestX = x
      }
      if (x < smallestX) {
        smallestX = x
      }
      const y = single[1]
      if (y > biggestY) {
        biggestY = y
      }
      if (y < smallestY) {
        smallestY = y
      }
      return true
    }

    // loop through all
    if (typeof coordinates[0][0] === 'number') {
      coordinates.map(single => compareCoordinate(single))
    } else if (typeof coordinates[0][0][0] === 'number') {
      coordinates.map(polygon => polygon.map(single => compareCoordinate(single)))
    } else if (typeof coordinates[0][0][0][0] === 'number') {
      coordinates.map(multipolygon =>
        multipolygon.map(polygon => polygon.map(single => compareCoordinate(single)))
      )
    }

    return [[smallestX, smallestY], [biggestX, biggestY]]
  }

  getCenter = geometry => {
    let sum, averageX, averageY
    const isSamePoint = (a, b) => {
      if (!a || !b) return false
      if (a[0] === b[0] && a[1] === b[1]) {
        return true
      }
      return false
    }

    // TODO: use all geometries to calculate center
    // if point
    if (geometry[0].type === 'Point') {
      averageX = geometry[0].latlng[0]
      averageY = geometry[0].latlng[1]
    } else if (typeof geometry[0].latlng[0][0][0] === 'number') {
      const latlng = geometry[0].latlng[0].slice(0)
      // if possibly multipolygon
      if (isSamePoint(latlng[0], latlng[latlng.length - 1])) {
        latlng.splice(0, 1)
      }
      sum = latlng.reduce((prev, curr) => [prev[0] + curr[0], prev[1] + curr[1]])
      averageX = sum[0] / latlng.length
      averageY = sum[1] / latlng.length
    }
    return [averageX, averageY]
  }

  makeGeometry(geometry, placeUri) {
    if (geometry) {
      return new Promise(resolve => {
        resolve(this.makeGeometryFromWKT(geometry))
      })
    }
    return this.makeGeometryFromPlace(placeUri)
  }

  makeGeometryFromWKT = wkt => {
    // Create geometry, get geometry type and calculate center
    // loop through all wkt string and create layers (elements) to be placed on map
    const flipCoords = coordinates => {
      const coords = coordinates.slice()
      if (typeof coords[0] === 'number') {
        return coords.reverse()
      } else if (typeof coords[0][0] === 'number') {
        return coords.map(lvlone => lvlone.reverse())
      } else if (typeof coords[0][0][0] === 'number') {
        // array of arrays has referrence to original inside
        return coords.map(lvlone => lvlone.map(lvltwo => lvltwo.slice().reverse()))
      }
      // if doesn't match any just return the coordinates, they probably work somehow without breaking :)
      // this should never happen.
      return coords
    }

    const geometry = []
    wkt.map(string => {
      const converted = WKT.parse(string)
      // the coordinates need to be rotated
      converted.latlng = flipCoords(converted.coordinates)
      geometry.push(converted)
      return true
    })
    return geometry
  }

  // converts place name to latitude and longitude
  // coordinate format is [lat, lng]
  makeGeometryFromPlace = placeUri => {
    const provider = new OpenStreetMapProvider()
    return provider
      .search({ query: checkDataLang(placeUri) })
      .then(results => [{ type: 'Rectangle', latlng: [results[0].bounds] }])
      .catch(err => {
        console.log(err)
      })
  }
}

export default new Map()
