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
import { observer } from 'mobx-react'
import styled from 'styled-components'

import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import dateFormat from '@/utils/dateFormat'
import Agent from '../Agent'
import getPreservationEvent from './getPreservationEvent'
import { PreservationInfo } from './common'

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

const Event = props => {
  const { event, preservationInfo } = props

  const { title: preservationEventTitle, description: preservationEventDescription } =
    getPreservationEvent({
      event,
      preservationInfo,
    })

  return (
    <tr key={`provenance-${checkDataLang(event.title)}`}>
      <td>
        {/* If this contains both lifecycle and preservation events, it will display both in one box */}
        {event.lifecycle_event !== undefined && (
          <span lang={getDataLang(event.lifecycle_event.pref_label)}>
            {checkDataLang(event.lifecycle_event.pref_label)}
          </span>
        )}
        {preservationEventTitle}
      </td>
      <td>
        {event.was_associated_with &&
          event.was_associated_with.map((associate, i) => {
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
        {event.temporal && printDate(event.temporal)}
      </td>
      <td>
        {/* Some datasets have start_date and some startDate */}
        {event.title && checkDataLang(event.title)}
      </td>
      <td>
        {preservationEventDescription || (event.description && checkDataLang(event.description))}
      </td>
    </tr>
  )
}

Event.defaultProps = {
  preservationInfo: undefined,
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  preservationInfo: PreservationInfo,
}

const InlineUl = styled.ul`
  display: inline;
  margin: 0;
  padding: 0;
`

export default observer(Event)
