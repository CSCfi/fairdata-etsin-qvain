import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { SaveButton, CancelButton } from '@/components/qvain/general/buttons'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { ModalButtonGroup } from '.'

const ModalButtons = ({
  Field,
  handleRequestClose,
  translationsRoot: componentTranslationsRoot,
}) => {
  const {
    validationError,
    editMode,
    readonly,
    validateAndSave,
    translationsRoot: fieldTranslationsRoot,
  } = Field

  const translationsRoot = componentTranslationsRoot || fieldTranslationsRoot

  const translations = {
    cancel: `${translationsRoot}.modal.buttons.cancel`,
    save: `${translationsRoot}.modal.buttons.save`,
    editSave: `${translationsRoot}.modal.buttons.editSave`,
  }

  return (
    <ButtonAndErrorContainer>
      <Translate component={ValidationError} content={validationError} />
      <ModalButtonGroup>
        <Translate
          component={CancelButton}
          onClick={handleRequestClose}
          content={translations.cancel}
        />
        <Translate
          disabled={readonly}
          component={SaveButton}
          onClick={validateAndSave}
          content={editMode ? translations.editSave : translations.save}
        />
      </ModalButtonGroup>
    </ButtonAndErrorContainer>
  )
}

ModalButtons.propTypes = {
  Field: PropTypes.object.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  translationsRoot: PropTypes.string,
}

ModalButtons.defaultProps = {
  translationsRoot: null,
}

const ButtonAndErrorContainer = styled.div``

export default observer(ModalButtons)
