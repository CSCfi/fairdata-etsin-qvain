import React from 'react'
import styled from 'styled-components'
import { opacify, desaturate } from 'polished'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPen,
  faTimes,
  faCopy,
  faLink,
  faChevronRight,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons'

const FileIconStyles = styled(FontAwesomeIcon)`
  width: 5%;
  color: inherit;
  margin-left: -4px;
  margin-right: 8px;
  display: inline-block;
  height: 18px;
  font-size: 18px;
  vertical-align: top;
`

export const FileIcon = () => <FileIconStyles icon={faCopy} />

export const LinkIcon = () => <FileIconStyles icon={faLink} />

const ChevronIconStyled = styled(FontAwesomeIcon)`
  margin-left: 8px;
  margin-right: -4px;
  width: 5%;
  display: inline-block;
  vertical-align: top;
`

export const ChevronRight = () => <ChevronIconStyled icon={faChevronRight} />

export const ChevronDown = () => <ChevronIconStyled icon={faChevronDown} />

const EditButtonStyles = styled.button`
  background-color: #fff;
  width: 60px;
  height: 56px;
  border: none;
  text-align: center;
  color: ${props => `${props.theme.color.primary}`};
  display: inline-block;
  margin: 5px 5px 5px 5px;
  border-radius: 4px;
  border: solid 1px #cccccc;
  &:not(:disabled):hover {
    background-color: rgba(0, 187, 255, 0.1);
    border-color: rgb(0, 127, 173);
  }
  :disabled {
    color: ${props => opacify(-0.6, desaturate(0.5, props.theme.color.primary))};
  }
`

export const EditButton = props => (
  <EditButtonStyles {...props}>
    <FontAwesomeIcon size="lg" icon={faPen} />
  </EditButtonStyles>
)

const DeleteButtonStyles = styled.button`
  background-color: #fff;
  width: 60px;
  height: 56px;
  border: none;
  text-align: center;
  color: #ad2300;
  display: inline-block;
  margin: 5px 5px 5px 5px;
  border-radius: 4px;
  border: solid 1px #cccccc;
  &:hover {
    background-color: rgba(255, 52, 0, 0.1);
    border-color: rgb(173, 35, 0);
  }
`

export const DeleteButton = props => (
  <DeleteButtonStyles {...props}>
    <FontAwesomeIcon size="lg" icon={faTimes} />
  </DeleteButtonStyles>
)
