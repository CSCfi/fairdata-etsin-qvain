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

import Agent from '../Agent'
import getPreservationEvent from './getPreservationEvent'
import { PreservationInfo } from './common'
import { useStores } from '@/stores/stores'

const printDate = (Locale, temp) => {
  const { dateFormat } = Locale
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
  const { Locale } = useStores()
  const { getValueTranslation, getPreferredLang } = Locale
  const { event, preservationInfo } = props

  const { title: preservationEventTitle, description: preservationEventDescription } =
    getPreservationEvent({
      event,
      preservationInfo,
    })

  return (
    <tr key={`provenance-${getValueTranslation(event.title)}`}>
      <td>
        {/* If this contains both lifecycle and preservation events, it will display both in one box */}
        {event.lifecycle_event !== undefined && (
          <span lang={getPreferredLang(event.lifecycle_event.pref_label)}>
            {getValueTranslation(event.lifecycle_event.pref_label)}
          </span>
        )}
        {preservationEventTitle}
      </td>
      <td>
        {event.was_associated_with &&
          event.was_associated_with.map((associate, i) => {
            if (associate.name) {
              return (
                <InlineUl key={`ul-${getValueTranslation(associate.name)}`}>
                  <Agent
                    lang={getPreferredLang(associate, undefined)}
                    key={getValueTranslation(associate) || associate.name}
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
        {event.temporal && printDate(Locale, event.temporal)}
      </td>
      <td>{event.title && getValueTranslation(event.title)}</td>
      <td>
        {preservationEventDescription ||
          (event.description && getValueTranslation(event.description))}
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
