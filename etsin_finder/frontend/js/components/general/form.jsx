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

import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import withCustomProps from '@/utils/withCustomProps'

export const HelpIconStyles = styled(FontAwesomeIcon)`
  &:hover {
    color: ${props => props.theme.color.primary};
  }
`

export const NoStyleButton = withCustomProps(styled.button)`
  border: none;
  background-color: unset;
  padding-left: 0;
`

export const HelpIcon = props => (
  <NoStyleButton {...props} type="button">
    <HelpIconStyles icon={faInfoCircle} />
  </NoStyleButton>
)
