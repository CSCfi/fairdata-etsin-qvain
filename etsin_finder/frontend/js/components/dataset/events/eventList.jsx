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
import styled from 'styled-components'

import checkDataLang, { getDataLang } from '../../../utils/checkDataLang'
import dateFormat from '../../../utils/dateFormat'
import Agent from '../agent'
import { hasProvenances, Table, IDLink, Margin } from './common'

const printDate = temp => {
  if (temp.start_date === temp.end_date) {
    return dateFormat(temp.start_date)
  }
  return (
    <span>
      {dateFormat(temp.start_date)} &ndash; {dateFormat(temp.end_date)}
    </span>
  )
}

const EventList = props => {
  const { deletedVersions, provenances } = props

  if (!(hasProvenances(provenances) || deletedVersions?.length > 0)) {
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
            provenances.map(single => (
              <tr key={`provenance-${checkDataLang(single.title)}`}>
                <td>
                  {/* If this contains both lifecycle and preservation events, it will display both in one box */}
                  {single.lifecycle_event !== undefined && (
                    <span lang={getDataLang(single.lifecycle_event.pref_label)}>
                      {checkDataLang(single.lifecycle_event.pref_label)}
                    </span>
                  )}
                  {single.preservation_event && (
                    <span lang={getDataLang(single.preservation_event.pref_label)}>
                      {checkDataLang(single.preservation_event.pref_label)}
                    </span>
                  )}
                </td>
                <td>
                  {single.was_associated_with &&
                    single.was_associated_with.map((associate, i) => {
                      if (associate.name) {
                        return (
                          <InlineUl key={`ul-${checkDataLang(associate.name)}`}>
                            <Agent
                              lang={getDataLang(associate)}
                              key={checkDataLang(associate) || associate.name}
                              first={i === 0}
                              agent={associate}
                            />
                          </InlineUl>
                        )
                      }
                      return ''
                    })}
                </td>
                <td>
                  {/* Some datasets have start_date and some startDate */}
                  {single.temporal && printDate(single.temporal)}
                </td>
                <td>
                  {/* Some datasets have start_date and some startDate */}
                  {single.title && checkDataLang(single.title)}
                </td>
                <td lang={getDataLang(single.description)}>
                  {single.description && checkDataLang(single.description)}
                </td>
              </tr>
            ))
          }

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
}

EventList.propTypes = {
  provenances: PropTypes.array,
  deletedVersions: PropTypes.array,
}

const InlineUl = styled.ul`
  display: inline;
  margin: 0;
  padding: 0;
`

export default observer(EventList)
