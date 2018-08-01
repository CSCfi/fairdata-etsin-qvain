import React, { Component } from 'react'
import { Map, TileLayer, Popup, GeoJSON, Marker, Rectangle } from 'react-leaflet'
import styled, { withTheme } from 'styled-components'
import WKT from 'terraformer-wkt-parser'
import leaflet from 'leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import PropTypes from 'prop-types'

import checkDataLang from '../../../utils/checkDataLang'
import mapStyle from './mapStyle'
import mapIcon from '../../../../static/images/map_icon.svg'

const MarkerIcon = leaflet.icon({
  iconUrl: mapIcon,
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -20],
})

// DATA formats
// geometry = WKT string  => converted to => [lng, lat]
// place_uri = PlaceName  => converted to => [lat, lng]

// state = {
//   geometry: type and latlng        onMount
//   center: lat lng                  onMount
//   bounds: [[lat lng], [lat, lng]]  onMount
//   layers: React Elements           onMount
// }

class MyMap extends Component {
  static propTypes = {
    geometry: PropTypes.arrayOf(PropTypes.string),
    place_uri: PropTypes.objectOf(PropTypes.string),
    children: PropTypes.element,
    theme: PropTypes.object.isRequired,
  }
  static defaultProps = {
    geometry: undefined,
    place_uri: undefined,
    children: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      geometry: undefined,
      center: undefined,
      bounds: undefined,
      layers: undefined,
    }
  }

  componentDidMount = () => {
    this.initMap()
  }

  getBounds = coordinates => {
    let biggestX = -1000
    let biggestY = -1000
    let smallestX = 1000
    let smallestY = 1000
    // TODO: use all geometries to calculate bounds
    coordinates.map(polygon => {
      polygon.map(single => {
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
      })
      return true
    })
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

  getMapOptions = () => {
    // TODO: Zoom and bounds are calculated by first WKT string and not influenced by others
    if (this.state.geometry[0].type === 'Point') {
      return {
        zoom: 10,
      }
    }
    return {
      bounds: this.state.bounds,
    }
  }

  initMap = () => {
    this.makeGeometry().then(geometry => {
      let bounds
      const center = this.getCenter(geometry)
      // TODO: use all geometries to calculate bounds
      if (geometry[0].type !== 'Point') {
        bounds = this.getBounds(geometry[0].latlng)
      }
      const layers = this.makeLayers(geometry)
      this.setState({
        geometry,
        center,
        bounds,
        layers,
      })
    })
  }

  makeGeometry() {
    if (this.props.geometry) {
      return new Promise(resolve => {
        resolve(this.makeGeometryFromWKT(this.props.geometry))
      })
    }
    return this.makeGeometryFromPlace(this.props.place_uri)
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

  makeLayers = geometry =>
    geometry.map(geo => {
      switch (geo.type) {
        case 'MultiPolygon':
        case 'Polygon':
          // GeoJSON reads coordinates the other way around.
          return (
            <GeoJSON data={geo} color={this.props.theme.color.primary} weight="3">
              <Popup>{this.props.children}</Popup>
            </GeoJSON>
          )
        case 'Rectangle':
          return (
            <Rectangle bounds={geo.latlng} color={this.props.theme.color.primary}>
              <Popup>{this.props.children}</Popup>
            </Rectangle>
          )
        case 'Point':
          // GeoJson coords are (long,lat) so they have to be reversed to (lat,long) for react-leaflet
          return (
            <Marker position={geo.latlng} icon={MarkerIcon}>
              <Popup>{this.props.children}</Popup>
            </Marker>
          )
        default:
          console.error("CAN'T DRAW GEOMETRY FOR TYPE: ", geo)
          return null
      }
    })

  render() {
    if (this.state.geometry === undefined) {
      return null
    }
    return (
      <MapStyleContainer>
        <CustomMap center={this.state.center} {...this.getMapOptions()}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {this.state.layers}
          {/* {this.renderGeometry()} */}
        </CustomMap>
      </MapStyleContainer>
    )
  }
}

const CustomMap = styled(Map)`
  height: 400px;
  width: 100%;
`

const MapStyleContainer = styled.div`
  margin-bottom: 1em;
  ${mapStyle};
`

export default withTheme(MyMap)
