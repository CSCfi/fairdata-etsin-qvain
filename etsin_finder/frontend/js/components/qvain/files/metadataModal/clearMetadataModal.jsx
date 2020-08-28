import React, { Component } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import axios from 'axios'

import Modal from '../../../general/modal'
import { DangerButton, TableButton } from '../../general/buttons'
import { getPASMeta } from '../../../../stores/view/common.files.items'

import urls from '../../utils/urls'

class ClearMetadataModal extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    loading: false,
  }

  clearFileCharacteristics = async () => {
    const { clearMetadataModalFile, Files } = this.props.Stores.Qvain
    const { identifier } = clearMetadataModalFile
    const { applyClearPASMeta } = Files
    const url = urls.v2.fileCharacteristics(identifier)

    // revert to default file characteristics
    const data = {
      encoding: 'UTF-8',
    }

    this.setState({ loading: true })
    try {
      const response = await axios.put(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      applyClearPASMeta(getPASMeta(response.data))
      this.close()
    } finally {
      this.setState({ loading: false })
    }
  }

  close = () => {
    if (this.state.loading) {
      return
    }
    const { setClearMetadataModalFile } = this.props.Stores.Qvain
    setClearMetadataModalFile(undefined)
  }

  render() {
    const { clearMetadataModalFile, readonly } = this.props.Stores.Qvain
    const { metaxApiV2 } = this.props.Stores.Env

    // Only supported with metaxApiV2
    if (!clearMetadataModalFile || !metaxApiV2) {
      return null
    }

    return (
      <Modal
        contentLabel="clearMetadataModal"
        isOpen
        onRequestClose={this.close}
        customStyles={modalStyles}
      >
        <Translate
          content="qvain.files.metadataModal.clear.header"
          component="h3"
          style={{ marginBottom: 0 }}
        />
        <Translate
          content="qvain.files.metadataModal.clear.help"
          component="p"
          with={{ file: clearMetadataModalFile.name }}
        />
        <Buttons>
          <TableButton disabled={this.state.loading} onClick={this.close}>
            <Translate content={'qvain.files.metadataModal.clear.cancel'} />
          </TableButton>
          <DangerButton
            disabled={this.state.loading || readonly}
            onClick={this.clearFileCharacteristics}
          >
            <Translate content={'qvain.files.metadataModal.clear.confirm'} />
          </DangerButton>
        </Buttons>
      </Modal>
    )
  }
}

const Buttons = styled.div`
  margin-top: 1rem;
`

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

export default inject('Stores')(observer(ClearMetadataModal))
