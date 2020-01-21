import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import axios from 'axios'

import { ContainerSubsectionBottom } from '../general/card'
import { CumulativeStates } from '../utils/constants'
import { LabelLarge, FormField, RadioInput, RadioContainer, Label, HelpField } from '../general/form'

import Modal from '../../general/modal'
import { TableButton, DangerButton,
  CumulativeStateButton,
  CumulativeStateButtonText,
} from '../general/buttons'

import Response from './response'


class CumulativeState extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    response: null,
    loading: false,
    modalOpen: false,
  }

  openModal = () => {
    this.setState({
      modalOpen: true,
    })
  }

  closeModal = () => {
    if (this.loading) {
      return
    }
    this.setState({
      modalOpen: false,
      response: null
    })
  }

  clearResponse = () => {
    this.setState({
      response: null
    })
  }

  handleToggleCumulativeState = () => {
    if (!this.props.Stores.Qvain.original) { // only published datasets can be toggled with the RPC
      return
    }
    this.setState({
      response: null,
      loading: true
    })

    const currentState = this.props.Stores.Qvain.cumulativeState
    const newState = currentState === CumulativeStates.YES ? CumulativeStates.CLOSED : CumulativeStates.YES
    const obj = {
      identifier: this.props.Stores.Qvain.original.identifier,
      cumulative_state: newState
    }
    axios.post('/api/rpc/datasets/change_cumulative_state', obj)
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
          error = err.response.errorMessage
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

  render() {
    const { changed, cumulativeState, setCumulativeState, original } = this.props.Stores.Qvain
    const stateKey = this.props.Stores.Qvain.cumulativeState === CumulativeStates.YES ? 'enabled' : 'disabled'

    let content = null
    if (original === undefined) {
      // cumulative state can be assigned directly for new datasets
      content = (
        <div>
          <FormField>
            <RadioContainer>
              <RadioInput
                id="cumulativeStateNo"
                name="cumulativeState"
                onChange={() => setCumulativeState(0)}
                type="radio"
                checked={cumulativeState === 0}
              />
            </RadioContainer>
            <Label htmlFor="cumulativeStateNo">
              <Translate content="qvain.files.cumulativeState.radio.no" />
            </Label>
          </FormField>
          <FormField>
            <RadioContainer>
              <RadioInput
                id="cumulativeStateYes"
                name="cumulativeState"
                onChange={() => setCumulativeState(1)}
                type="radio"
                checked={cumulativeState === 1}
              />
            </RadioContainer>
            <Label htmlFor="cumulativeStateYes">
              <Translate content="qvain.files.cumulativeState.radio.yes" />
            </Label>
          </FormField>

          <HelpField>
            <Translate component="p" content="qvain.files.cumulativeState.radio.note" />
          </HelpField>
        </div>
      )
    } else {
      // existing datasets need to use the RPC for changing cumulative state
      const note = changed ? 'qvain.files.cumulativeState.changes' : `qvain.files.cumulativeState.${stateKey}.note`
      content = (
        <div>
          <p>
            <Translate component="strong" content={`qvain.files.cumulativeState.${stateKey}.state`} />{' '}
            <Translate content={`qvain.files.cumulativeState.${stateKey}.explanation`} />
          </p>
          <p>
            <CumulativeStateButton disabled={changed} type="button" onClick={this.openModal}>
              <Translate component={CumulativeStateButtonText} content={`qvain.files.cumulativeState.${stateKey}.button`} />
            </CumulativeStateButton>
          </p>
          <HelpField>
            <Translate component="p" content={note} />
          </HelpField>
        </div>
      )
    }

    let modalContent
    if (this.state.loading || this.state.response) {
      modalContent = (
        <>
          <Response response={this.state.response} />
          <TableButton disabled={this.state.loading} onClick={this.closeModal}>
            <Translate content={'qvain.files.cumulativeState.closeButton'} />
          </TableButton>
        </>
      )
    } else {
      modalContent = (
        <>
          <Translate component="p" content={`qvain.files.cumulativeState.${stateKey}.confirm`} />
          <TableButton onClick={this.closeModal}>
            <Translate content={`qvain.files.cumulativeState.${stateKey}.cancel`} />
          </TableButton>
          <DangerButton onClick={this.handleToggleCumulativeState}>
            <Translate content={`qvain.files.cumulativeState.${stateKey}.button`} />
          </DangerButton>
        </>
      )
    }

    return (
      <ContainerSubsectionBottom>
        <LabelLarge htmlFor="cumulativeStateSelect">
          <Translate content="qvain.files.cumulativeState.label" />
        </LabelLarge>
        {content}
        <Modal isOpen={this.state.modalOpen} onRequestClose={this.closeModal} contentLabel="changeCumulativeStateModal">
          <Translate component="h3" content="qvain.files.cumulativeState.modalHeader" />
          { modalContent }
        </Modal>
      </ContainerSubsectionBottom>
    )
  }
}

export default inject('Stores')(observer(CumulativeState))
