import { parseISO as parseDateISO } from 'date-fns'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import { useStores } from '@/stores/stores'
import { opacify } from 'polished'
import PropTypes from 'prop-types'

const translateEventComment = ({ event, wasApproved, translate }) => {
  let comment = event['application/comment']

  // Translate special comment added by Metax.
  const type = event['event/type']
  if (type === 'application.event/closed') {
    if (comment === 'Dataset license has changed.') {
      if (wasApproved) {
        return translate('dataset.access_modal.approvedClosedDueToLicenseChange')
      } else {
        return translate('dataset.access_modal.submittedClosedDueToLicenseChange')
      }
    } else if (comment === 'Dataset is no longer in REMS.') {
      return translate('dataset.access_modal.closedDueToAccessTypeChange')
    }
  }
  return comment
}

const REMSComments = ({ application }) => {
  const {
    Locale: { translate, dateFormat },
    Etsin: {
      EtsinDataset: {
        rems: { applicationWasApproved },
      },
    },
  } = useStores()

  const wasApproved = applicationWasApproved(application)

  let comments = []
  const events = application['application/events'] || []
  for (const event of events) {
    const comment = translateEventComment({ event, wasApproved, translate })
    const visibility = event['event/visibility']
    if (!comment || visibility !== 'visibility/public') {
      continue // no comment or comment not relevant for applicant role
    }
    const id = event['event/id']
    const type = event['event/type']
    const actorAttributes = event['event/actor-attributes']
    const actorName = actorAttributes?.name || event['event/actor']
    const time = parseDateISO(event['event/time'])
    const timeStr = dateFormat(time)

    comments.push(
      <li key={id}>
        <div>
          {translate('dataset.access_modal.comments.comment')}: {comment}
        </div>
        <div>
          {translate('dataset.access_modal.comments.event')}: {type}
        </div>

        <DateRow>
          <span>{timeStr}</span>
          <span>{actorName}</span>
        </DateRow>
      </li>
    )
  }

  if (comments.length === 0) {
    return null
  }

  return (
    <Comments>
      <h3>{translate('dataset.access_modal.comments.title')}</h3>
      <CommentList>{comments}</CommentList>
    </Comments>
  )
}

REMSComments.propTypes = {
  application: PropTypes.object.isRequired,
}

const DateRow = styled.div`
  display: flex;
  gap: 1rem;
`

const CommentList = styled.ul`
  li {
    margin-top: 0.5rem;
  }
  li:not(:last-child) {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${p => opacify(-0.8, p.theme.color.primary)};
  }
`

const Comments = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${p => p.theme.color.primary};
  background: ${p => p.theme.color.primaryLight};
  padding: 1rem;
`

export default observer(REMSComments)
