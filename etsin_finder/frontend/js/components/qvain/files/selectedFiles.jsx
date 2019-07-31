import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faFolder } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'
import { ButtonLabel, EditButton, DeleteButton, FileItem, ButtonContainer } from '../general/buttons'
import { SelectedFilesTitle } from '../general/form'
import FileForm from './fileForm'
import DirectoryForm from './directoryForm'
import { randomStr } from '../utils/fileHierarchy'

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

  renderFiles = (selected, inEdit, existing) => {
    const {
      toggleSelectedFile,
      toggleSelectedDirectory
    } = this.props.Stores.Qvain
    return (
      <Fragment>
        {selected.map(s => (
          <Fragment key={`${s.id}-${randomStr()}`}>
            <FileItem tabIndex="0" active={isInEdit(inEdit, s.identifier)}>
              <ButtonLabel>
                <FontAwesomeIcon icon={(s.directoryName ? faFolder : faCopy)} style={{ marginRight: '8px' }} />
                {s.projectIdentifier} / {s.directoryName || s.fileName}
              </ButtonLabel>
              <ButtonContainer>
                <EditButton aria-label="Edit" onClick={this.handleEdit(s)} />
                <DeleteButton
                  aria-label="Remove"
                  onClick={(event) => {
                    event.preventDefault()
                    if (s.directoryName !== undefined) {
                      toggleSelectedDirectory(s, false)
                    } else {
                      toggleSelectedFile(s, false)
                    }
                  }}
                />
              </ButtonContainer>
            </FileItem>
            {isInEdit(inEdit, s.identifier, existing) && (
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

  render() {
    const {
      selectedFiles,
      selectedDirectories,
      existingFiles,
      existingDirectories,
      inEdit
    } = this.props.Stores.Qvain
    const selected = [...selectedDirectories, ...selectedFiles]
    const existing = [...existingDirectories, ...existingFiles]
    return (
      <Fragment>
        <Translate tabIndex="0" component={SelectedFilesTitle} content="qvain.files.selected.title" />
        {selected.length === 0 && <Translate tabIndex="0" component="p" content="qvain.files.selected.none" />}
        {this.renderFiles(selected, inEdit, false)}
        <Translate tabIndex="0" component={SelectedFilesTitle} content="qvain.files.existing.title" />
        <Translate tabIndex="0" component="p" content="qvain.files.existing.help" />
        {this.renderFiles(existing, inEdit, true)}
      </Fragment>
    )
  }
}

const isInEdit = (inEdit, identifier, existing) => (
  (inEdit !== undefined) && inEdit.identifier === identifier && (existing === inEdit.existing)
)

const isDirectory = (inEdit) => inEdit.directoryName !== undefined

export default inject('Stores')(observer(SelectedFilesBase))
