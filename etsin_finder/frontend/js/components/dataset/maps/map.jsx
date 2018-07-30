import React, { Component } from 'react'
import { Map, TileLayer, Polygon, Circle } from 'react-leaflet'
import styled from 'styled-components'
import WKT from 'terraformer-wkt-parser'
import PropTypes from 'prop-types'

import mapStyle from './mapStyle'

export default class MyMap extends Component {
  static propTypes = {
    geometry: PropTypes.arrayOf(PropTypes.string),
  }
  static defaultProps = {
    geometry: undefined,
  }

  constructor(props) {
    super(props)

    const geometry = this.convertToGeometry(props.geometry[0])
    const geometryType = this.getGeometryType(props.geometry[0])
    const center = this.calculateCenter(geometry, geometryType)
    this.state = {
      lat: center[0],
      lng: center[1],
      zoom: 10,
      geometry,
      geometryType,
    }
  }

  getGeometryType = geometry => {
    const type = geometry.split('(', 1)[0]
    return type
  }

  convertToGeometry = s => {
    const converted = WKT.parse(s)
    return converted.coordinates
  }

  calculateCenter = (coordinates, type) => {
    let sum, averageX, averageY
    const isSamePoint = (a, b) => {
      if (!a || !b) return false
      if (a[0] === b[0] && a[1] === b[1]) {
        return true
      }
      return false
    }

    // if point
    if (type === 'POINT') {
      averageX = coordinates[0]
      averageY = coordinates[1]
    } else if (typeof coordinates[0][0][0] === 'number') {
      // if possibly multipolygon
      if (isSamePoint(coordinates[0][0], coordinates[0][coordinates[0].length - 1])) {
        coordinates[0].splice(0, 1)
      }
      sum = coordinates[0].reduce((prev, curr) => [prev[0] + curr[0], prev[1] + curr[1]])
      averageX = sum[0] / coordinates[0].length
      averageY = sum[1] / coordinates[0].length
    }
    return [averageX, averageY]
  }

  renderGeometry = () => {
    switch (this.state.geometryType) {
      case 'POLYGON':
        return <Polygon color="blue" positions={this.state.geometry} />
      case 'POINT':
        return <Circle center={this.state.geometry} fillColor="blue" radius={400} />
      default:
        console.error("CAN'T DRAW GEOMETRY FOR TYPE: ", this.state.geometryType)
        return null
    }
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <MapStyleContainer>
        <CustomMap center={position} zoom={this.state.zoom}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {this.renderGeometry()}
        </CustomMap>
      </MapStyleContainer>
    )
  }
}

const CustomMap = styled(Map)`
  height: 300px;
  width: 100%;
`

const MapStyleContainer = styled.div`
  ${mapStyle};
`
