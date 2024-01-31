import React, { Component } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Popup } from 'react-leaflet'
import { observer } from 'mobx-react'

import { TypeLocation } from '@/utils/propTypes'
import MyMap from './map'
import { withStores } from '@/stores/stores'

const Table = styled.table`
  overflow-x: scroll;
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
  thead {
    background-color: ${props => props.theme.color.primary};
    color: white;
    tr > th {
      padding: 0.75rem;
      border: 0;
    }
  }
  tbody {
    box-sizing: border-box;
    border: 2px solid ${props => props.theme.color.lightgray};
    border-top: ${props => (props.noHead ? '' : 0)};
    tr:nth-child(odd) {
      background-color: ${props => props.theme.color.superlightgray};
    }
    tr:nth-child(even) {
      background-color: ${props => props.theme.color.white};
    }
    td {
      overflow-wrap: break-word;
      padding: 0.75rem;
    }
  }
`

class Maps extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        identifier: PropTypes.string,
      }),
    }).isRequired,
    spatial: TypeLocation.isRequired,
    id: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const { Accessibility, Matomo } = this.props.Stores

    Accessibility.handleNavigation('maps', false)
    Matomo.recordEvent(`MAPS / ${this.props.match.params.identifier}`)
  }

  buildLocationRow(spatial) {
    const {
      Locale: { getValueTranslation },
    } = this.props.Stores

    // Datasets submitted via API don't require geographic name for location, in which case the name comes from place_uri
    const locationName =
      spatial.geographic_name || getValueTranslation(spatial.place_uri?.pref_label)

    return (
      <tr key={`location-${locationName}`}>
        <td>
          {
            // Display if geographic_name exists, otherwise display '-'
            locationName ? <span>{locationName}</span> : <span>-</span>
          }
        </td>
        <td>
          {
            // Display if full_address exists, otherwise display '-'
            spatial.full_address !== undefined ? (
              <span>{spatial.full_address}</span>
            ) : (
              <span>-</span>
            )
          }
        </td>
        <td>
          {
            // Display if alt exists, otherwise display '-'
            spatial.alt !== undefined ? <span>{spatial.alt}</span> : <span>-</span>
          }
        </td>
      </tr>
    )
  }

  render() {
    const {
      Locale: { getPreferredLang, getValueTranslation },
    } = this.props.Stores

    return (
      <div id={this.props.id}>
        {/* Map details in a table list (this is not the actual map) */}
        <Table>
          {/* Table header */}
          <thead>
            <tr>
              <th className="rowIcon" scope="col">
                <Translate content="dataset.map.geographic_name" />
              </th>
              <th className="rowIcon" scope="col">
                <Translate content="dataset.map.full_address" />
              </th>
              <th className="rowIcon" scope="col">
                <Translate content="dataset.map.alt" />
              </th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>{this.props.spatial.map(spatial => this.buildLocationRow(spatial))}</tbody>
        </Table>

        {/* The actual map */}
        {this.props.spatial.map(spatial => {
          // Map shown only if either map coordinate(s) or map location is defined
          if (spatial.as_wkt !== undefined || spatial.place_uri !== undefined) {
            return (
              <MyMap
                key={`${spatial.as_wkt && spatial.as_wkt[0]}-${
                  spatial.place_uri && spatial.place_uri.identifier
                }`}
                geometry={spatial.as_wkt}
                place_uri={spatial.place_uri && spatial.place_uri.pref_label}
              >
                {/* Map popup, hidden if it contains no information */}
                {spatial.place_uri ||
                spatial.geographic_name ||
                spatial.full_address ||
                spatial.alt ? (
                  <CustomPopup>
                    {spatial.place_uri && (
                      <h2 lang={getPreferredLang(spatial.place_uri.pref_label)}>
                        {getValueTranslation(spatial.place_uri.pref_label)}
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
          } // Do not display map if coordinates and location is undefined
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

export default withStores(observer(Maps))
