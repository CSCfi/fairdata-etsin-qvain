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

import idnToLink from '@/utils/idnToLink'

import { OtherID, Margin } from './common'

const Events = ({ identifiers, title }) => {
  if (!(identifiers?.length > 0)) {
    return null
  }

  const links = identifiers.map(identifier => ({
    url: idnToLink(identifier),
    identifier,
  }))

  return (
    <Margin>
      <h2>
        <Translate content={title} />
      </h2>
      <ul>
        {links.map(link => (
          <OtherID key={link.identifier}>
            {link.url && <a href={link.url}>{link.identifier}</a>}
            {!link.url && link.identifier}
          </OtherID>
        ))}
      </ul>
    </Margin>
  )
}

Events.defaultProps = {
  identifiers: [],
}

Events.propTypes = {
  title: PropTypes.string.isRequired,
  identifiers: PropTypes.arrayOf(PropTypes.string),
}

export default observer(Events)
