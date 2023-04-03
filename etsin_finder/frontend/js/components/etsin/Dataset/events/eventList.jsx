/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2021 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import dateFormat from '@/utils/dateFormat'
import { hasProvenances, Table, IDLink, Margin, PreservationInfo } from './common'
import Event from './event'
import checkDataLang from '@/utils/checkDataLang'

const EventList = props => {
  const { deletedVersions, provenances, dateDeprecated } = props

  if (!(hasProvenances(provenances) || deletedVersions?.length > 0 || dateDeprecated)) {
    return null
  }

  return (
    <Margin>
      <h2>
        <Translate content="dataset.events_idn.events.title" />
      </h2>
      <Table>
        <thead>
          <tr>
            <th className="rowIcon" scope="col">
              <Translate content="dataset.events_idn.events.event" />
            </th>
            <th className="rowIcon" scope="col">
              <Translate content="dataset.events_idn.events.who" />
            </th>
            <th className="rowIcon" scope="col">
              {' '}
              <Translate content="dataset.events_idn.events.when" />
            </th>
            <th className="rowIcon" scope="col">
              <Translate content="dataset.events_idn.events.event_title" />
            </th>
            <th className="rowIcon" scope="col">
              <Translate content="dataset.events_idn.events.description" />
            </th>
          </tr>
        </thead>
        <tbody>
          {
            // Displaying general events
            provenances.map(event => (
              <Event
                key={`provenance-${checkDataLang(event.title)}`}
                event={event}
                preservationInfo={props.preservationInfo}
              />
            ))
          }
          {dateDeprecated && (
            // Displaying deprecated datasets
            <tr key={dateDeprecated}>
              {/* Dataset deprecation as event */}
              <Translate component="td" content="dataset.events_idn.deprecations.event" />
              {/* Who (none), not recorded */}
              <td>-</td>
              {/* Date of deprecation */}
              <td>{dateFormat(dateDeprecated)}</td>
              {/* Event description as header */}
              <Translate component="td" content="dataset.events_idn.deprecations.title" />
              {/* Description */}
              <Translate component="td" content="dataset.events_idn.deprecations.description" />
            </tr>
          )}

          {
            // Display deleted events
            deletedVersions.map(single => (
              <tr key={single.identifier}>
                {/* Dataset deletion as event */}
                <Translate component="td" content="dataset.events_idn.events.deletionEvent" />
                {/* Who (none), not recorded */}
                <td>-</td>
                {/* Date of deletion */}
                <td>{dateFormat(single.dateRemoved.input)}</td>
                {/* Event description as header */}
                <td>
                  <span>
                    <Translate content="dataset.events_idn.events.deletionOfDatasetVersion" />
                    {single.label}
                  </span>
                </td>
                {/* Link to deleted dataset */}
                <td>
                  {
                    <IDLink href={single.url} rel="noopener noreferrer" target="_blank">
                      {single.url}
                    </IDLink>
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </Margin>
  )
}

EventList.defaultProps = {
  provenances: [],
  deletedVersions: [],
  dateDeprecated: null,
  preservationInfo: undefined,
}

EventList.propTypes = {
  provenances: PropTypes.array,
  deletedVersions: PropTypes.array,
  dateDeprecated: PropTypes.string,
  preservationInfo: PreservationInfo,
}

export default observer(EventList)
