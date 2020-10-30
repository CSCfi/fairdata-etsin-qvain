import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import Modal from '../../general/modal'
import { Button } from '../../general/button'

const DoiModal = ({ onAcceptUseDoi, onRequestClose, isOpen }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    customStyles={doiModalStyles}
    contentLabel="UseDoiModalInformation"
  >
    <Translate content="qvain.useDoiHeader" component="h2" />
    <Translate content="qvain.useDoiContent" component="p" />
    <Button onClick={onAcceptUseDoi}>
      <Translate content="qvain.useDoiAffirmative" component="span" />
    </Button>
    <Button onClick={onRequestClose}>
      <Translate content="qvain.useDoiNegative" component="span" />
    </Button>
  </Modal>
)

DoiModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onAcceptUseDoi: PropTypes.func.isRequired,
}

const doiModalStyles = {
  content: {
    content: {
      minWidth: '20vw',
      maxWidth: '60vw',
      padding: '2vw',
    },
  },
}

export default DoiModal
