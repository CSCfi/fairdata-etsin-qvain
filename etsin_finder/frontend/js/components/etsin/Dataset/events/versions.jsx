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

const Versions = props => {
  const { versions } = props

  if (!(versions?.length > 0)) {
    return null
  }

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

Versions.defaultProps = {
  versions: [],
}

Versions.propTypes = {
  versions: PropTypes.array,
}

export default observer(Versions)
