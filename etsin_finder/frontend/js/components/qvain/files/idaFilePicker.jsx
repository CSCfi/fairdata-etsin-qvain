import React, { Component } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faChevronRight } from '@fortawesome/free-solid-svg-icons'

class IDAFilePicker extends Component {
  render() {
    return (
      <React.Fragment>
        <p>If you have files in Fairdata IDA you can link them from here:</p>
        <FilePickerButton>
          <FileIcon />
          <FilePickerButtonText>Link files from Fairdata IDA</FilePickerButtonText>
          <ChevronIcon />
        </FilePickerButton>
      </React.Fragment>
    )
  }
}

const FilePickerButton = styled.button`
  background-color: #007fad;
  color: #fff;
  width: 100%;
  height: 47px;
  border-radius: 31.5px;
  border: solid 1px #007fad;
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
  cursor: pointer;
`;

const FilePickerButtonText = styled.span`
  width: 90%;
  text-align: left;
  color: #fff;
  font-weight: 400;
  text-transform: none;
`

const FileIconStyles = styled(FontAwesomeIcon)`
  width: 5%;
  color: #fff;
  margin-left: -4px;
  margin-right: 8px;
  display: inline-block;
  height: 18px;
  font-size: 18px;
  vertical-align: top;
`;

const FileIcon = () => <FileIconStyles icon={faCopy} />

const ChevronIconStyled = styled(FontAwesomeIcon)`
  margin-left: 8px;
  margin-right: -4px;
  width: 5%;
  display: inline-block;
  vertical-align: top;
`

const ChevronIcon = () => <ChevronIconStyled icon={faChevronRight} />

export default IDAFilePicker
