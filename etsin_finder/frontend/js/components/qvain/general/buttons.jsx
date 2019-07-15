import React from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPen,
  faTimes,
  faCopy,
  faLink,
  faChevronRight,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'

export const CancelButton = styled.button`
  width: 84px;
  height: 42px;
  border-radius: 4px;
  border: solid 1px #4f4f4f;
  font-size: 16px;
  font-weight: 600px;
  line-height: 1.31;
  color: #4f4f4f;
  &:hover {
    background-color: #ccc;
  }
`;

export const SaveButton = styled.button`
  border-radius: 4px;
  border: solid 1px #49a24a;
  background-color: #49a24a;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.31;
  color: #fff;
  margin-left: 20px;
  padding: 10px 25px;
  &:hover {
    background-color: #3a813b;
  }
`

export const DangerButton = styled.button`
  border-radius: 4px;
  border: solid 1px #ff0000;
  background-color: #ff0000;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.31;
  color: #fff;
  margin-left: 20px;
  padding: 10px 25px;
  &:hover {
    background-color: #ff4c4c;
  }
`

export const RemoveButton = styled.button`
  width: 84px;
  height: 42px;
  border-radius: 4px;
  border: solid 1px #cc0000;
  font-size: 16px;
  font-weight: 600px;
  line-height: 1.31;
  color: #cc0000;
  &:hover {
    background-color: #ffb2b2;
    border: solid 2px #cc0000;
  }
`;

export const ButtonGroup = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  border: solid 1px #eceeef;
  background-color: #fff;
  margin-bottom: 12px;
  overflow: overlay;
`;

export const FileItem = styled(ButtonGroup)`
  ${props => (props.active ? `
    border-bottom: none;
    box-shadow: none;
    margin-bottom: 0px;
  ` : '')}
`;

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
`;

export const EditButtonStyles = styled.button`
  background-color: rgba(0,187,255, 0.1);
  width: 60px;
  height: 56px;
  border: none;
  text-align: center;
  color: #007fad;
`;

export const EditButton = (props) => (
  <EditButtonStyles {...props}>
    <FontAwesomeIcon size="lg" icon={faPen} />
  </EditButtonStyles>
)

export const DeleteButtonStyles = styled.button`
  background-color: rgba(255, 52, 0, 0.1);
  width: 60px;
  height: 56px;
  border: none;
  text-align: center;
  color: #ad2300;
`;

export const DeleteButton = (props) => (
  <DeleteButtonStyles {...props}>
    <FontAwesomeIcon size="lg" icon={faTimes} />
  </DeleteButtonStyles>
)

export const FilePickerButton = styled.button`
  background-color: ${props => (
    props.disabled ? '#7fbfd6' : '#007fad'
  )};
  color: #fff;
  width: 100%;
  height: 47px;
  border-radius: 31.5px;
  border: solid 1px ${props => (
    props.disabled ? '#7fbfd6' : '#007fad'
  )};
  text-transform: none;
  font-weight: 600;
  padding-left: 27px;
  padding-right: 27px;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  outline: none;
  -webkit-appearance: none;
  overflow: hidden;
  vertical-align: middle;
  ${props => !props.disabled && css`
    cursor: pointer;
  `}
`;

export const FilePickerButtonInverse = styled(FilePickerButton)`
  color: ${props => (
    props.disabled ? '#7fbfd6' : '#007fad'
  )};
  background-color: #fff;
`;

export const FilePickerButtonText = styled.span`
  width: 90%;
  text-align: left;
  color: inherit;
  font-weight: 400;
  text-transform: none;
`

const FileIconStyles = styled(FontAwesomeIcon)`
  width: 5%;
  color: inherit;
  margin-left: -4px;
  margin-right: 8px;
  display: inline-block;
  height: 18px;
  font-size: 18px;
  vertical-align: top;
`;

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
