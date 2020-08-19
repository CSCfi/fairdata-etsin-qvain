import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Modal from '../../general/modal'
import Button from '../../general/button'
import ModalContent from './modalContent'
import { ConfirmClose } from './confirmClose'

const FieldListAdd = ({
  Store,
  Field,
  translationsRoot,
  handleSave,
  Form,
  language,
  contentLabel,
  position,
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

  return (
    <>
      <Observer>
        {() => {
          if (Field.inEdit) {
            return (
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
                  language={language}
                />
                <ConfirmClose show={confirm} onCancel={() => setConfirm(false)} onConfirm={close} />
              </Modal>
            )
          }
          return null
        }}
      </Observer>
      <ButtonContainer position={position}>
        <AddNewButton type="button" onClick={open}>
          <Translate content={`${translationsRoot}.modal.addButton`} />
        </AddNewButton>
      </ButtonContainer>
    </>
  )
}

FieldListAdd.propTypes = {
  Store: PropTypes.object.isRequired,
  Field: PropTypes.object.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  handleSave: PropTypes.func.isRequired,
  Form: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  language: PropTypes.string,
  contentLabel: PropTypes.string,
  position: PropTypes.string,
}

FieldListAdd.defaultProps = {
  language: '',
  contentLabel: '',
  position: 'right',
}

const ButtonContainer = styled.div`
  text-align: ${props => props.position};
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

export default FieldListAdd
