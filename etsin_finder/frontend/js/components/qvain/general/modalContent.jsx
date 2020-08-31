import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { ConfirmClose } from './confirmClose'
import ModalButtons from './modalButtons'

const ModalContent = ({
  Store,
  Field,
  handleSave,
  Form,
  translationsRoot,
  language,
  formProps,
  confirm,
  onConfirmCancel,
  onConfirm,
  requestClose,
}) => {
  const translations = {
    title: editMode
      ? `${translationsRoot}.modal.title.edit`
      : `${translationsRoot}.modal.title.add`,
    buttons: {
      cancel: `${translationsRoot}.modal.buttons.cancel`,
      save: `${translationsRoot}.modal.buttons.save`,
      editSave: `${translationsRoot}.modal.buttons.editSave`,
    },
  }
  const { editMode } = Field
  const { readonly } = Store

  return (
    <>
      <Header>
        <Translate content={translations.title} />
      </Header>
      <Content>
        <Form
          Store={Store}
          Field={Field}
          translationsRoot={translationsRoot}
          language={language}
          {...formProps}
        />
        <ModalButtons
          handleRequestClose={requestClose}
          translations={translations}
          readonly={readonly}
          handleSave={() => handleSave(Field)}
          Field={Field}
        />
        <ConfirmClose show={confirm} onCancel={onConfirmCancel} onConfirm={onConfirm} />
      </Content>
    </>
  )
}

ModalContent.propTypes = {
  Store: PropTypes.object.isRequired,
  Field: PropTypes.object.isRequired,
  Form: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  formProps: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  onConfirmCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirm: PropTypes.bool.isRequired,
  requestClose: PropTypes.func.isRequired,
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
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

export default ModalContent
