import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

export const IconStyles = styled(FontAwesomeIcon)`
    color: ${props => props.theme.color.primary};
  :hover {
    color: #004d79;
  }
`

export const NoStyleButton = styled.button`
  border: none;
  background-color: unset;
`

export const MinusIcon = props => (
  <NoStyleButton {...props} type="button">
    <IconStyles icon={faMinus} />
  </NoStyleButton>
)

export const PlusIcon = props => (
  <NoStyleButton {...props} type="button">
    <IconStyles icon={faPlus} />
  </NoStyleButton>
  )
