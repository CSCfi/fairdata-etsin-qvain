import React from 'react'
import Translate from 'react-translate-component'

import { Link } from 'react-router-dom'
import { PRESERVATION_EVENT_CREATED } from '@/utils/constants'

const getPreservationEvent = ({
  event,
  preservationInfo: { copyIdentifier, modified, translationRoot } = {},
}) => {
  const preservationEvent = event?.preservation_event
  if (preservationEvent?.identifier !== PRESERVATION_EVENT_CREATED) {
    return { title: null, description: null }
  }
  const title = <Translate content={`${translationRoot}.title`} />

  const description = copyIdentifier ? (
    <span>
      {modified && (
        <>
          <Translate content={`${translationRoot}.descriptionDate`} with={{ date: modified }} />{' '}
        </>
      )}
      <Link to={`/dataset/${copyIdentifier}`}>
        <Translate content={`${translationRoot}.descriptionLink`} />
      </Link>
    </span>
  ) : (
    ''
  )
  return { title, description }
}

export default getPreservationEvent
