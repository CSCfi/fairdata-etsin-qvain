import { useStores } from '@/stores/stores'
import { latLng } from 'leaflet'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

function MapInstanceSaver({ setter }) {
  const {
    Etsin: {
      Search: {
        MapSearch: {
          resetLayers,
          setResetLayers,
          setLayers,
          defaultSidebarMapCenterAsArray,
          defaultSidebarMapZoom,
          applyDefaultView,
        },
      },
    },
  } = useStores()

  const map = useMap()

  useEffect(() => {
    if (map) {
      map.whenReady(() => {
        setter(map)

        // When resetLayers is true (i.e. when the Remove filters
        // button has been clicked), remove the shapes from the map.
        // Then set resetLayers back to false, reset the layers variable,
        // and restore the default sidebar map center and zoom.
        if (resetLayers) {
          map.pm.getGeomanLayers(true).eachLayer(layer => {
            map.removeLayer(layer)
          })

          setResetLayers(false)
          setLayers(null)
          applyDefaultView()
          map.setView(latLng(...defaultSidebarMapCenterAsArray), defaultSidebarMapZoom, {
            animate: false,
          })
        }

        // Drawing buttons and drawing functionality are disabled
        // when a shape exists on the map; otherwise they are enabled.
        const handleDraw = () => {
          const hasShapes = map.pm.getGeomanLayers().length > 0

          map.pm.Toolbar.setButtonDisabled('drawPolygon', hasShapes)
          map.pm.Toolbar.setButtonDisabled('drawRectangle', hasShapes)
          map.pm.Toolbar.setButtonDisabled('drawMarker', hasShapes)

          if (hasShapes) {
            map.pm.disableDraw()
          }
        }

        handleDraw()
        map.on('pm:create', handleDraw)
        map.on('pm:remove', handleDraw)

        return () => {
          map.off('pm:create', handleDraw)
          map.off('pm:remove', handleDraw)
        }
      })
    }
  }, [
    map,
    setter,
    resetLayers,
    setResetLayers,
    setLayers,
    applyDefaultView,
    defaultSidebarMapCenterAsArray,
    defaultSidebarMapZoom,
  ])

  return null
}

MapInstanceSaver.propTypes = {
  setter: PropTypes.func.isRequired,
}

export default observer(MapInstanceSaver)
