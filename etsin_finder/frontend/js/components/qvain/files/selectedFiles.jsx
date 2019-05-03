import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faFolder } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'
import { ButtonGroup, ButtonLabel, EditButton, DeleteButton } from '../general/buttons'
import FileForm from './fileForm'
import DirectoryForm from './directoryForm'

class SelectedFiles extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleEdit = (selected) => (event) => {
    const { inEdit } = this.props.Stores.Qvain
    event.preventDefault()
    if (isInEdit(inEdit, selected.identifier)) {
      this.props.Stores.Qvain.setInEdit(undefined)
    } else {
      this.props.Stores.Qvain.setInEdit(selected)
    }
  }

  render() {
    const { selectedFiles, selectedDirectories, toggleSelected, inEdit } = this.props.Stores.Qvain
    const selected = selectedFiles.concat(selectedDirectories)
    const grouped = groupBy('parent_directory.id')(selectedFiles)
    return (
      <Fragment>
        <Translate component={SelectedFilesTitle} content="qvain.files.selected.title" />
        {selected.length === 0 && <p>No files or directories selected</p>}
        {selected.map(s => (
          <Fragment key={`${s.id}-${s.identifier}`}>
            <FileItem active={isInEdit(inEdit, s.identifier)}>
              <ButtonLabel>
                <FontAwesomeIcon icon={(s.directory_name ? faFolder : faCopy)} style={{ marginRight: '8px' }} />
                {s.project_identifier} / {s.directory_name || getTitle(s.file_characteristics)}
              </ButtonLabel>
              <EditButton onClick={this.handleEdit(s)} />
              <DeleteButton
                onClick={(event) => {
                  event.preventDefault()
                  toggleSelected(s)
                }}
              />
            </FileItem>
            {isInEdit(inEdit, s.identifier) && (
              <Fragment>
                {isDirectory(inEdit) && (<DirectoryForm />)}
                {!isDirectory(inEdit) && (<FileForm />)}
              </Fragment>
            )}
          </Fragment>
        ))}
      </Fragment>
    )
  }
}

const isInEdit = (inEdit, identifier) => (inEdit !== undefined) && inEdit.identifier === identifier

const isDirectory = (inEdit) => inEdit.directory_name !== undefined

const getTitle = (fileCharacteristics) => (fileCharacteristics !== undefined ? fileCharacteristics.title : '')

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const keys = key.split('.')
    let value = obj
    keys.forEach(_key => {
      value = value[_key]
    })
    // const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

// Components

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
