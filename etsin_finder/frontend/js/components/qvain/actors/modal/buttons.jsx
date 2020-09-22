import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import { SaveButton, CancelButton } from '../../general/buttons'

const Buttons = ({ handleRequestClose, handleSaveActor, readonly }) => (
  <div style={{ marginTop: 'auto' }}>
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
      content="qvain.actors.add.save.label"
    />
  </div>
)

Buttons.propTypes = {
  handleRequestClose: PropTypes.func.isRequired,
  handleSaveActor: PropTypes.func.isRequired,
  readonly: PropTypes.bool.isRequired,
}

export default Buttons
