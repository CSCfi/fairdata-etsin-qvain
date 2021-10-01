import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { useStores } from '@/stores/stores'
import { ConfirmClose } from './confirmClose'
import ModalButtons from './modalButtons'

const ModalContent = ({
  Field,
  handleSave,
  Form,
  formProps,
  confirm,
  onConfirmCancel,
  onConfirm,
  requestClose,
}) => {
  const {
    Qvain: { readonly },
  } = useStores()
  const { editMode, translationsRoot } = Field

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

  return (
    <>
      <Header>
        <Translate content={translations.title} />
      </Header>
      <Content>
        <Form Field={Field} {...formProps} />
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
  Field: PropTypes.object.isRequired,
  Form: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  formProps: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
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
