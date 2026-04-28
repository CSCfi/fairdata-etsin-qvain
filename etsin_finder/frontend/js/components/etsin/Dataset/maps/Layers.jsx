import leaflet from 'leaflet'
import { useEffect, useState } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
import { useTheme } from 'styled-components'

import mapIcon from '@/assets/images/map_icon.svg'
import { useStores } from '@/stores/stores'
import { SpatialPropType } from './propTypes'
import MapPopup from './MapPopup'

const markerIcon = leaflet.icon({
  iconUrl: mapIcon,
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -20],
})

const Layers = ({ spatial }) => {
  const { Map: MapStore } = useStores()
  const [geometry, setGeometry] = useState(null)

  const map = useMap()
  const theme = useTheme()

  useEffect(() => {
    const makeGeometry = async () => {
      const geo = await MapStore.makeGeometry(spatial)
      const bounds = MapStore.getLeafletBounds(geo)
      map.fitBounds(bounds, { maxZoom: 15 })
      setGeometry(geo)
    }
    makeGeometry()
  }, [spatial, MapStore, map])

  if (!geometry) {
    return null
  }

  return (
    <GeoJSON
      data={geometry}
      color={theme.color.primary}
      weight="3"
      pointToLayer={(feature, latlng) => leaflet.marker(latlng, { icon: markerIcon })}
    >
      <MapPopup spatial={spatial} />
    </GeoJSON>
  )
}

Layers.propTypes = {
  spatial: SpatialPropType,
}

export default Layers
