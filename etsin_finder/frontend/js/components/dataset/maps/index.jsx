import React, { Component } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { Popup } from 'react-leaflet'

import { TypeLocation } from '../../../utils/propTypes'
import MyMap from './map'
import checkDataLang, { getDataLang } from '../../../utils/checkDataLang'
import Tracking from '../../../utils/tracking'
import Accessibility from '../../../stores/view/accessibility'

class Maps extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        identifier: PropTypes.string,
      }),
    }).isRequired,
    spatial: TypeLocation.isRequired,
  }

  componentDidMount() {
    Tracking.newPageView(
      `Dataset: ${this.props.match.params.identifier} | Maps`,
      this.props.location.pathname
    )
    Accessibility.handleNavigation('maps', false)
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
                {/* hide popup if it doesn't contain any information */}
                {spatial.place_uri ||
                spatial.geographic_name ||
                spatial.full_address ||
                spatial.alt ? (
                  <CustomPopup>
                    {spatial.place_uri && (
                      <h2 lang={getDataLang(spatial.place_uri.pref_label)}>
                        {checkDataLang(spatial.place_uri.pref_label)}
                      </h2>
                    )}
                    {spatial.geographic_name && <h3>{spatial.geographic_name}</h3>}
                    {spatial.full_address && (
                      <p>
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <i>{spatial.full_address}</i>
                      </p>
                    )}
                    {spatial.alt && (
                      <p>
                        <FontAwesomeIcon icon={faExpandArrowsAlt} />
                        Altitude: {spatial.alt}
                      </p>
                    )}
                  </CustomPopup>
                ) : null}
              </MyMap>
            )
          }
          return null
        })}
      </div>
    )
  }
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

export default Maps
