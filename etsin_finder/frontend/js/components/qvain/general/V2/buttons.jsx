import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { opacify, desaturate } from 'polished'

export const EditButton = props => (
  <Translate
    component={ButtonStyles}
    attributes={{ 'aria-label': 'qvain.general.buttons.edit' }}
    {...props}
  >
    <Translate content="qvain.general.buttons.edit" />
    <FontAwesomeIcon size="lg" icon={faPen} />
  </Translate>
)

export const AddButton = props => (
  <Translate
    component={ButtonStyles}
    type="button"
    attributes={{ 'aria-label': 'qvain.general.buttons.add' }}
    {...props}
  >
    <FontAwesomeIcon size="lg" icon={faPlus} />
    <Translate content="qvain.general.buttons.add" />
  </Translate>
)

export const DeleteButton = props => (
  <Translate
    component={DeleteButtonStyles}
    attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
    {...props}
  >
    <Translate content="qvain.general.buttons.remove" />
    <FontAwesomeIcon size="lg" icon={faTimes} />
  </Translate>
)

export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 5px;
  padding: 16px;
  border-radius: 4px;
  border: solid 1px #cccccc;
  background-color: #fff;
`

export const DeleteButtonStyles = styled(Button)`
  color: black;
  &:hover {
    background-color: rgba(255, 52, 0, 0.1);
    border-color: rgb(173, 35, 0);
    color: #ad2300;
  }
`

export const ButtonStyles = styled(Button)`
  &:not(:disabled):hover {
    background-color: rgba(0, 187, 255, 0.1);
    border-color: rgb(0, 127, 173);
    color: rgb(0, 127, 173);
  }
  :disabled {
    color: ${props => opacify(-0.6, desaturate(0.5, props.theme.color.primary))};
  }
`

// Wrappers and other button components. Mostly copied from V1 as is.
// The reason to copy these instead of importing is to decouple V2 from older version.

export const ButtonContainer = styled.div`
  margin-top: 5rem;
`

export const ListItemButtonContainer = styled(ButtonContainer)`
  display: flex;
  flex-wrap: nowrap;
  justify-content: end;
`

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  border: solid 1px #cccccc;
  border-radius: 4px;
  background-color: #fff;
  margin-bottom: 12px;
  overflow: hidden;

  > ${ButtonContainer} {
    margin-top: 0;
    text-align: right;
  }
`

export const ButtonLabel = styled.span`
  background-color: transparent;
  display: inline-flex;
  padding: 0 8px 0 8px;
  position: relative;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  height: 36px;
  border: none;
  outline: none;
  overflow: hidden;
  vertical-align: middle;
  float: left;
  margin: 14px;
  white-space: nowrap;
`
