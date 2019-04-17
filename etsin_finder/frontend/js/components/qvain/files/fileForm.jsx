import React, { Component } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import {
  ButtonGroup,
  ButtonLabel,
  EditButton,
  DeleteButton,
  SaveButton,
  CancelButton
} from '../general/buttons'
import { Label, Input, Textarea, CustomSelect } from '../general/form'
import { Container } from '../general/card'

class FileForm extends Component {
  render() {
    return (
      <div>
        <SelectedFilesTitle>Selected Files</SelectedFilesTitle>
        <FileItem>
          <ButtonLabel>
            <FontAwesomeIcon icon={faCopy} style={{ marginRight: '8px' }} />
            Project 1 / Title 1
          </ButtonLabel>
          <EditButton />
          <DeleteButton />
        </FileItem>
        <FileContainer>
          <div className="file-form">
            <Label>Title</Label>
            <Input type="text" />
            <Label>Description</Label>
            <Textarea placeholder="Description" />
            <Label>Use category</Label>
            <CustomSelect placeholder="Select option" />
            <Label>File type</Label>
            <CustomSelect placeholder="Select option" />
            <Label style={{ textTransform: 'uppercase' }}>Identifier</Label>
            <p>123476543234567876</p>
            <CancelButton>Cancel</CancelButton>
            <SaveButton>Save</SaveButton>
          </div>
        </FileContainer>
      </div>
    )
  }
}

const SelectedFilesTitle = styled.label`
  display: block;
  font-weight: 600;
  color: #4f4f4f;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const FileItem = styled(ButtonGroup)`
  border-bottom: none;
  box-shadow: none;
  margin-bottom: 0px;
`;

const FileContainer = styled(Container)`
  padding: 35px 24px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  margin-bottom: 69px;
  margin-top: 0px;
`;

export default FileForm
