import React, { Component } from 'react'
import styled from 'styled-components'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaArrowsAltV from '@fortawesome/fontawesome-free-solid/faArrowsAltV'
import FaMapMarker from '@fortawesome/fontawesome-free-solid/faMapMarkerAlt'
import { TypeLocation } from '../../../utils/propTypes'
import MyMap from './map'
import checkDataLang from '../../../utils/checkDataLang'

class Maps extends Component {
  static propTypes = {
    spatial: TypeLocation.isRequired,
  }
  render() {
    return (
      <div>
        {this.props.spatial.map(spatial => {
          if (spatial.as_wkt !== undefined || spatial.place_uri !== undefined) {
            return (
              <MyMap
                key={`${spatial.as_wkt && spatial.as_wkt[0]}-${spatial.place_uri &&
                  spatial.place_uri.identifier}`}
                geometry={spatial.as_wkt}
                place_uri={spatial.place_uri && spatial.place_uri.pref_label}
              >
                <CustomPopup>
                  {spatial.place_uri && <h2>{checkDataLang(spatial.place_uri.pref_label)}</h2>}
                  {spatial.geographic_name && <h3>{spatial.geographic_name}</h3>}
                  {spatial.full_address && (
                    <p>
                      <FontAwesomeIcon icon={FaMapMarker} />
                      <i>{spatial.full_address}</i>
                    </p>
                  )}
                  {spatial.alt && (
                    <p>
                      <FontAwesomeIcon icon={FaArrowsAltV} />Alititude: {spatial.alt}m
                    </p>
                  )}
                </CustomPopup>
              </MyMap>
            )
          }
          return null
        })}
      </div>
    )
  }
}

const CustomPopup = styled.div`
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

export default Maps
