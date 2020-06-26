import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Observer } from 'mobx-react'
import Translate from 'react-translate-component'
import Modal from '../../general/modal'
import Button from '../../general/button'
import ModalContent from './modalContent'

const FieldListAdd = ({ Store, Field, translationsRoot, handleSave, Form, language, contentLabel }) => {
    const close = () => {
      const { clearInEdit } = Field
      clearInEdit();
    }

    const open = () => {
      const { create } = Field
      create()
    }

    return (
      <>
        <Observer>
          {() => (Field.inEdit ? (
            <Modal
              isOpen
              onRequestClose={close}
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
            </Modal>
        ) : null)
        }
        </Observer>
        <ButtonContainer>
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
  Form: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func
  ]).isRequired,
  language: PropTypes.string,
  contentLabel: PropTypes.string
}

FieldListAdd.defaultProps = {
  language: '',
  contentLabel: ''
}


const ButtonContainer = styled.div`
  text-align: right;
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
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
