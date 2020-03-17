import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faFolder } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'
import styled, { css } from 'styled-components';

import Label from '../../general/label'
import { ButtonLabel, EditButton, DeleteButton, FileItem, ButtonContainer, TableButton } from '../../general/buttons'
import { SelectedFilesTitle } from '../../general/form'
import FileForm from './fileForm'
import DirectoryForm from './directoryForm'
import { randomStr } from '../../utils/fileHierarchy'
import Modal from '../../../general/modal'
import { CumulativeStates } from '../../utils/constants'
import RefreshDirectoryModal from '../refreshDirectoryModal';
import FixDeprecatedModal from '../fixDeprecatedModal';


export class SelectedFilesBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    datasetDuplicationModalHasNotBeenShown: true,
    refreshModalDirectory: null
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

  closeDatasetDuplicationInformationModal = () => {
    // Set to false permanently, since the warning only needs to be shown once, not every time a new file is added.
    this.setState({
      datasetDuplicationModalHasNotBeenShown: false,
    })
  }

  setRefreshModalDirectory = (directory) => {
    this.setState({
      refreshModalDirectory: directory,
    })
  }

  renderFiles = (selected, inEdit, existing, removable) => {
    const {
      toggleSelectedFile,
      toggleSelectedDirectory,
      cumulativeState,
      canSelectFiles,
      deprecated
    } = this.props.Stores.Qvain
    const isCumulative = cumulativeState === CumulativeStates.YES
    return (
      selected.map(s => (
        <Fragment key={`${s.id}-${randomStr()}`}>
          <SelectedFilesItem tabIndex="0" active={isInEdit(inEdit, s.identifier)}>
            <FileLabel>
              <FontAwesomeIcon icon={(s.directoryName ? faFolder : faCopy)} style={{ marginRight: '8px' }} />
              {s.projectIdentifier} / {s.directoryName || s.fileName}
            </FileLabel>
            {s.removed && <Translate component={DeletedLabel} content="qvain.files.deletedLabel" color="error" />}
            <FileButtonsContainer>
              {s.directoryName && existing && isCumulative && canSelectFiles && !deprecated && (
                <RefreshDirectoryButton
                  type="button"
                  disabled={this.state.refreshLoading}
                  onClick={() => this.setRefreshModalDirectory(s.identifier)}
                >
                  <Translate component={RefreshDirectoryButtonText} content="qvain.files.refreshModal.buttons.show" />
                </RefreshDirectoryButton>
              )}
              {!s.removed && <EditButton aria-label="Edit" onClick={this.handleEdit(s)} />}
              {removable && (
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
              )}
            </FileButtonsContainer>
          </SelectedFilesItem>
          {isInEdit(inEdit, s.identifier, existing) && (
            <Fragment>
              {isDirectory(inEdit) && (<DirectoryForm />)}
              {!isDirectory(inEdit) && (<FileForm />)}
            </Fragment>
          )}
        </Fragment>
      ))
    )
  }

  render() {
    const {
      selectedFiles,
      selectedDirectories,
      existingFiles,
      existingDirectories,
      inEdit,
      cumulativeState,
      isPas,
      canSelectFiles,
      readonly
    } = this.props.Stores.Qvain
    const selected = [...selectedDirectories, ...selectedFiles]
    const existing = [...existingDirectories, ...existingFiles]
    const isCumulative = cumulativeState === CumulativeStates.YES
    let existingHelpKey
    if (isPas) {
      existingHelpKey = readonly ? 'pasReadonly' : 'pasEditable'
    } else {
      existingHelpKey = isCumulative ? 'cumulative' : 'noncumulative'
    }

    return (
      <Fragment>
        {canSelectFiles && (
          <>
            <Translate tabIndex="0" component={SelectedFilesTitle} content="qvain.files.selected.title" />
            {selected.length === 0 && <Translate tabIndex="0" component="p" content="qvain.files.selected.none" />}
            {this.renderFiles(selected, inEdit, false, true)}
          </>
        )}
        <Translate tabIndex="0" component={SelectedFilesTitle} content="qvain.files.existing.title" />
        <Translate tabIndex="0" content={`qvain.files.existing.help.${existingHelpKey}`} />
        {this.renderFiles(existing, inEdit, true, canSelectFiles && !isCumulative)}
        <Modal
          // Inform the user that a new dataset will be created, if both existing and selected files are present.
          isOpen={(selected.length) > 0 && (existing.length > 0) && (this.state.datasetDuplicationModalHasNotBeenShown === true) && !isCumulative}
          onRequestClose={this.closeDatasetDuplicationInformationModal}
          contentLabel="notificationNewDatasetWillBeCreatedModal"
        >
          <Translate component="h3" content="qvain.files.notificationNewDatasetWillBeCreated.header" />
          <Translate component="p" content="qvain.files.notificationNewDatasetWillBeCreated.content" />
          <TableButton onClick={this.closeDatasetDuplicationInformationModal}>Ok.</TableButton>
        </Modal>

        <RefreshDirectoryModal
          directory={this.state.refreshModalDirectory}
          onClose={() => this.setRefreshModalDirectory(null)}
        />

        <FixDeprecatedModal />
      </Fragment>
    )
  }
}

const isInEdit = (inEdit, identifier, existing) => (
  (inEdit !== undefined) && inEdit.identifier === identifier && (existing === inEdit.existing)
)

const SelectedFilesItem = styled(FileItem)`{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 8px;
}`

const FileButtonsContainer = styled(ButtonContainer)`{
  display: flex;
  align-items: center;
  margin-left: auto;
}`

export const FileLabel = styled(ButtonLabel)`{
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 0;
  flex-shrink: 0;
}`

const RefreshDirectoryButton = styled.button`
  background-color: ${props => (
    props.disabled ? '#7fbfd6' : '#007fad'
  )};
  color: #fff;
  height: 56px;
  border-radius: 4px;
  border: solid 1px ${props => (
    props.disabled ? '#7fbfd6' : '#007fad'
  )};
  text-transform: none;
  font-weight: 600;
  margin-right: 5px;
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
  ${props => !props.disabled && css`
    cursor: pointer;
  `}
`

const RefreshDirectoryButtonText = styled.span`
  text-align: center;
  color: inherit;
  font-weight: 400;
  text-transform: none;
`

const isDirectory = (inEdit) => inEdit.directoryName !== undefined

const DeletedLabel = styled(Label)`
  margin-left: 10px;
  text-transform: uppercase;
`;


export default inject('Stores')(observer(SelectedFilesBase))
