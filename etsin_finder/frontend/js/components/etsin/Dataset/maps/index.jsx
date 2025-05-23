import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkerAlt, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { Popup } from 'react-leaflet'
import Translate from '@/utils/Translate'
import { useStores } from '@/utils/stores'

import MyMap from './map'

const Maps = props => {
  const {
    Accessibility,
    Matomo,
    Etsin: {
      EtsinDataset: { datasetMetadata },
    },
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()

  useEffect(() => {
    Accessibility.handleNavigation('maps', false)
    Matomo.recordEvent(`MAPS / ${props.match.params.identifier}`)
  }, [Accessibility, Matomo, props.match.params.identifier])

  const buildLocationRow = spatial => {
    // Datasets submitted via API don't require geographic name for location, in which case the name comes from place_uri
    const locationName =
      spatial.geographic_name || getValueTranslation(spatial.reference?.pref_label)

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
            spatial.full_address ? <span>{spatial.full_address}</span> : <span>-</span>
          }
        </td>
        <td>
          {
            // Display if alt exists, otherwise display '-'
            spatial.altitude_in_meters ? <span>{spatial.altitude_in_meters}</span> : <span>-</span>
          }
        </td>
      </tr>
    )
  }

  return (
    <div id={props.id} className="tabContent">
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
        <tbody>{datasetMetadata.spatial.map(spatial => buildLocationRow(spatial))}</tbody>
      </Table>

      {/* The actual map */}
      {datasetMetadata.spatial.map(spatial => {
        // Map shown only if either map coordinate(s) or map location is defined
        if (spatial.wkt?.length > 0 || spatial.reference?.pref_label) {
          return (
            <MyMap
              key={`${spatial.wkt}-${spatial.reference?.url}-${spatial.geographic_name}`}
              geometry={spatial.wkt}
              location={spatial.reference?.pref_label}
            >
              {/* Map popup, hidden if it contains no information */}
              {spatial.reference?.pref_label ||
              spatial.geographic_name ||
              spatial.full_address ||
              spatial.altitude_in_meters ? (
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
                  {spatial.altitude_in_meters && (
                    <p>
                      <FontAwesomeIcon icon={faExpandArrowsAlt} />
                      Altitude: {spatial.altitude_in_meters}
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

const Table = styled.table`
  overflow-x: scroll;
  width: 100%;
  max-width: 100%;
  margin: 1rem 0;
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

Maps.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      identifier: PropTypes.string,
    }),
  }).isRequired,
  id: PropTypes.string.isRequired,
}

export default observer(Maps)
