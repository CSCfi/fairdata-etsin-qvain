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
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import idnToLink from '@/utils/idnToLink'
import { useStores } from '@/stores/stores'

import { Table, ID, IDLink, Margin } from './common'

const Versions = () => {
  const {
    Locale,
    Etsin: {
      EtsinDataset: { identifier, datasetVersions, hasExistingVersion },
    },
  } = useStores()

  if (!hasExistingVersion) {
    return null
  }

  const currentIndex = datasetVersions.findIndex(version => version.id === identifier)

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

  const versions = datasetVersions
    .map((single, i) => ({
      label: single.version,
      identifier: single.id,
      preferredIdentifier: single.persistent_identifier,
      url: idnToLink(single.persistent_identifier),
      title: Locale.getValueTranslation(single.title),
      type: findType(i),
      removed: single.removed,
    }))
    .filter(v => !v.removed)
    .filter(v => v.identifier !== identifier)

  return (
    <Margin>
      <h2>
        <Translate content="dataset.events_idn.versions.title" />
      </h2>
      <Table>
        <thead>
          <tr>
            <th>
              <Translate content="dataset.events_idn.versions.type" />
            </th>
            <th>
              <Translate content="dataset.events_idn.versions.number" />
            </th>
            <th>
              <Translate content="dataset.events_idn.versions.name" />
            </th>
            <th>
              <Translate content="dataset.events_idn.versions.idn" />
            </th>
          </tr>
        </thead>
        <tbody>
          {versions.map(single => (
            <tr key={single.identifier || ''}>
              <Translate
                component="td"
                content={`dataset.events_idn.versions.types.${single.type}`}
              />
              <td lang={single.label}>{single.label}</td>
              <td lang={single.title}>{single.title}</td>
              <td>
                {single.url ? (
                  <IDLink href={single.url} rel="noopener noreferrer" target="_blank">
                    {single.url}
                  </IDLink>
                ) : (
                  <ID>{single.preferredIdentifier}</ID>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Margin>
  )
}

export default observer(Versions)
