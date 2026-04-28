import { MapContainer, TileLayer } from 'react-leaflet'
import styled from 'styled-components'

import Layers from './Layers'
import mapStyle from './mapStyle'
import { SpatialPropType } from './propTypes'

const SpatialMap = ({ spatial }) => {
  return (
    <MapStyleContainer>
      <CustomMap>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Layers spatial={spatial} />
      </CustomMap>
    </MapStyleContainer>
  )
}

SpatialMap.propTypes = {
  spatial: SpatialPropType,
}

const CustomMap = styled(MapContainer)`
  height: 400px;
  width: 100%;
`

const MapStyleContainer = styled.div`
  margin-bottom: 1em;
  ${mapStyle};
`

export default SpatialMap
