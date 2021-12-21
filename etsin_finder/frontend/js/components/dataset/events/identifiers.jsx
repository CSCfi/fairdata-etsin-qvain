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
import { OtherID, Margin } from './common'

const Events = ({ identifiers, title }) => {
  if (!(identifiers?.length > 0)) {
    return null
  }

  return (
    <Margin>
      <h2>
        <Translate content={title} />
      </h2>
      <ul>
        {identifiers.map(identifier => (
          <OtherID key={identifier}>{identifier}</OtherID>
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
