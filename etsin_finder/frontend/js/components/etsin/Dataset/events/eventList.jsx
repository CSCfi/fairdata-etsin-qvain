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
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'
import { hasProvenances, Table, IDLink, Margin } from './common'
import Event from './event'

const EventList = () => {
  const {
    Etsin: {
      EtsinDataset: { deletedVersions, provenance, dateDeprecated },
    },
    Locale: { dateFormat, getValueTranslation },
  } = useStores()

  if (!(hasProvenances(provenance) || deletedVersions?.length > 0 || dateDeprecated)) {
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
            provenance.map(event => (
              <Event event={event} key={`event-${getValueTranslation(event.title)}`} />
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
                      {single.identifier}
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

export default observer(EventList)
