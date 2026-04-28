import { faExpandArrowsAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popup } from 'react-leaflet'
import styled from 'styled-components'
import { SpatialPropType } from './propTypes'
import { useStores } from '@/stores/stores'

// Map popup, hidden if it contains no information
const MapPopup = ({ spatial }) => {
  const {
    Locale: { getValueTranslation, getPreferredLang },
  } = useStores()

  if (
    !(
      spatial.reference?.pref_label ||
      spatial.geographic_name ||
      spatial.full_address ||
      spatial.altitude_in_meters?.toString()
    )
  ) {
    return null
  }
  return (
    <CustomPopup>
      {spatial.reference && (
        <h2 lang={getPreferredLang(spatial.reference.pref_label)}>
          {getValueTranslation(spatial.reference.pref_label)}
        </h2>
      )}
      {spatial.geographic_name && <h3>{spatial.geographic_name}</h3>}
      {spatial.full_address && (
        <p>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <i>{spatial.full_address}</i>
        </p>
      )}
      {spatial.altitude_in_meters?.toString() && (
        <p>
          <FontAwesomeIcon icon={faExpandArrowsAlt} />
          Altitude: {spatial.altitude_in_meters}
        </p>
      )}
    </CustomPopup>
  )
}

MapPopup.propTypes = {
  spatial: SpatialPropType,
}

const CustomPopup = styled(Popup)`
  h2,
  h3 {
    margin-bottom: 0;
    line-height: 1.4;
  }
  h3 {
    margin-bottom: 0.3em;
  }
  p {
    margin-bottom: 0;
  }
  i {
    font-style: italic;
  }
  svg {
    margin-right: 0.5em;
  }
`

export default MapPopup
