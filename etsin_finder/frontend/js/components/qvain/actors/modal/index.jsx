import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import ActorTypeSelect from './actorTypeSelect'
import ActorRoles from './actorRoles'
import ActorInfo from './actorInfo'
import Modal from '../../../general/modal'
import { ActorIcon } from '../common'
import { actorSchema } from '../../utils/formValidation'
import { ConfirmClose } from '../../general/confirmClose'
import ActorErrors from './actorErrors'
import Buttons from './buttons'
import { TableButton } from '../../general/buttons'

export class ActorModalBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    confirmClose: false,
    actorError: null,
  }

  handleSaveActor = () => {
    const { Qvain } = this.props.Stores
    const { actorInEdit, editActor, saveActor } = Qvain.Actors

    actorSchema
      .validate(actorInEdit)
      .then(() => {
        saveActor(actorInEdit)
        editActor(null)
        this.setState({ actorError: null })
      })
      .catch(err => {
        this.setState({ actorError: err.errors })
      })
  }

  close = () => {
    this.setState({ confirmClose: false })
    this.props.Stores.Qvain.Actors.cancelActor()
  }

  handleRequestClose = hasChanged => {
    if (hasChanged) {
      this.setState({ confirmClose: true })
    } else {
      this.close()
    }
  }

  hideConfirmClose = () => {
    this.setState({ confirmClose: false })
  }

  hasChanged = originalActor => {
    const { actorInEdit } = this.props.Stores.Qvain.Actors
    if (originalActor) {
      return JSON.stringify(originalActor) !== JSON.stringify(actorInEdit)
    }
    return (
      Object.values(actorInEdit.person.name).some(val => val.length > 0) ||
      actorInEdit.person.email.length ||
      actorInEdit.person.identifier.length ||
      actorInEdit.roles.length ||
      actorInEdit.organizations.length
    )
  }

  render() {
    const { readonly } = this.props.Stores.Qvain
    const { actorInEdit, actors, referenceOrganizationErrors } = this.props.Stores.Qvain.Actors
    if (!actorInEdit) {
      return null
    }
    const loadingFailed = Object.values(referenceOrganizationErrors).length > 0
    const originalActor = actors.find(actor => actor.uiid === actorInEdit.uiid)
    const hasChanged = this.hasChanged(originalActor)
    const isNew = !originalActor
    const action = isNew ? 'create' : 'edit'
    const requestClose = () => this.handleRequestClose(hasChanged)

    return (
      <Modal
        isOpen
        onRequestClose={requestClose}
        contentLabel="fixDeprecatedModal"
        customStyles={modalStyle}
      >
        <Header>
          <ActorIcon actor={actorInEdit} style={{ marginRight: '1rem' }} />
          <Translate content={`qvain.actors.add.action.${action}`} />
        </Header>
        <Content>
          <ActorTypeSelect />
          <ActorRoles />
          <ActorInfo />
        </Content>
        <ActorErrors actorError={this.state.actorError} loadingFailed={loadingFailed} />
        <Buttons
          handleRequestClose={requestClose}
          handleSaveActor={this.handleSaveActor}
          readonly={readonly}
        />

        <ConfirmClose
          show={this.state.confirmClose}
          onCancel={this.hideConfirmClose}
          onConfirm={this.close}
        />
      </Modal>
    )
  }
}

export const AutoWidthTableButton = styled(TableButton)`
  width: auto;
  margin-bottom: 0.5rem;
`

const Content = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  margin-bottom: 0.5rem;
`

const Header = styled.h3`
  margin-right: 1.5rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 0rem;
`

const modalStyle = {
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    minHeight: '85vh',
    maxHeight: '95vh',
    minWidth: '300px',
    maxWidth: '600px',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    paddingLeft: '2em',
    paddingRight: '2em',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}

export default inject('Stores')(observer(ActorModalBase))
