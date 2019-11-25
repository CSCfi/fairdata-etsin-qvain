import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faFolder } from '@fortawesome/free-solid-svg-icons'
import Translate from 'react-translate-component'
import axios from 'axios'

import { ButtonLabel, EditButton, DangerButton, DeleteButton, FileItem, ButtonContainer, TableButton,
  RefreshDirectoryButton, RefreshDirectoryButtonText } from '../general/buttons'
import { SelectedFilesTitle } from '../general/form'
import FileForm from './fileForm'
import DirectoryForm from './directoryForm'
import { randomStr } from '../utils/fileHierarchy'
import Modal from '../../general/modal'
import { CumulativeStates } from '../utils/constants'
import Response from './response';

export class SelectedFilesBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    datasetDuplicationModalHasNotBeenShown: true,
    refreshResponse: null,
    refreshLoading: false,
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
    if (this.state.refreshLoading) {
      return
    }
    this.setState({
      refreshModalDirectory: directory,
      refreshResponse: null
    })
  }

  clearRefreshResponse = () => {
    this.setState({
      refreshResponse: null
    })
  }

  refreshDirectoryContent = () => {
    const identifier = this.state.refreshModalDirectory
    if (!this.props.Stores.Qvain.original) { // only published datasets can be refreshed with the RPC
      return
    }
    this.setState({
      refreshResponse: null,
      refreshLoading: true
    })

    const currentState = this.props.Stores.Qvain.cumulativeState
    const newState = currentState === CumulativeStates.YES ? CumulativeStates.CLOSED : CumulativeStates.YES
    const obj = {
      cr_identifier: this.props.Stores.Qvain.original.identifier,
      dir_identifier: identifier
    }
    axios.post('/api/rpc/datasets/refresh_directory_content', obj)
      .then(response => {
        const data = response.data || {}
        this.setState({
          refreshResponse: {
            new_version_created: data.new_version_created
          }
        })
        // when a new version is created, the cumulative_state of the current version remains unchanged
        if (!data.new_version_created) {
          this.props.Stores.Qvain.setCumulativeState(newState)
        }
      })
      .catch(err => {
        let error = ''
        if (err.response && err.response.data && err.response.data.detail) {
          error = err.response.data.detail
        } else if (err.response && err.response.data) {
          error = err.response.data
        } else {
          error = this.response.errorMessage
        }

        this.setState({
          refreshResponse: {
            error
          }
        })
      })
      .finally(() => {
        this.setState({
          refreshLoading: false
        })
      })
  }

  renderFiles = (selected, inEdit, existing, removable) => {
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
                { s.directoryName && (
                  <RefreshDirectoryButton disabled={this.state.refreshLoading} type="button" onClick={() => this.setRefreshModalDirectory(s.identifier)}>
                    <Translate component={RefreshDirectoryButtonText} content="qvain.files.refreshModal.buttons.show" />
                  </RefreshDirectoryButton>
                )}
                <EditButton aria-label="Edit" onClick={this.handleEdit(s)} />
                { removable && (
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
      inEdit,
      cumulativeState,
      changed
    } = this.props.Stores.Qvain
    const selected = [...selectedDirectories, ...selectedFiles]
    const existing = [...existingDirectories, ...existingFiles]
    const isCumulative = cumulativeState === CumulativeStates.YES
    const cumulativeKey = isCumulative ? 'cumulative' : 'noncumulative'
    return (
      <Fragment>
        <Translate tabIndex="0" component={SelectedFilesTitle} content="qvain.files.selected.title" />
        {selected.length === 0 && <Translate tabIndex="0" component="p" content="qvain.files.selected.none" />}
        {this.renderFiles(selected, inEdit, false, true)}
        <Translate tabIndex="0" component={SelectedFilesTitle} content="qvain.files.existing.title" />
        <Translate tabIndex="0" content={`qvain.files.existing.help.${cumulativeKey}`} />
        {this.renderFiles(existing, inEdit, true, !isCumulative)}
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

        <Modal
          // Modal for refreshing folder content
          isOpen={!!this.state.refreshModalDirectory}
          onRequestClose={() => this.setRefreshModalDirectory(null)}
          contentLabel="refreshDirectoryModal"
        >
          <Translate component="h3" content="qvain.files.refreshModal.header" />
          {this.state.refreshLoading || this.state.refreshResponse ?
            <Response response={this.state.refreshResponse} />
          : (
            <>
              <Translate component="p" content={`qvain.files.refreshModal.${cumulativeKey}`} />
              { changed && <Translate component="p" content={'qvain.files.refreshModal.changes'} /> }
            </>
          )}
          {this.state.refreshResponse ? (
            <TableButton onClick={() => this.setRefreshModalDirectory(null)}>
              <Translate content={'qvain.files.refreshModal.buttons.close'} />
            </TableButton>
          ) : (
            <>
              <TableButton disabled={this.state.refreshLoading} onClick={() => this.setRefreshModalDirectory(null)}>
                <Translate content={'qvain.files.refreshModal.buttons.cancel'} />
              </TableButton>
              <DangerButton disabled={changed || this.state.refreshLoading} onClick={() => this.refreshDirectoryContent()}>
                <Translate content={'qvain.files.refreshModal.buttons.ok'} />
              </DangerButton>
            </>
          )}
        </Modal>
      </Fragment>
    )
  }
}

const isInEdit = (inEdit, identifier, existing) => (
  (inEdit !== undefined) && inEdit.identifier === identifier && (existing === inEdit.existing)
)

const isDirectory = (inEdit) => inEdit.directoryName !== undefined

export default inject('Stores')(observer(SelectedFilesBase))
