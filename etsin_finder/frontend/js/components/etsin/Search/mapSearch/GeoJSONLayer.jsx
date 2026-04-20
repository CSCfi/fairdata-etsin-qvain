import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useStores } from '@/stores/stores'
import PropTypes from 'prop-types'

function GeoJSONLayer({ isMapLayersSaved, setIsMapLayersSaved }) {
  // draws features from stores to map
  const {
    Etsin: {
      Search: {
        MapSearch: { layers, currentCenter, currentZoom, bounds },
      },
    },
  } = useStores()

  const map = useMap()

  useEffect(() => {
    if (map && layers) {
      const geoJsonLayers = L.geoJSON(toJS(layers))
      const group = L.layerGroup([geoJsonLayers])
      group.addTo(map)

      return () => {
        map.removeLayer(group)
      }
    }
  }, [map, layers])

  // When isMapLayersSaved is true, the map is primarily set to the
  // currentCenter and currentZoom values (i.e. either the default sidebar
  // map position or the position set by the user). Secondarily (for example,
  // when navigating from a single dataset view to the search page) the map is
  // centered based on the drawn shape.
  useEffect(() => {
    if (map && isMapLayersSaved) {
      if (currentCenter && currentZoom) {
        map.setView(currentCenter, currentZoom, { animate: false })
      } else if (bounds) {
        map.fitBounds(bounds, { animate: false })
      }

      setIsMapLayersSaved(false)
    }
  }, [map, isMapLayersSaved, currentCenter, currentZoom, bounds, setIsMapLayersSaved])

  return null
}

GeoJSONLayer.propTypes = {
  isMapLayersSaved: PropTypes.bool.isRequired,
  setIsMapLayersSaved: PropTypes.func.isRequired,
}

export default observer(GeoJSONLayer)
