import { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import Modal from '@/components/general/modal'
import { ProjectForm } from '@/components/qvain/modalForms'

import { ConfirmClose } from './ConfirmClose'
import ModalButtons from './ModalButtons.v3'
import { ModalDivider, modalStyle, ModalHeader } from '.'

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
    <Modal
      isOpen
      onRequestClose={requestClose}
      contentLabel={modal.controller.listId}
      customStyles={modalStyle}
    >
      <Translate
        component={ModalHeader}
        content={`${modal.translationPath}.modal.title.${modal.isNew ? 'add' : 'edit'}`}
      />
      <ModalDivider />
      <Content modal={modal} />
      <ModalDivider />
      <ModalButtons listId={modal.controller.listId} handleRequestClose={requestClose} />
      <ConfirmClose show={confirm} onCancel={onConfirmCancel} onConfirm={onConfirm} />
    </Modal>
  )
}

ModalInstance.propTypes = {
  modal: PropTypes.shape({
    controller: PropTypes.object.isRequired,
    translationPath: PropTypes.string.isRequired,
    isNew: PropTypes.bool.isRequired,
  }).isRequired,
}

export default observer(ModalInstance)
