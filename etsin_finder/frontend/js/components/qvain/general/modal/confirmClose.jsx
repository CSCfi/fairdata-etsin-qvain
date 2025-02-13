import React from 'react'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'

import { DangerCancelButton, DangerButton, ConfirmButtonContainer } from '../buttons'
import { ResponseOverlay } from './modalOverlay'

export const ConfirmDialog = ({ show, disabled, onConfirm, onCancel, content }) => {
  if (!show) {
    return null
  }
  return (
    <ResponseOverlay>
      {content.warning}
      <ConfirmButtonContainer>
        <DangerCancelButton disabled={disabled} onClick={onCancel}>
          {content.cancel}
        </DangerCancelButton>
        <DangerButton disabled={disabled} onClick={onConfirm}>
          {content.confirm}
        </DangerButton>
      </ConfirmButtonContainer>
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
    cancel: PropTypes.node,
  }).isRequired,
}

ConfirmDialog.defaultProps = {
  disabled: false,
}

// Show confirmation overlay for closing a modal with unsaved changes.
export const ConfirmClose = props => {
  const content = {
    warning: <Translate content={props.warning} component="p" />,
    confirm: <Translate content={props.confirm} />,
    cancel: <Translate content={props.cancel} />,
  }
  return <ConfirmDialog {...props} content={content} />
}

ConfirmClose.propTypes = {
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  warning: PropTypes.string,
  confirm: PropTypes.string,
  cancel: PropTypes.string,
}

ConfirmClose.defaultProps = {
  disabled: false,
  warning: 'qvain.confirmClose.warning',
  confirm: 'qvain.confirmClose.confirm',
  cancel: 'qvain.confirmClose.cancel',
}
