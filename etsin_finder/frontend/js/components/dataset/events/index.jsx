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
import Versions from './versions'
import Identifiers from './identifiers'
import { Margin } from './common'
import idnToLink from '../../../utils/idnToLink'

const Events = props => {
  const { Accessibility, Locale, Matomo } = useStores()
  const {
    id,
    dataset: {
      identifier,
      date_deprecated: dateDeprecated,
      dataset_version_set: datasetVersionSet = [],
      preservation_dataset_origin_version: preservationDatasetOriginVersion = undefined,
      research_dataset: {
        other_identifier: otherIdentifierObjects = [],
        relation = [],
        provenance = [],
      },
    },
    versionTitles,
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

  const currentIndex = datasetVersionSet.findIndex(version => version.identifier === identifier)

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

  const versions = datasetVersionSet
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

  return (
    <Margin id={id}>
      <EventList
        provenances={provenance}
        deletedVersions={deletedVersions}
        dateDeprecated={dateDeprecated}
      />
      <Identifiers title="dataset.events_idn.other_idn" identifiers={otherIdentifiers} />
      <Relations relation={relation} />
      <Identifiers title="dataset.events_idn.origin_identifier" identifiers={originIdentifier} />
      <Versions versions={versions} />
      <DeletedVersions deletedVersions={deletedVersions} />
    </Margin>
  )
}

Events.defaultProps = {
  versionTitles: undefined,
}

Events.propTypes = {
  dataset: PropTypes.shape({
    identifier: PropTypes.string,
    date_deprecated: PropTypes.string,
    dataset_version_set: PropTypes.array,
    preservation_dataset_origin_version: PropTypes.object,
    research_dataset: PropTypes.shape({
      relation: PropTypes.array,
      provenance: PropTypes.array,
      other_identifier: PropTypes.array,
      title: PropTypes.object,
    }).isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  versionTitles: PropTypes.object,
}

export default observer(Events)
