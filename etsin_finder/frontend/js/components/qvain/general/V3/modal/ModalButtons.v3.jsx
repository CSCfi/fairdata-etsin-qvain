import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'
import { SaveButton, CancelButton } from '@/components/qvain/general/buttons'
import { ValidationErrors } from '@/components/qvain/general/errors/validationError'

import { ModalButtonGroup } from '..'

const ModalButtons = ({ listId, handleRequestClose }) => {
  const {
    Qvain: {
      readonly,
      Modals: { save, modals },
    },
  } = useStores()

  const { validationError, translationPath, isNew } = modals.find(
    i => i.controller.listId === listId
  )

  const translations = {
    cancel: `${translationPath}.modal.buttons.cancel`,
    save: `${translationPath}.modal.buttons.save`,
    editSave: `${translationPath}.modal.buttons.editSave`,
  }

  const validationErrors = Object.values(validationError)

  return (
    <ButtonAndErrorContainer>
      {!!validationErrors.length && (
        <Translate component={ValidationErrors} errors={validationErrors} />
      )}
      <ModalButtonGroup>
        <Translate
          component={CancelButton}
          onClick={handleRequestClose}
          content={translations.cancel}
        />
        <Translate
          disabled={readonly}
          component={SaveButton}
          onClick={() => save(listId)}
          content={isNew ? translations.save : translations.editSave}
        />
      </ModalButtonGroup>
    </ButtonAndErrorContainer>
  )
}

ModalButtons.propTypes = {
  listId: PropTypes.string.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
}

const ButtonAndErrorContainer = styled.div``

export default observer(ModalButtons)
