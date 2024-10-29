import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import { useStores } from '@/stores/stores'
import Modal from '@/components/general/modal'
import { ProjectForm } from '@/components/qvain/modalForms'

import { ConfirmClose } from './ConfirmClose'
import ModalButtons from './ModalButtons.v3'

const modalContents = {
  project: ProjectForm,
}

const ModalInstance = ({ modal }) => {
  const {
    Qvain: {
      Modals: { close },
    },
  } = useStores()

  const [confirm, setConfirm] = useState(false)

  const onConfirm = () => {
    setConfirm(false)
    close()
  }

  const requestClose = () => {
    if (modal.controller.hasChanged) setConfirm(true)
    else onConfirm()
  }

  const onConfirmCancel = () => {
    setConfirm(false)
  }

  const Content = modalContents[modal.controller.listId]

  return (
    <Modal isOpen onRequestClose={requestClose} contentLabel={modal.controller.listId}>
      <Content modal={modal} />
      <ModalButtons listId={modal.controller.listId} handleRequestClose={requestClose} />
      <ConfirmClose show={confirm} onCancel={onConfirmCancel} onConfirm={onConfirm} />
    </Modal>
  )
}

ModalInstance.propTypes = {
  modal: PropTypes.shape({
    controller: PropTypes.object.isRequired,
  }).isRequired,
}

export default observer(ModalInstance)
