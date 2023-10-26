import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Link } from 'react-router-dom'

import { useStores } from '@/stores/stores'
import { PRESERVATION_EVENT_CREATED } from '@/utils/constants'

import Agent from '../Agent'

const Event = ({ event }) => {
  const {
    Etsin: {
      EtsinDataset: { isPas, preservation },
    },
    Locale: { dateFormat, dateSeparator, getPreferredLang, getValueTranslation },
  } = useStores()

  const preservationTranslationRoot = isPas
    ? 'dataset.events_idn.preservationEvent.preservedCopy'
    : 'dataset.events_idn.preservationEvent.useCopy'

  const showPreservationEvent = event.preservation_event?.identifier === PRESERVATION_EVENT_CREATED

  if (event.preservation_event && !showPreservationEvent) return null

  return (
    <tr key={`provenance-${getValueTranslation(event.title)}`}>
      {/* EVENT */}
      <td>
        {event.lifecycle_event && (
          <span lang={getPreferredLang(event.lifecycle_event.pref_label)}>
            {getValueTranslation(event.lifecycle_event.pref_label)}
          </span>
        )}
        {showPreservationEvent && <Translate content={`${preservationTranslationRoot}.title`} />}
      </td>

      {/* WHO */}
      <td>
        {event.is_associated_with &&
          event.is_associated_with.map((associate, i) => {
            const name = associate.person?.name || associate.organization.pref_label
            if (name) {
              return (
                <Agent
                  lang={getPreferredLang(associate)}
                  key={name}
                  first={i === 0}
                  agent={associate}
                />
              )
            }
            return ''
          })}
      </td>

      {/* WHEN */}
      <td>
        {event.lifecycle_event &&
          dateSeparator(event.temporal?.start_date, event.temporal?.end_date)}
        {showPreservationEvent && dateFormat(preservation.stateModified, { format: 'date' })}
      </td>

      {/* TITLE */}
      <td>{event.title && getValueTranslation(event.title)}</td>

      {/* DESCRIPTION */}
      <td>
        {event.description && !showPreservationEvent && getValueTranslation(event.description)}
        {showPreservationEvent && (
          <Link
            to={`/dataset/${
              preservation.useCopy
                ? preservation.useCopy.identifier
                : preservation.preservedCopy.identifier
            }`}
          >
            <Translate content={`${preservationTranslationRoot}.descriptionLink`} />
          </Link>
        )}
      </td>
    </tr>
  )
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
}

export default observer(Event)
