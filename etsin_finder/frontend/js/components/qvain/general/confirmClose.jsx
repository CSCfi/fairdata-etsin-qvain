import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import {
  DangerCancelButton,
  DangerButton
} from './buttons'

export const ConfirmDialog = ({ show, disabled, onConfirm, onCancel, content }) => {
  if (!show) {
    return null
  }
  return (
    <ResponseOverlay>
      {content.warning}
      <div style={{ margin: 10 }} />
      <Buttons>
        <DangerCancelButton disabled={disabled} onClick={onCancel}>
          {content.cancel}
        </DangerCancelButton>
        <DangerButton disabled={disabled} onClick={onConfirm}>{content.confirm}</DangerButton>
      </Buttons>
    </ResponseOverlay>
  )
}

ConfirmDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  content: PropTypes.exact({
    warning: PropTypes.node,
    confirm: PropTypes.node,
    cancel: PropTypes.node
  }).isRequired
}

ConfirmDialog.defaultProps = {
  disabled: false,
}


// Show confirmation overlay for closing a modal with unsaved changes.
export const ConfirmClose = (props) => {
  const content = {
    warning: <Translate content={'qvain.confirmClose.warning'} component="p" />,
    confirm: <Translate content={'qvain.confirmClose.confirm'} />,
    cancel: <Translate content={'qvain.confirmClose.cancel'} />
  }
  return <ConfirmDialog {...props} content={content} />
}

ConfirmClose.propTypes = {
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

ConfirmClose.defaultProps = {
  disabled: false,
}


const Buttons = styled.div`
  width: 100%;
  text-align: center;
  margin: -0.25rem;
  & * {
    margin: 0.25rem;
    padding: 0.75rem 0.25rem;
  }
`

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
