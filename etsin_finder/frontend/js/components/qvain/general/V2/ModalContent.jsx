import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { ModalHeader, ModalDivider } from '@/components/qvain/general/V2'
import { ConfirmClose } from '../modal/confirmClose'
import ModalButtons from './ModalButtons'

const ModalContent = ({
  Field,
  fieldName,
  translationsRoot: componentTranslationsRoot,
  editMode,
  form: { Form, props: formProps },
  modalControls: { confirm, onConfirmCancel, onConfirm, requestClose },
}) => {
  const fieldEdit = Field.editMode
  const translationsRoot = componentTranslationsRoot || Field.translationsRoot

  const translations = {
    title:
      editMode ?? fieldEdit
        ? `${translationsRoot}.modal.title.edit`
        : `${translationsRoot}.modal.title.add`,
  }

  return (
    <>
      <Translate
        id={`modal-header-${fieldName}`}
        component={ModalHeader}
        content={translations.title}
      />
      <ModalDivider />
      <Form {...formProps} />
      <ModalDivider />
      <ModalButtons
        handleRequestClose={requestClose}
        translationsRoot={translationsRoot}
        Field={Field}
      />
      <ConfirmClose show={confirm} onCancel={onConfirmCancel} onConfirm={onConfirm} />
    </>
  )
}

ModalContent.propTypes = {
  Field: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  translationsRoot: PropTypes.string,
  editMode: PropTypes.bool,
  form: PropTypes.object.isRequired,
  modalControls: PropTypes.shape({
    onConfirmCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    confirm: PropTypes.bool.isRequired,
    requestClose: PropTypes.func.isRequired,
  }).isRequired,
}

ModalContent.defaultProps = {
  translationsRoot: null,
  editMode: null,
}

export default ModalContent
