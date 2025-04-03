import React, { useState } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import PopUp from '@/components/general/popup'
import { TransparentLink } from '@/components/general/button'

import etsinTheme from '@/styles/theme'
import { useStores } from '@/stores/stores'
import { PRESERVATION_EVENT_CREATED } from '@/utils/constants'

import Agent from '../Agent'

const Event = ({ event }) => {
  const {
    Etsin: {
      EtsinDataset: { isPas, preservation },
    },
    Locale: { lang, dateFormat, dateSeparator, getPreferredLang, getValueTranslation },
  } = useStores()

  const [popUpOpen, setPopupOpen] = useState(false)
  const openPopUp = () => setPopupOpen(true)
  const closePopUp = () => setPopupOpen(false)

  const preservationTranslationRoot = isPas
    ? 'dataset.events_idn.preservationEvent.preservedCopy'
    : 'dataset.events_idn.preservationEvent.useCopy'

  const showPreservationEvent = event.preservation_event?.url === PRESERVATION_EVENT_CREATED

  const getTitleandDescription = () => {
    if (showPreservationEvent) {
      return (
        <>
          <Translate component={EventTitle} content={`${preservationTranslationRoot}.title`} />
          {(preservation.useCopy || preservation.preservedCopy) && (
            <Link
              to={`/dataset/${
                preservation.useCopy ? preservation.useCopy.id : preservation.preservedCopy.id
              }`}
            >
              <Translate content={`${preservationTranslationRoot}.descriptionLink`} />
            </Link>
          )}
        </>
      )
    }
    return (
      <>
        {event.title && <EventTitle>{getValueTranslation(event.title)}</EventTitle>}
        {event.description && getValueTranslation(event.description)}
        {!(event.title || event.description) && '-'}
      </>
    )
  }

  const getEventType = () => {
    if (!event.lifecycle_event) return '-'

    return (
      <>
        {/* Title */}
        {
          <span lang={getPreferredLang(event.lifecycle_event.pref_label)}>
            {getValueTranslation(event.lifecycle_event.pref_label)}
          </span>
        }

        {/* Outcome and outcome description popup */}
        {(event.event_outcome || event.outcome_description) &&
          (event.outcome_description ? (
            <PopUp
              isOpen={popUpOpen}
              onRequestClose={closePopUp}
              align={'left'}
              popUp={
                <EventOutcomeDescription>
                  {getValueTranslation(event.outcome_description)}
                </EventOutcomeDescription>
              }
              role="tooltip"
            >
              {' ('}
              <InlineTransparentLink
                noMargin
                noPadding
                href="#0"
                onClick={popUpOpen ? closePopUp : openPopUp}
                lang={getPreferredLang(event.event_outcome?.pref_label) || lang}
              >
                {event.event_outcome ? (
                  getValueTranslation(event.event_outcome.pref_label)
                ) : (
                  <Translate
                    component="span"
                    content="dataset.events_idn.events.outcome_description"
                  />
                )}
              </InlineTransparentLink>
              {')'}
            </PopUp>
          ) : (
            ` (${getValueTranslation(event.event_outcome.pref_label)})`
          ))}
      </>
    )
  }

  const getTemporal = () => {
    if (showPreservationEvent) {
      return (
        <>
          {preservation.state_modified
            ? dateFormat(preservation.state_modified, { format: 'date' })
            : '-'}
        </>
      )
    }
    return (
      <>
        {(event.temporal && dateSeparator(event.temporal?.start_date, event.temporal?.end_date)) ||
          event.temporal?.temporal_coverage ||
          '-'}
      </>
    )
  }

  const getSpatial = spatial => {
    if (!spatial) return '-'
    if (spatial.reference && spatial.geographic_name) {
      return `${getValueTranslation(spatial.reference.pref_label)} (${spatial.geographic_name})`
    }
    return getValueTranslation(spatial.reference?.pref_label) || spatial.geographic_name || '-'
  }

  if (!(event.title || event.description || event.lifecycle_event || event.preservation_event))
    return null
  if (event.preservation_event && !showPreservationEvent) return null

  return (
    <tr key={`event-${event.id}`}>
      <td>{getTitleandDescription()}</td>
      <td>{getEventType()}</td>
      <td>
        <ul>
          {event.is_associated_with?.map((associate, i) => {
            const name = associate.person?.name || associate.organization.pref_label
            if (name) {
              return (
                <Agent lang={getPreferredLang(name)} key={name} first={i === 0} agent={associate} />
              )
            }
            return <>{''}</>
          })}
        </ul>
        {(!event.is_associated_with || event.is_associated_with.length === 0) && '-'}
      </td>
      <td>{getTemporal()}</td>
      <td>{getSpatial(event.spatial)}</td>
    </tr>
  )
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
}

const EventTitle = styled.h3`
  font-weight: bold;
`

const EventOutcomeDescription = styled.div`
  min-width: 13em;
  max-height: 15em;
  overflow: scroll;
`

const InlineTransparentLink = styled(TransparentLink)`
  display: inline;
  color: ${etsinTheme.color.linkColorUIV2};
`

export default observer(Event)
