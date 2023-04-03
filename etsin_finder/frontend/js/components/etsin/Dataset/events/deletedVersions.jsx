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

import { Table, IDLink, Margin } from './common'

const DeletedVersions = props => {
  const { deletedVersions } = props

  if (!(deletedVersions?.length > 0)) {
    return null
  }

  return (
    <Margin>
      <h2>
        <Translate content="dataset.events_idn.deleted_versions.title" />
      </h2>
      <Table>
        <thead>
          <tr>
            <th>
              <Translate content="dataset.events_idn.deleted_versions.version" />
            </th>
            <th>
              <Translate content="dataset.events_idn.deleted_versions.date" />
            </th>
            <th>
              <Translate content="dataset.events_idn.deleted_versions.link_to_dataset" />
            </th>
          </tr>
        </thead>
        <tbody>
          {deletedVersions.map(single => (
            <tr key={single.identifier}>
              <td lang={single.label}>{single.label}</td>
              <td lang={single.dateRemoved}>{single.dateRemoved}</td>
              <td>
                {
                  <IDLink href={single.url} rel="noopener noreferrer" target="_blank">
                    {single.url}
                  </IDLink>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Margin>
  )
}

DeletedVersions.defaultProps = {
  deletedVersions: [],
}

DeletedVersions.propTypes = {
  deletedVersions: PropTypes.array,
}

export default observer(DeletedVersions)
