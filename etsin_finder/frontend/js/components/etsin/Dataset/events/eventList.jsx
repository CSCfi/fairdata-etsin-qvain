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
import styled from 'styled-components'

import { useStores } from '@/stores/stores'
import { Table, IDLink, Margin } from './common'
import Event from './event'

const EventList = () => {
  const {
    Etsin: {
      EtsinDataset: { deletedVersions, hasProvenances, provenance, isDeprecated, dateDeprecated },
    },
    Locale: { dateFormat },
  } = useStores()

  if (!(hasProvenances || deletedVersions?.length > 0 || isDeprecated)) {
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
              <Translate content="dataset.events_idn.events.description" />
            </th>
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
              <Translate content="dataset.events_idn.events.where" />
            </th>
          </tr>
        </thead>
        <tbody>
          {
            // Displaying general events
            provenance.map(event => (
              <Event event={event} key={`provenance-${event.id}`} />
            ))
          }
          {isDeprecated && (
            // Displaying deprecated datasets
            <tr key={dateDeprecated}>
              {/* Title and Description */}
              {/* Event description as header */}
              <td>
                <Translate component={EventTitle} content="dataset.events_idn.deprecations.title" />
                <Translate component="span" content="dataset.events_idn.deprecations.description" />
              </td>
              {/* Dataset deprecation as event */}
              <Translate component="td" content="dataset.events_idn.deprecations.event" />
              {/* Who (none), not recorded */}
              <td>-</td>
              {/* Date of deprecation */}
              <td>{dateFormat(dateDeprecated)}</td>
              {/* Where (none), not recorded */}
              <td>-</td>
            </tr>
          )}
          {
            // Display deleted events
            deletedVersions.map(single => (
              <tr key={single.identifier}>
                {/* Event description as header */}
                <td>
                  <Translate
                    component={EventTitle}
                    content="dataset.events_idn.events.deletionTitle"
                  />
                  <span>
                    <Translate
                      component="span"
                      content="dataset.events_idn.events.deletionOfDatasetVersion"
                    />
                    {single.label}
                    <br />
                    <Translate
                      component="span"
                      content="dataset.events_idn.events.deletionIdentifier"
                    />
                    {
                      <IDLink href={single.url} rel="noopener noreferrer" target="_blank">
                        {single.identifier}
                      </IDLink>
                    }
                  </span>
                </td>
                {/* Dataset deletion as event */}
                <Translate component="td" content="dataset.events_idn.events.deletionEvent" />
                {/* Who (none), not recorded */}
                <td>-</td>
                {/* Date of deletion */}
                <td>{dateFormat(single.dateRemoved.input)}</td>
                {/* Where (none), not recorded */}
                <td>-</td>
              </tr>
            ))
          }
        </tbody>
      </Table>
    </Margin>
  )
}

const EventTitle = styled.h5`
  font-weight: bold;
`

export default observer(EventList)
