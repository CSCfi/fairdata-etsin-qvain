import { useEffect } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'
import { useStores } from '@/utils/stores'

import SpatialMap from './SpatialMap'
import { useParams } from 'react-router'

const Maps = props => {
  const {
    Accessibility,
    Matomo,
    Etsin: {
      EtsinDataset: { datasetMetadata },
    },
    Locale: { getValueTranslation },
  } = useStores()

  const params = useParams()

  useEffect(() => {
    Accessibility.handleNavigation('maps', false)
    Matomo.recordEvent(`MAPS / ${params.identifier}`)
  }, [Accessibility, Matomo, params.identifier])

  /*Values of each spatial record are reviewed. If any of the records contain
  table data, the hasCellValues variable will be true, rendering the map
  table. If no record has table data, the table will not be rendered. (See
  the return part):
  */
  const hasCellValues = datasetMetadata.spatial.some(
    spat =>
      spat.geographic_name ||
      getValueTranslation(spat.reference?.pref_label) ||
      spat.full_address ||
      spat.altitude_in_meters?.toString()
  )

  const buildLocationRow = spatial => {
    // Datasets submitted via API don't require geographic name for location, in which case the name comes from place_uri
    const locationName =
      spatial.geographic_name || getValueTranslation(spatial.reference?.pref_label)

    // Build a table row only if the record has table data:
    if (locationName || spatial.full_address || spatial.altitude_in_meters?.toString()) {
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
              /*The value is converted to a string since in the case where
              altitude is 0, it would otherwise evaluate to false: */
              spatial.altitude_in_meters?.toString() ? (
                <span>{spatial.altitude_in_meters}</span>
              ) : (
                <span>-</span>
              )
            }
          </td>
        </tr>
      )
    }

    return null
  }

  return (
    <div id={props.id} className="tabContent" data-testid={props.id}>
      {/* Map details in a table list (this is not the actual map) */}
      {hasCellValues && (
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
      )}

      {/* The actual map */}
      {datasetMetadata.spatial.map(spatial => {
        if (spatial.geolocations?.features.length > 0 || spatial.wkt?.length > 0 || spatial.reference?.pref_label) {
          return (
            <SpatialMap
              key={`${spatial.wkt}-${spatial.reference?.url}-${spatial.geographic_name}`}
              spatial={spatial}
            />
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

Maps.propTypes = {
  id: PropTypes.string.isRequired,
}

export default observer(Maps)
