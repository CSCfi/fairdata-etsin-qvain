import { Fragment, useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Marker, Rectangle } from 'react-leaflet'
import styled, { useTheme } from 'styled-components'
import leaflet from 'leaflet'
import PropTypes from 'prop-types'

import mapStyle from './mapStyle'
import mapIcon from '@/../static/images/map_icon.svg'

import { useStores } from '@/stores/stores'

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

const MyMap = ({ geometry: inputGeometry, location, children = null }) => {
  const Stores = useStores()
  const [geometry, setGeometry] = useState()
  const [bounds, setBounds] = useState()
  const [layers, setLayers] = useState()
  const theme = useTheme()

  const makeLayers = geometry =>
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
              color={theme.color.primary}
              weight="3"
            >
              {children}
            </GeoJSON>
          )
        case 'Rectangle':
          return (
            <Rectangle
              key={`rectangle-${geo.type}-${geo.coordinates}`}
              bounds={geo.coordinates}
              color={theme.color.primary}
            >
              {children}
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
              {children}
            </Marker>
          )
        case 'MultiPoint':
          return (
            <Fragment key={`marker-${geo.type}-${geo.coordinates}`}>
              {geo.coordinates.map(single => (
                <Marker key={`marker-${geo.type}-${single}`} position={single} icon={MarkerIcon}>
                  {children}
                </Marker>
              ))}
            </Fragment>
          )
        default:
          console.error("CAN'T DRAW GEOMETRY FOR TYPE: ", geo)
          return null
      }
    })

  const initMap = () => {
    const { Map: MapStore } = Stores
    MapStore.makeGeometry(inputGeometry, location).then(geometry => {
      // TODO: use all geometries to calculate bounds
      const bounds = geometry?.[0].bounds
      const layers = makeLayers(geometry)
      setGeometry(geometry)
      setBounds(bounds)
      setLayers(layers)
    })
  }

  useEffect(() => {
    initMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (geometry === undefined) {
    return null
  }

  const getMapOptions = () => {
    // TODO: Zoom and bounds are calculated by first WKT string and not influenced by others
    if (geometry?.[0].type === 'Point') {
      return {
        zoom: 10,
        center: bounds?.[0],
      }
    }
    return {
      bounds: bounds,
    }
  }
  return (
    <MapStyleContainer>
      <CustomMap {...getMapOptions()}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {layers}
      </CustomMap>
    </MapStyleContainer>
  )
}

MyMap.propTypes = {
  geometry: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.element,
}

const CustomMap = styled(MapContainer)`
  height: 400px;
  width: 100%;
`

const MapStyleContainer = styled.div`
  margin-bottom: 1em;
  ${mapStyle};
`

export default MyMap
