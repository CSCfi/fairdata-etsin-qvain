import { parseISO as parseDateISO } from 'date-fns'

import { useStores } from '@/stores/stores'
import styled from 'styled-components'

const ApplicationEvents = () => {
  const {
    Qvain: {
      REMSApplications: { selectedApplication },
    },
    Locale: { dateFormat, translate },
  } = useStores()

  const application = selectedApplication
  const events = application['application/events']

  const getEvent = event => {
    const id = event['event/id']
    const type = event['event/type']
    const actorAttributes = event['event/actor-attributes']
    const actorName = actorAttributes?.name || event['event/actor']
    const comment = event['application/comment']

    const time = parseDateISO(event['event/time'])
    const timeStr = dateFormat(time)

    return (
      <li key={id}>
        <div>
          <em>{type}</em>
        </div>
        {comment && (
          <div>
            {translate('qvain.applications.modal.comment')}: {comment}
          </div>
        )}
        <DateRow>
          <span>{timeStr}</span>
          <span>{actorName}</span>
        </DateRow>
        <hr />
      </li>
    )
  }

  return <EventList>{events.map(event => getEvent(event))}</EventList>
}

const DateRow = styled.div`
  display: flex;
  gap: 1rem;
`

const EventList = styled.ul`
  margin-top: 1rem;
`

export default ApplicationEvents
