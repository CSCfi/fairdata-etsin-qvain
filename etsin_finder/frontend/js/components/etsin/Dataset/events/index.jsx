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

import { useStores } from '@/stores/stores'
import EventList from './eventList'
import Relations from './relations'
import DeletedVersions from './deletedVersions'
import Versions from './versions'
import Identifiers from './identifiers'
import { getPreservationInfo, Margin } from './common'
import idnToLink from '@/utils/idnToLink'

const Events = props => {
  const {
    Accessibility,
    Locale,
    Matomo,
    Etsin: {
      EtsinDataset: {
        catalogRecord,
        dataset,
        identifier,
        dateDeprecated,
        datasetVersions = [],
        versionTitles,
      },
    },
  } = useStores()

  const { id } = props

  const {
    preservation_dataset_origin_version: preservationDatasetOriginVersion = undefined,
    preservation_state_modified: preservationStateModified = undefined,
    preservation_dataset_version: preservationDatasetVersion = undefined,
  } = catalogRecord

  const { other_identifier: otherIdentifierObjects = [], relation = [], provenance = [] } = dataset

  const match = useRouteMatch()

  useEffect(() => {
    Accessibility.handleNavigation('events', false)
    Matomo.recordEvent(`EVENTS / ${match.params.identifier}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deletedVersions = datasetVersions
    .filter(v => v.removed)
    .map((single, i, set) => ({
      dateRemoved: single.date_removed ? /[^T]*/.exec(single.date_removed.toString()) : '',
      label: set.length - i,
      identifier: single.identifier,
      url: `/dataset/${single.identifier}`,
    }))

  const currentIndex = datasetVersions.findIndex(version => version.identifier === identifier)

  const findType = i => {
    let type
    if (i > currentIndex) {
      type = 'older'
    } else if (i === 0) {
      type = 'latest'
    } else {
      type = 'newer'
    }

    return type
  }

  const getTitle = single => Locale.getValueTranslation(versionTitles?.[single.identifier])

  const versions = datasetVersions
    .map((single, i, set) => ({
      label: set.length - i,
      identifier: single.identifier,
      preferredIdentifier: single.preferred_identifier,
      url: idnToLink(single.preferred_identifier),
      title: getTitle(single),
      type: findType(i),
      removed: single.removed,
    }))
    .filter(v => !v.removed)
    .filter(v => v.identifier !== identifier)

  const otherIdentifiers = otherIdentifierObjects.map(v => v.notation)
  const originIdentifier = [preservationDatasetOriginVersion?.preferred_identifier].filter(v => v)
  const preservationInfo = getPreservationInfo({
    preservationDatasetOriginVersion,
    preservationStateModified,
    preservationDatasetVersion,
  })

  return (
    <Margin className="tabContent" id={id}>
      <EventList
        provenances={provenance}
        deletedVersions={deletedVersions}
        dateDeprecated={dateDeprecated}
        preservationInfo={preservationInfo}
      />
      <Identifiers title="dataset.events_idn.other_idn" identifiers={otherIdentifiers} />
      <Relations relation={relation} />
      <Identifiers title="dataset.events_idn.origin_identifier" identifiers={originIdentifier} />
      <Versions versions={versions} />
      <DeletedVersions deletedVersions={deletedVersions} />
    </Margin>
  )
}

Events.propTypes = {
  id: PropTypes.string.isRequired,
}

export default observer(Events)
