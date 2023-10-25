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
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import { Table, ID, IDLink, Margin } from './common'
import { useStores } from '@/stores/stores'

const relationIdentifierIsUrl = identifier =>
  identifier.startsWith('http://') || identifier.startsWith('https://')

const Relations = props => {
  const {
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()

  const { relation } = props

  if (!(relation?.length > 0)) {
    return null
  }

  return (
    <Margin>
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
          {relation.map(single => (
            <tr key={single.entity.identifier || ''}>
              <td lang={getPreferredLang(single.relation_type.pref_label)}>
                {getValueTranslation(single.relation_type.pref_label)}
              </td>
              <td lang={getPreferredLang(single.entity.title)}>
                {getValueTranslation(single.entity.title)}
              </td>
              <td>
                <span className="sr-only">Identifier:</span>
                {relationIdentifierIsUrl(single.entity.identifier || '') ? (
                  <IDLink
                    href={single.entity.identifier || ''}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {single.entity.identifier || ''}
                  </IDLink>
                ) : (
                  <ID>{single.entity.identifier || ''}</ID>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Margin>
  )
}

Relations.defaultProps = {
  relation: [],
}

Relations.propTypes = {
  relation: PropTypes.array,
}

export default observer(Relations)
