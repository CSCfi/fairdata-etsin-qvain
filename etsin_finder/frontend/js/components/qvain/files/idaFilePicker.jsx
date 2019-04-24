import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import {
  FilePickerButton,
  FileIcon,
  FilePickerButtonText,
  ChevronIcon
} from '../general/buttons'
import Modal from '../../general/modal'

class IDAFilePicker extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    idaModalOpen: false
  }

  handleOpenModal = (event) => {
    event.preventDefault()
    this.setState({ idaModalOpen: true })
  }

  handleCloseModal = () => {
    this.setState({ idaModalOpen: false })
  }

  render() {
    return (
      <React.Fragment>
        <Translate component="p" content="qvain.files.ida.help" />
        <FilePickerButton onClick={this.handleOpenModal}>
          <FileIcon />
          <Translate component={FilePickerButtonText} content="qvain.files.ida.button.label" />
          <ChevronIcon />
        </FilePickerButton>
        <Modal isOpen={this.state.idaModalOpen} onRequestClose={this.handleCloseModal}>
          <h2>IDA files</h2>
        </Modal>
      </React.Fragment>
    )
  }
}

export default inject('Stores')(observer(IDAFilePicker))
