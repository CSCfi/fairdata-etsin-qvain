import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import Modal from '../../general/modal'
import { Button } from '../../general/button'

const DoiModal = props => (
  <Modal
    isOpen={props.isOpen}
    onRequestClose={props.onRequestClose}
    customStyles={doiModalStyles}
    contentLabel="UseDoiModalInformation"
  >
    <Translate content="qvain.useDoiHeader" component="h2" />
    <Translate content="qvain.useDoiContent" component="p" />
    <Button onClick={props.onAcceptUseDoi}>
      <Translate content="qvain.useDoiAffirmative" component="span" />
    </Button>
    <Button onClick={props.onRequestClose}>
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
