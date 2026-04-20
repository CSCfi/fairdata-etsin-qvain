import { observer } from 'mobx-react'
import { useMap } from 'react-leaflet'
import { useEffect } from 'react'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import L from 'leaflet'

function GeomanToolBar() {
  const map = useMap()

  useEffect(() => {
    if (map) {
      map.whenReady(() => {
        // replace icons with working ones
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: markerIcon2x,
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
        })

        // add the toolbar
        map.pm.addControls({
          position: 'topleft',
          drawCircle: false,
          drawCircleMarker: false,
          drawPolyline: false,
          drawText: false,
          oneBlock: false,
          customControls: false,
        })
      })
    }
  }, [map])

  return null
}

export default observer(GeomanToolBar)
