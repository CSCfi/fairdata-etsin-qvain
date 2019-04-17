import React, { Component } from 'react';
import styled from 'styled-components';
import Translate from 'react-translate-component'
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
        <Translate component={SelectedFilesTitle} content="qvain.files.selected.title" />
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
            <Translate
              component={Label}
              content="qvain.files.selected.form.title.label"
            />
            <Translate
              component={Input}
              attributes={{ placeholder: 'qvain.files.selected.form.title.placeholder' }}
            />
            <Translate
              component={Label}
              content="qvain.files.selected.form.description.label"
            />
            <Translate
              component={Textarea}
              attributes={{ placeholder: 'qvain.files.selected.form.description.placeholder' }}
            />
            <Translate
              component={Label}
              content="qvain.files.selected.form.use.label"
            />
            <Translate
              component={CustomSelect}
              attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
            />
            <Translate
              component={Label}
              content="qvain.files.selected.form.fileType.label"
            />
            <Translate
              component={CustomSelect}
              attributes={{ placeholder: 'qvain.files.selected.form.fileType.placeholder' }}
            />
            <Translate
              component={Label}
              style={{ textTransform: 'uppercase' }}
              content="qvain.files.selected.form.identifier.label"
            />
            <p>123476543234567876</p>
            <Translate component={CancelButton} content="qvain.common.cancel" />
            <Translate component={SaveButton} content="qvain.common.save" />
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
