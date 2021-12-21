/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2021 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { useRouteMatch } from 'react-router'

import { useStores } from '../../../stores/stores'
import EventList from './eventList'
import Relations from './relations'
import DeletedVersions from './deletedVersions'
import Identifiers from './identifiers'
import { Margin } from './common'

const Events = props => {
  const { Accessibility, Matomo } = useStores()
  const {
    id,
    dataset: {
      dataset_version_set: datasetVersionSet = [],
      preservation_dataset_origin_version: preservationDatasetOriginVersion = undefined,
      research_dataset: {
        other_identifier: otherIdentifierObjects = [],
        relation = [],
        provenance = [],
      },
    },
  } = props

  const match = useRouteMatch()

  useEffect(() => {
    Accessibility.handleNavigation('events', false)
    Matomo.recordEvent(`EVENTS / ${match.params.identifier}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deletedVersions = datasetVersionSet
    .filter(v => v.removed)
    .map((single, i, set) => ({
      dateRemoved: single.date_removed ? /[^T]*/.exec(single.date_removed.toString()) : '',
      label: set.length - i,
      identifier: single.identifier,
      url: `/dataset/${single.identifier}`,
    }))

  const otherIdentifiers = otherIdentifierObjects.map(v => v.notation)
  const originIdentifier = [preservationDatasetOriginVersion?.preferred_identifier].filter(v => v)

  return (
    <Margin id={id}>
      <EventList provenances={provenance} deletedVersions={deletedVersions} />
      <Identifiers title="dataset.events_idn.other_idn" identifiers={otherIdentifiers} />
      <Relations relation={relation} />
      <Identifiers title="dataset.events_idn.origin_identifier" identifiers={originIdentifier} />
      <DeletedVersions deletedVersions={deletedVersions} />
    </Margin>
  )
}

Events.propTypes = {
  dataset: PropTypes.shape({
    dataset_version_set: PropTypes.array,
    preservation_dataset_origin_version: PropTypes.object,
    research_dataset: PropTypes.shape({
      relation: PropTypes.array,
      provenance: PropTypes.array,
      other_identifier: PropTypes.array,
    }).isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
}

export default observer(Events)
