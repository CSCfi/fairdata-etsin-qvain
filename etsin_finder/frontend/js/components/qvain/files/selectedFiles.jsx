import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'
import { ButtonGroup, ButtonLabel, EditButton, DeleteButton } from '../general/buttons'
import FileForm from './fileForm'

class SelectedFiles extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleEdit = (file) => (event) => {
    const { fileInEdit } = this.props.Stores.Qvain
    event.preventDefault()
    if (fileInEdit !== undefined && file.id === fileInEdit.id) {
      this.props.Stores.Qvain.setInEdit(undefined)
    } else {
      this.props.Stores.Qvain.setInEdit(file)
    }
  }

  render() {
    console.log('render')
    const { selectedFiles, removeSelectedFile, fileInEdit } = this.props.Stores.Qvain
    return (
      <div>
        <Translate component={SelectedFilesTitle} content="qvain.files.selected.title" />
        {selectedFiles.length === 0 && <p>No files selected</p>}
        {selectedFiles.map(file => (
          <Fragment key={file.id}>
            <FileItem active={fileInEdit !== undefined && fileInEdit.id === file.id}>
              <ButtonLabel>
                <FontAwesomeIcon icon={faCopy} style={{ marginRight: '8px' }} />
                {file.project_identifier} / {file.file_characteristics.title}
              </ButtonLabel>
              <EditButton onClick={this.handleEdit(file)} />
              <DeleteButton
                onClick={(event) => {
                  event.preventDefault()
                  removeSelectedFile(file.id)
                }}
              />
            </FileItem>
            {fileInEdit !== undefined &&
              <FileForm />
            }
          </Fragment>
        ))}
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
  ${props => (props.active ? `
    border-bottom: none;
    box-shadow: none;
    margin-bottom: 0px;
  ` : '')}
`;

export default inject('Stores')(observer(SelectedFiles))
