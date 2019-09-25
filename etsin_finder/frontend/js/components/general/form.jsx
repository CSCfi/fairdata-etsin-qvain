{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

/**
 * This file contains functionality copied from qvain/general/form.jsx
 *
 * This is, until further notice, done to keep Etsin and Qvain Light separate, as two modules in the same app.
 */

import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export const HelpIconStyles = styled(FontAwesomeIcon)`
  :hover {
    color: ${props => props.theme.color.primary};
  }
`

export const NoStyleButton = styled.button`
  border: none;
  background-color: unset;
`

export const HelpIcon = props => (
  <NoStyleButton {...props} type="button">
    <HelpIconStyles icon={faInfoCircle} />
  </NoStyleButton>
)
