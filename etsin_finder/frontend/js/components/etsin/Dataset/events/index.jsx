/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2021 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { useRouteMatch } from 'react-router'

import { useStores } from '@/stores/stores'
import EventList from './eventList'
import Relations from './relations'
import DeletedVersions from './deletedVersions'
import Versions from './versions'
import Identifiers from './identifiers'
import { Margin } from './common'

const Events = ({ id }) => {
  const {
    Accessibility,
    Matomo,
    Etsin: {
      EtsinDataset: { preservation, otherIdentifiers },
    },
  } = useStores()

  const originIdentifier = [preservation.useCopy?.persistent_identifier].filter(v => v)

  const match = useRouteMatch()

  useEffect(() => {
    Accessibility.handleNavigation('events', false)
    Matomo.recordEvent(`EVENTS / ${match.params.identifier}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Margin className="tabContent" id={id} data-testid={id}>
      <EventList />
      <Identifiers
        title="dataset.events_idn.other_idn"
        identifiers={otherIdentifiers?.map(v => v.notation)}
      />
      <Relations />
      <Identifiers title="dataset.events_idn.origin_identifier" identifiers={originIdentifier} />
      <Versions />
      <DeletedVersions />
    </Margin>
  )
}

Events.propTypes = {
  id: PropTypes.string.isRequired,
}

export default observer(Events)
