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

class MyMap extends Component {
  static propTypes = {
    geometry: PropTypes.arrayOf(PropTypes.string),
    place_uri: PropTypes.objectOf(PropTypes.string),
  }
  static defaultProps = {
    geometry: undefined,
    place_uri: undefined,
  }

  constructor(props) {
    super(props)
    this.state = {}
    // Create geometry, get geometry type and calculate center
    if (props.geometry) {
      // TODO: draw all objects in geometry
      const geometry = this.convertToGeometry(props.geometry[0])
      console.log('geometry', geometry)
      const center = this.calculateCenter(geometry)

      this.state = {
        lat: center[1],
        lng: center[0],
        zoom: 10,
        geometry,
      }
    }
  }

  componentDidMount = () => {
    if (!this.state.geometry) {
      this.getGeometryFromPlaceURI(this.props.place_uri)
    }
  }

  getGeometryFromPlaceURI = placeUri => {
    const provider = new OpenStreetMapProvider()
    provider
      .search({ query: checkDataLang(placeUri) })
      .then(results => {
        console.log('results', results[0].bounds[0][0])
        this.setState({
          lat: results[0].y,
          lng: results[0].x,
          zoom: 10,
          geometry: {
            type: 'Rectangle',
            coordinates: results[0].bounds,
          },
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  getGeometryType = geometry => {
    const type = geometry.split('(', 1)[0]
    return type
  }

  getMapOptions = () => {
    if (this.state.geometry.type === 'Point') {
      return {
        zoom: this.state.zoom,
      }
    }
    return {
      bounds: this.state.geometry.coordinates,
    }
  }

  convertToGeometry = s => {
    const converted = WKT.parse(s)
    // TODO: All coordinates might have altitude in them also. Not only Points
    // What to do with altitude?
    if (converted.type === 'Point') {
      if (converted.coordinates.length !== 2) {
        // const altitude = converted.coordinates[2]
        converted.coordinates = converted.coordinates.slice(0, 2)
      }
    }
    return converted
  }

  calculateCenter = geometry => {
    let sum, averageX, averageY

    const isSamePoint = (a, b) => {
      if (!a || !b) return false
      if (a[0] === b[0] && a[1] === b[1]) {
        return true
      }
      return false
    }

    // if point
    if (geometry.type === 'Point') {
      averageX = geometry.coordinates[0]
      averageY = geometry.coordinates[1]
    } else if (typeof geometry.coordinates[0][0][0] === 'number') {
      const coordinates = geometry.coordinates[0].slice(0)
      // if possibly multipolygon
      if (isSamePoint(coordinates[0], coordinates[coordinates.length - 1])) {
        coordinates.splice(0, 1)
      }
      sum = coordinates.reduce((prev, curr) => [prev[0] + curr[0], prev[1] + curr[1]])
      averageX = sum[0] / coordinates.length
      averageY = sum[1] / coordinates.length
    }
    return [averageX, averageY]
  }

  renderGeometry = () => {
    switch (this.state.geometry.type) {
      case 'MultiPolygon':
      case 'Polygon':
        return (
          <GeoJSON data={this.state.geometry} color={this.props.theme.color.primary} weight="3">
            <Popup>{this.props.children}</Popup>
          </GeoJSON>
        )
      case 'Rectangle':
        return (
          <Rectangle
            bounds={this.state.geometry.coordinates}
            color={this.props.theme.color.primary}
          >
            <Popup>{this.props.children}</Popup>
          </Rectangle>
        )
      case 'Point':
        // GeoJson coords are (long,lat) so they have to be reversed to (lat,long) for react-leaflet
        return (
          <Marker position={this.state.geometry.coordinates.reverse()} icon={MarkerIcon}>
            <Popup>{this.props.children}</Popup>
          </Marker>
        )
      default:
        console.error("CAN'T DRAW GEOMETRY FOR TYPE: ", this.state.geometry)
        return null
    }
  }

  render() {
    if (this.state.geometry === undefined) {
      return null
    }
    const position = [this.state.lat, this.state.lng]
    return (
      <MapStyleContainer>
        <CustomMap center={position} {...this.getMapOptions()}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {this.renderGeometry()}
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
