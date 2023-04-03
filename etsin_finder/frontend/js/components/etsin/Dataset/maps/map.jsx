import React, { Component } from 'react'
import { Map, TileLayer, GeoJSON, Marker, Rectangle } from 'react-leaflet'
import styled, { withTheme } from 'styled-components'
import leaflet from 'leaflet'
import PropTypes from 'prop-types'

import mapStyle from './mapStyle'
import mapIcon from '@/../static/images/map_icon.svg'

import { withStores } from '@/stores/stores'

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
//   bounds: [[lat lng], [lat, lng]]  onMount
//   layers: React Elements           onMount
// }

class MyMap extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
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
      bounds: undefined,
      layers: undefined,
    }
  }

  componentDidMount = () => {
    this.initMap()
  }

  getMapOptions = () => {
    // TODO: Zoom and bounds are calculated by first WKT string and not influenced by others
    if (this.state.geometry[0].type === 'Point') {
      return {
        zoom: 10,
        center: this.state.bounds[0],
      }
    }
    return {
      bounds: this.state.bounds,
    }
  }

  initMap = () => {
    const { Map: MapStore } = this.props.Stores
    MapStore.makeGeometry(this.props.geometry, this.props.place_uri).then(geometry => {
      // TODO: use all geometries to calculate bounds
      const bounds = geometry[0].bounds
      const layers = this.makeLayers(geometry)
      this.setState({
        geometry,
        bounds,
        layers,
      })
    })
  }

  makeLayers = geometry =>
    geometry.map(geo => {
      switch (geo.type) {
        case 'LineString':
        case 'MultiLineString':
        case 'MultiPolygon':
        case 'Polygon':
          // GeoJSON reads coordinates the other way around.
          return (
            <GeoJSON
              key={`geojson-${geo.type}-${geo.coordinates}`}
              data={geo}
              color={this.props.theme.color.primary}
              weight="3"
            >
              {this.props.children}
            </GeoJSON>
          )
        case 'Rectangle':
          return (
            <Rectangle
              key={`rectangle-${geo.type}-${geo.coordinates}`}
              bounds={geo.coordinates}
              color={this.props.theme.color.primary}
            >
              {this.props.children}
            </Rectangle>
          )
        case 'Point':
          // GeoJson coords are (long,lat) so they have to be reversed to (lat,long) for react-leaflet
          return (
            <Marker
              key={`marker-${geo.type}-${geo.coordinates}`}
              // TODO: fix this bounds[0] hack
              position={geo.bounds[0]}
              icon={MarkerIcon}
            >
              {this.props.children}
            </Marker>
          )
        case 'MultiPoint':
          return (
            <React.Fragment key={`marker-${geo.type}-${geo.coordinates}`}>
              {geo.coordinates.map(single => (
                <Marker key={`marker-${geo.type}-${single}`} position={single} icon={MarkerIcon}>
                  {this.props.children}
                </Marker>
              ))}
            </React.Fragment>
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
        <CustomMap {...this.getMapOptions()}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {this.state.layers}
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

export default withStores(withTheme(MyMap))
