import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'

import Modal from '../../../../general/modal'
import { ConfirmClose } from '../../../general/modal/confirmClose'
import { TableButton } from '../../../general/buttons'
import FileForm from './fileForm'
import DirectoryForm from './directoryForm'

class FormModal extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    changed: false,
    confirmClose: false,
  }

  requestClose = () => {
    if (this.state.loading) {
      return
    }

    if (!this.state.changed) {
      this.close()
    } else {
      this.showConfirmClose()
    }
  }

  showConfirmClose = () => {
    this.setState({
      confirmClose: true,
    })
  }

  hideConfirmClose = () => {
    this.setState({
      confirmClose: false,
    })
  }

  clearError = () => {
    this.setState({})
  }

  close = () => {
    const { setInEdit } = this.props.Stores.Qvain.Files
    setInEdit(null)
    this.setChanged(false)
    this.hideConfirmClose()
  }

  setChanged = value => {
    this.setState({
      changed: value,
    })
  }

  render() {
    const { inEdit } = this.props.Stores.Qvain.Files
    if (!inEdit) {
      return null
    }
    return (
      <Modal
        contentLabel="formModal"
        isOpen
        onRequestClose={this.requestClose}
        customStyles={modalStyles}
      >
        <h3>
          <FontAwesomeIcon icon={faFile} style={{ marginRight: '1rem' }} />
          <ItemPath item={inEdit} />
        </h3>
        {this.state.changed && '*'}

        {inEdit.type === 'directory' && (
          <DirectoryForm setChanged={this.setChanged} requestClose={this.requestClose} />
        )}
        {inEdit.type === 'file' && (
          <FileForm setChanged={this.setChanged} requestClose={this.requestClose} />
        )}
        <ConfirmClose
          show={this.state.confirmClose}
          onCancel={this.hideConfirmClose}
          onConfirm={this.close}
          disabled={this.state.loading}
        />
      </Modal>
    )
  }
}

const ItemPath = ({ item }) => item.path.substring(1).split('/').join(' / ')

export const modalStyles = {
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    minWidth: '32vw',
    width: '30em',
    maxWidth: '30em',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'auto',
  },
  overlay: {
    zIndex: '100',
  },
}

export const AutoWidthTableButton = styled(TableButton)`
  width: auto;
`

export default inject('Stores')(observer(FormModal))
