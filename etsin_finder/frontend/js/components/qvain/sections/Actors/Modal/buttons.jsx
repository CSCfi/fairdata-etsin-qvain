import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import { useStores } from '@/stores/stores'
import { ModalButtonGroup } from '@/components/qvain/general/V2'
import { SaveButton, CancelButton } from '../../../general/buttons'

const Buttons = ({ handleRequestClose, handleSaveActor, readonly }) => {
  const {
    Qvain: {
      Actors: { isNew },
    },
  } = useStores()

  const action = isNew ? 'save' : 'edit'

  return (
    <ModalButtonGroup>
      <Translate
        component={CancelButton}
        type="button"
        onClick={handleRequestClose}
        content="qvain.actors.add.cancel.label"
      />
      <Translate
        disabled={readonly}
        component={SaveButton}
        type="button"
        onClick={handleSaveActor}
        content={`qvain.actors.add.${action}.label`}
        data-cy="save-actor"
      />
    </ModalButtonGroup>
  )
}

Buttons.propTypes = {
  handleRequestClose: PropTypes.func.isRequired,
  handleSaveActor: PropTypes.func.isRequired,
  readonly: PropTypes.bool.isRequired,
}

export default observer(Buttons)
