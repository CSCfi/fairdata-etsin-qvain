import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import axios from 'axios'

import Modal from '../../general/modal'
import Response from './response'
import { DangerButton, TableButton } from '../general/buttons'
import { getResponseError } from '../utils/responseError'

class FixDeprecatedModal extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    response: null,
    loading: false,
  }

  fixDeprecated = () => {
    const { deprecated, original } = this.props.Stores.Qvain
    if (!original || !deprecated) {
      return
    }
    this.setState({
      response: null,
      loading: true
    })

    const obj = {
      identifier: original.identifier,
    }
    axios.post('/api/rpc/datasets/fix_deprecated', obj)
      .then(response => {
        const data = response.data || {}
        this.setState({
          response: {
            new_version_created: data.new_version_created
          }
        })
      })
      .catch(err => {
        this.setState({
          response: {
            error: getResponseError(err)
          }
        })
      })
      .finally(() => {
        this.setState({
          loading: false
        })
      })
  }

  handleRequestClose = () => {
    if (!this.state.loading) {
      this.props.Stores.Qvain.closeFixDeprecatedModal()
      this.setState({
        response: null,
      })
    }
  }

  render() {
    const { changed, fixDeprecatedModalOpen } = this.props.Stores.Qvain
    return (
      <Modal
        isOpen={fixDeprecatedModalOpen}
        onRequestClose={this.handleRequestClose}
        contentLabel="fixDeprecatedModal"
      >
        <Translate component="h3" content="qvain.files.fixDeprecatedModal.header" />
        {this.state.loading || this.state.response ?
          <Response response={this.state.response} requestClose={this.handleRequestClose} />
          : (
            <>
              <Translate component="p" content={'qvain.files.fixDeprecatedModal.help'} />
              {changed && <Translate component="p" content={'qvain.files.fixDeprecatedModal.changes'} />}
            </>
          )}
        {this.state.response ? (
          <TableButton onClick={this.handleRequestClose}>
            <Translate content={'qvain.files.fixDeprecatedModal.buttons.close'} />
          </TableButton>
        ) : (
          <>
            <TableButton disabled={this.state.loading} onClick={this.handleRequestClose}>
              <Translate content={'qvain.files.fixDeprecatedModal.buttons.cancel'} />
            </TableButton>
            <DangerButton disabled={changed || this.state.loading} onClick={() => this.fixDeprecated()}>
              <Translate content={'qvain.files.fixDeprecatedModal.buttons.ok'} />
            </DangerButton>
          </>
        )}
      </Modal>
    )
  }
}

export default inject('Stores')(observer(FixDeprecatedModal))
