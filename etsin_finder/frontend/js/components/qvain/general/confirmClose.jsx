import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import {
  TableButton,
  DangerButton
} from './buttons'

// Show confirmation overlay for closing a modal with unsaved changes.
const ConfirmClose = ({ show, disabled, hideConfirm, closeModal }) => {
  if (!show) {
    return null
  }
  return (
    <ResponseOverlay>
      <Translate content={'qvain.confirmClose.warning'} component="p" />
      <Buttons>
        <HideButton disabled={disabled} onClick={hideConfirm}>
          <Translate content={'qvain.confirmClose.cancel'} />
        </HideButton>
        <DangerButton disabled={disabled} onClick={closeModal}>
          <Translate content={'qvain.confirmClose.confirm'} />
        </DangerButton>
      </Buttons>
    </ResponseOverlay>
  )
}

ConfirmClose.propTypes = {
  show: PropTypes.bool.isRequired,
  hideConfirm: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

ConfirmClose.defaultProps = {
  disabled: false,
}

export default ConfirmClose


const Buttons = styled.div`
  width: 100%;
  text-align: center;
  margin: -0.25rem;
  & * {
    margin: 0.25rem;
    padding: 0.75rem 0.25rem;
  }
`

const HideButton = styled(TableButton)`
  width: auto;
  height: auto;
`;

const ResponseOverlay = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  background: rgba(255,255,255,0.95);
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2em;
`
