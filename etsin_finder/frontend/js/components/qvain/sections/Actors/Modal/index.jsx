import { useState } from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import ActorTypeSelect from './actorTypeSelect'
import ActorRoles from './actorRoles'
import ActorInfo from './actorInfo'
import Modal from '@/components/general/modal'
import { ActorIcon } from '../common'
import { ConfirmClose } from '@/components/qvain/general/modal/confirmClose'
import ActorErrors from './actorErrors'
import Buttons from './buttons'
import { TableButton } from '@/components/qvain/general/buttons'
import { useStores } from '@/stores/stores'
import { modalStyle, ModalDivider, ModalHeader } from '@/components/qvain/general/V2'
import useScrollToTop from '@/utils/useScrollToTop'

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
        actorSchema,
        isNew,
      },
      readonly,
    },
  } = useStores()
  const [actorError, setActorError] = useState(null)
  const [confirmClose, setConfirmClose] = useState(false)
  const contentRef = useScrollToTop(!!actorInEdit)

  if (!actorInEdit) {
    return null
  }

  const loadingFailed = Object.values(referenceOrganizationErrors).length > 0
  const originalActor = actors.find(actor => actor.uiid === actorInEdit.uiid)
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
    setActorError(null)
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

  const getHasChanged = () => {
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

  const requestClose = () => handleRequestClose(getHasChanged())

  return (
    <Modal
      isOpen
      onRequestClose={requestClose}
      contentLabel="actorsModal"
      customStyles={modalStyle}
    >
      <ModalHeader>
        <ActorIcon actor={actorInEdit} style={{ marginRight: '1rem' }} />
        <Translate content={`qvain.actors.add.action.${action}`} />
      </ModalHeader>
      <ModalDivider />
      <Content ref={contentRef}>
        <ActorTypeSelect />
        <ActorRoles />
        <ActorInfo />
      </Content>
      <ActorErrors actorError={actorError} loadingFailed={loadingFailed} />
      <ModalDivider />
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
  margin-top: 0.5rem;
  flex-grow: 1;
  overflow: auto;
  gap: 0.75rem;
`

export default observer(ActorModalBase)
