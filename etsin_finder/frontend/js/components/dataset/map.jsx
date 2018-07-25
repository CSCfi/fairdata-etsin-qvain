import React, { Component } from 'react'
import { Map, TileLayer, Polygon } from 'react-leaflet'
import styled from 'styled-components'
import WKT from 'terraformer-wkt-parser'
import PropTypes from 'prop-types'

import mapStyle from './mapStyle'

export default class MyMap extends Component {
  static propTypes = {
    geometry: PropTypes.string,
  }
  static defaultProps = {
    geometry: undefined,
  }

  constructor(props) {
    super(props)

    const geometry = this.convertToGeometry(props.geometry[0])
    const center = this.calculateCenter(geometry)
    this.state = {
      lat: center[0],
      lng: center[1],
      zoom: 10,
      geometry,
    }
  }

  convertToGeometry = s => {
    const converted = WKT.parse(s)
    return converted.coordinates
  }

  calculateCenter = coordinates => {
    let sum, averageX, averageY
    const isSamePoint = (a, b) => {
      if (!a || !b) return false
      if (a[0] === b[0] && a[1] === b[1]) {
        return true
      }
      return false
    }

    // if polygon
    if (typeof coordinates[0][0] === 'number') {
      coordinates.splice(0, 1)
      sum = coordinates.reduce((prev, curr) => [prev[0] + curr[0], prev[1] + curr[1]])
      averageX = sum[0] / coordinates.length
      averageY = sum[1] / coordinates.length
    } else {
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

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <MapStyleContainer>
        <CustomMap center={position} zoom={this.state.zoom}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polygon color="blue" positions={this.state.geometry} />
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
