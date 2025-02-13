/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2021 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
import React, { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import etsinTheme from '@/styles/theme'
import { useStores } from '@/stores/stores'

import Modal from '@/components/general/modal'
import { TransparentLink } from '@/components/general/button'

import { Table, ID, IDLink, Margin } from './common'

const relationIdentifierIsUrl = identifier =>
  identifier.startsWith('http://') || identifier.startsWith('https://')

const Relations = () => {
  const {
    Locale: { lang },
    Etsin: {
      EtsinDataset: { datasetRelations },
    },
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()

  const [modalOpen, setModal] = useState(false)
  const [focusEntity, setEntity] = useState(null)

  const openModal = entity => {
    setEntity(entity)
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
    setEntity(null)
  }

  if (!(datasetRelations?.length > 0)) {
    return null
  }

  return (
    <Margin>
      <Modal
        key={getValueTranslation(focusEntity?.title)}
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Relation Description"
      >
        <RelationTitle>{getValueTranslation(focusEntity?.title)}</RelationTitle>
        {getValueTranslation(focusEntity?.description)}
      </Modal>

      <h2>
        <Translate content="dataset.events_idn.relations.title" />
      </h2>
      <Table>
        <thead>
          <tr>
            <th>
              <Translate content="dataset.events_idn.relations.type" />
            </th>
            <th>
              <Translate content="dataset.events_idn.relations.name" />
            </th>
            <th>
              <Translate content="dataset.events_idn.relations.idn" />
            </th>
          </tr>
        </thead>
        <tbody>
          {datasetRelations.map(single => (
            <tr key={single.entity.entity_identifier || ''}>
              {/* Type */}
              <td lang={getPreferredLang(single.relation_type.pref_label)}>
                {getValueTranslation(single.relation_type.pref_label)}
                {single.entity?.type && ` (${getValueTranslation(single.entity.type.pref_label)})`}
              </td>
              {/* Title and Description */}
              <td lang={getPreferredLang(single.entity.title)}>
                {getValueTranslation(single.entity.title)}
                {single.entity.description && (
                  <>
                    <br />
                    <InlineTransparentLink
                      noMargin
                      noPadding
                      href="#0"
                      onClick={modalOpen ? closeModal : () => openModal(single.entity)}
                      lang={lang}
                    >
                      <Translate
                        component="span"
                        content="dataset.events_idn.relations.description"
                      />
                    </InlineTransparentLink>
                  </>
                )}
              </td>
              {/* Identifier */}
              <td>
                <span className="sr-only">Identifier:</span>
                {relationIdentifierIsUrl(single.entity.entity_identifier || '') ? (
                  <IDLink
                    href={single.entity.entity_identifier || ''}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {single.entity.entity_identifier || ''}
                  </IDLink>
                ) : (
                  <ID>{single.entity.entity_identifier || ''}</ID>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Margin>
  )
}

const RelationTitle = styled.h3`
  margin-right: 1rem;
`

const InlineTransparentLink = styled(TransparentLink)`
  display: inline;
  color: ${etsinTheme.color.linkColorUIV2};
`

export default observer(Relations)
