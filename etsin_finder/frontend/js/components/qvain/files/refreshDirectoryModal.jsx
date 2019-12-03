import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import axios from 'axios'

import Modal from '../../general/modal'
import Response from './response'
import { CumulativeStates } from '../utils/constants'
import { DangerButton, TableButton } from '../general/buttons'

class RefreshDirectoryModal extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    directory: PropTypes.string,
  }

  static defaultProps = {
    directory: null,
  }

  state = {
    response: null,
    loading: false,
  }

  refreshDirectoryContent = () => {
    const identifier = this.props.directory
    if (!this.props.Stores.Qvain.original) { // only published datasets can be refreshed with the RPC
      return
    }
    this.setState({
      response: null,
      loading: true
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
          response: {
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
          response: {
            error
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
      this.props.onClose()
    }
  }

  render() {
    const { changed, cumulativeState } = this.props.Stores.Qvain
    const isCumulative = cumulativeState === CumulativeStates.YES
    const cumulativeKey = isCumulative ? 'cumulative' : 'noncumulative'
    return (
      <Modal
        isOpen={!!this.props.directory}
        onRequestClose={this.handleRequestClose}
        contentLabel="refreshDirectoryModal"
      >
        <Translate component="h3" content="qvain.files.refreshModal.header" />
        {this.state.loading || this.state.response ?
          <Response response={this.state.response} />
        : (
          <>
            <Translate component="p" content={`qvain.files.refreshModal.${cumulativeKey}`} />
            { changed && <Translate component="p" content={'qvain.files.refreshModal.changes'} /> }
          </>
        )}
        {this.state.response ? (
          <TableButton onClick={() => this.setRefreshModalDirectory(null)}>
            <Translate content={'qvain.files.refreshModal.buttons.close'} />
          </TableButton>
        ) : (
          <>
            <TableButton disabled={this.state.loading} onClick={() => this.setRefreshModalDirectory(null)}>
              <Translate content={'qvain.files.refreshModal.buttons.cancel'} />
            </TableButton>
            <DangerButton disabled={changed || this.state.loading} onClick={() => this.refreshDirectoryContent()}>
              <Translate content={'qvain.files.refreshModal.buttons.ok'} />
            </DangerButton>
          </>
        )}
      </Modal>
    )
  }
}

export default inject('Stores')(observer(RefreshDirectoryModal))
