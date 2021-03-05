import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import { SaveButton, CancelButton } from '../buttons'
import ValidationError from '../errors/validationError'

const ModalButtons = ({ Field, handleRequestClose, translations, readonly, handleSave }) => (
  <ButtonAndErrorContainer>
    <Translate component={ValidationError} content={Field.validationError} />
    <div>
      <Translate
        component={CancelButton}
        onClick={handleRequestClose}
        content={translations.buttons.cancel}
      />
      <Translate
        disabled={readonly}
        component={SaveButton}
        onClick={handleSave}
        content={Field.editMode ? translations.buttons.editSave : translations.buttons.save}
      />
    </div>
  </ButtonAndErrorContainer>
)

ModalButtons.propTypes = {
  Field: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  translations: PropTypes.object.isRequired,
  readonly: PropTypes.bool,
}

ModalButtons.defaultProps = {
  readonly: undefined,
}

const ButtonAndErrorContainer = styled.div``

export default observer(ModalButtons)
