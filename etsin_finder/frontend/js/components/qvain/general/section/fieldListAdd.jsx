import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Modal from '../../../general/modal'
import Button from '../../../general/button'
import ModalContent from '../modal/modalContent'

const FieldListAdd = ({
  Store,
  Field,
  translationsRoot,
  handleSave,
  formProps,
  Form,
  language,
  contentLabel,
  position,
  hideButton,
}) => {
  const [confirm, setConfirm] = useState(false)

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
    const { create } = Field
    create()
  }

  const confirmCancel = () => {
    setConfirm(false)
  }

  return (
    <>
      {Field.inEdit && (
        <Modal
          isOpen
          onRequestClose={confirmClose}
          contentLabel={contentLabel}
          customStyles={modalStyle}
        >
          <ModalContent
            translationsRoot={translationsRoot}
            Store={Store}
            Field={Field}
            handleSave={handleSave}
            Form={Form}
            formProps={formProps}
            language={language}
            confirm={confirm}
            requestClose={confirmClose}
            onConfirmCancel={confirmCancel}
            onConfirm={close}
          />
        </Modal>
      )}
      {!hideButton && (
        <ButtonContainer position={position}>
          <AddNewButton type="button" onClick={open} disabled={Field.readonly}>
            <Translate content={`${translationsRoot}.modal.addButton`} />
          </AddNewButton>
        </ButtonContainer>
      )}
    </>
  )
}

FieldListAdd.propTypes = {
  Store: PropTypes.object.isRequired,
  Field: PropTypes.object.isRequired,
  hideButton: PropTypes.bool,
  translationsRoot: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
  Form: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  formProps: PropTypes.object,
  language: PropTypes.string,
  contentLabel: PropTypes.string,
  position: PropTypes.string,
}

FieldListAdd.defaultProps = {
  language: '',
  contentLabel: '',
  position: 'left',
  formProps: {},
  hideButton: false,
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

export default observer(FieldListAdd)
