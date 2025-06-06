import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import Modal from '../../../general/modal'
import Button from '../../../general/button'
import ModalContent from './ModalContent'
import { modalStyle } from './index'

const ModalFieldListAdd = ({
  Field,
  fieldName,
  form,
  contentLabel,
  position,
  hideButton,
  isOpen,
  onClick,
}) => {
  const [confirm, setConfirm] = useState(false)
  const create = onClick || Field.create

  const close = () => {
    const { clearInEdit } = Field
    setConfirm(false)
    clearInEdit()
  }

  const confirmClose = () => {
    const { hasChanged } = Field
    if (hasChanged) setConfirm(true)
    else close()
  }

  const open = () => {
    create()
  }

  const confirmCancel = () => {
    setConfirm(false)
  }

  const isModalOpen = isOpen ?? Field.inEdit

  return (
    <>
      {isModalOpen && (
        <Modal
          isOpen
          onRequestClose={confirmClose}
          contentLabel={contentLabel}
          customStyles={modalStyle}
          labelledBy={`modal-header-${fieldName}`}
        >
          <ModalContent
            Field={Field}
            fieldName={fieldName}
            form={form}
            modalControls={{
              confirm,
              requestClose: confirmClose,
              onConfirmCancel: confirmCancel,
              onConfirm: close,
            }}
          />
        </Modal>
      )}
      {!hideButton && (
        <ButtonContainer position={position}>
          <AddNewButton type="button" onClick={open} disabled={Field.readonly}>
            <Translate content={`${Field.translationPath}.modal.addButton`} />
          </AddNewButton>
        </ButtonContainer>
      )}
    </>
  )
}

ModalFieldListAdd.propTypes = {
  Field: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  hideButton: PropTypes.bool,
  form: PropTypes.shape({
    Form: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    props: PropTypes.object,
  }).isRequired,
  contentLabel: PropTypes.string,
  position: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
}

ModalFieldListAdd.defaultProps = {
  contentLabel: '',
  position: 'left',
  hideButton: false,
  isOpen: null,
  onClick: null,
}

const ButtonContainer = styled.div`
  text-align: ${props => props.position};
  margin-top: 0.5rem;
  margin-bottom: 0;
  > button {
    margin: 0;
  }
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 0.2em;
  margin-bottom: 0.4em;
`

export default observer(ModalFieldListAdd)
