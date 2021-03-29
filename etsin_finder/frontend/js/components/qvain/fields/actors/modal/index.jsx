import React, { useState } from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import ActorTypeSelect from './actorTypeSelect'
import ActorRoles from './actorRoles'
import ActorInfo from './actorInfo'
import Modal from '../../../../general/modal'
import { ActorIcon } from '../common'
import { actorSchema } from '../../../utils/formValidation'
import { ConfirmClose } from '../../../general/modal/confirmClose'
import ActorErrors from './actorErrors'
import Buttons from './buttons'
import { TableButton } from '../../../general/buttons'
import { useStores } from '../../../utils/stores'

export const ActorModalBase = () => {
  const {
    Qvain: {
      Actors: {
        actorInEdit,
        editActor,
        saveActor,
        cancelActor,
        actors,
        referenceOrganizationErrors,
      },
      readonly,
    },
  } = useStores()
  const [actorError, setActorError] = useState(null)
  const [confirmClose, setConfirmClose] = useState(false)

  if (!actorInEdit) {
    return null
  }

  const loadingFailed = Object.values(referenceOrganizationErrors).length > 0
  const originalActor = actors.find(actor => actor.uiid === actorInEdit.uiid)
  const isNew = !originalActor
  const action = isNew ? 'create' : 'edit'

  const handleSaveActor = () => {
    actorSchema
      .validate(actorInEdit, { strict: true })
      .then(() => {
        saveActor(actorInEdit)
        editActor(null)
        setActorError(null)
      })
      .catch(err => {
        setActorError(err.errors)
      })
  }

  const close = () => {
    setConfirmClose(false)
    cancelActor()
  }

  const handleRequestClose = hasChanged => {
    if (hasChanged) {
      setConfirmClose(true)
    } else {
      close()
    }
  }

  const hideConfirmClose = () => {
    setConfirmClose(false)
  }

  const hasChanged = () => {
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

  const requestClose = () => handleRequestClose(hasChanged())

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
      <ActorErrors actorError={actorError} loadingFailed={loadingFailed} />
      <Buttons
        handleRequestClose={requestClose}
        handleSaveActor={handleSaveActor}
        readonly={readonly}
      />

      <ConfirmClose show={confirmClose} onCancel={hideConfirmClose} onConfirm={close} />
    </Modal>
  )
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

export default observer(ActorModalBase)
