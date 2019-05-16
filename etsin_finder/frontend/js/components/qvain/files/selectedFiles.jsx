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
import { getDirectories, getFiles } from '../utils/fileHierarchy'

export class SelectedFilesBase extends Component {
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
    const {
      toggleSelectedFile,
      toggleSelectedDirectory,
      hierarchy,
      inEdit
    } = this.props.Stores.Qvain
    const dirs = getDirectories(hierarchy)
    const files = getFiles(hierarchy)
    const selected = dirs.filter(d => d.selected).concat(files.filter(f => f.selected))
    return (
      <Fragment>
        <Translate component={SelectedFilesTitle} content="qvain.files.selected.title" />
        {selected.length === 0 && <p>No files or directories selected</p>}
        {selected.map(s => (
          <Fragment key={`${s.id}-${s.identifier}`}>
            <FileItem active={isInEdit(inEdit, s.identifier)}>
              <ButtonLabel>
                <FontAwesomeIcon icon={(s.directoryName ? faFolder : faCopy)} style={{ marginRight: '8px' }} />
                {s.projectIdentifier} / {s.directoryName || getTitle(s.fileCharacteristics)}
              </ButtonLabel>
              <EditButton onClick={this.handleEdit(s)} />
              <DeleteButton
                onClick={(event) => {
                  event.preventDefault()
                  if (s.directoryName !== undefined) {
                    toggleSelectedDirectory(s, false)
                  } else {
                    toggleSelectedFile(s, false)
                  }
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

const isDirectory = (inEdit) => inEdit.directoryName !== undefined

const getTitle = (fileCharacteristics) => (fileCharacteristics !== undefined ? fileCharacteristics.title : '')

// Components

const SelectedFilesTitle = styled.label`
  display: block;
  font-weight: 600;
  color: #4f4f4f;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export const FileItem = styled(ButtonGroup)`
  ${props => (props.active ? `
    border-bottom: none;
    box-shadow: none;
    margin-bottom: 0px;
  ` : '')}
`;

export default inject('Stores')(observer(SelectedFilesBase))
