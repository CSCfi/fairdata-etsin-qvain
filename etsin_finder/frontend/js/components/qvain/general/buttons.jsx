import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons'

export const CancelButton = styled.button`
  width: 84px;
  height: 38px;
  border-radius: 4px;
  border: solid 1px #4f4f4f;
  font-size: 16px;
  font-weight: 600px;
  line-height: 1.31;
  color: #4f4f4f;
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
`

export const ButtonGroup = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  border: solid 1px #eceeef;
  background-color: #fff;
  margin-bottom: 12px;
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
