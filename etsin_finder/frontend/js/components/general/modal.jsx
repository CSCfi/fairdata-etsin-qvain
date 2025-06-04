{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import { useState } from 'react'
import styled from 'styled-components'
import ReactModal from 'react-modal'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import ErrorBoundary from './errorBoundary'
import { TransparentButton } from './button'

const defaultStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 2,
  },
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    maxHeight: '80vh',
    minWidth: '30vw',
    maxWidth: '600px',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
  },
}

if (BUILD !== 'test') ReactModal.setAppElement('#root')

const Modal = ({
  isOpen,
  contentLabel,
  children,
  labelledBy,
  onAfterOpen = () => {},
  onRequestClose = () => {},
  customStyles = {},
}) => {
  const [clearError, setClearError] = useState()

  const getStyles = () => {
    if (clearError) {
      return defaultStyles
    }

    const overlayStyle = { ...defaultStyles.overlay, ...customStyles.overlay }
    const contentStyle = { ...defaultStyles.content, ...customStyles.content }
    return { overlay: overlayStyle, content: contentStyle }
  }

  const errorCallback = (_error, _info, clearError) => {
    setClearError(clearError)
  }

  const requestClose = () => {
    if (clearError) {
      clearError()
    }
    onRequestClose()
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={onAfterOpen}
      onRequestClose={requestClose}
      style={getStyles()}
      contentLabel={contentLabel}
      aria={{ labelledby: labelledBy }}
    >
      <Translate
        component={CloseButton}
        onClick={onRequestClose}
        noMargin
        attributes={{ 'aria-label': 'qvain.common.close' }}
      >
        <FontAwesomeIcon aria-hidden icon={faTimes} />
      </Translate>
      <ErrorBoundary callback={errorCallback}>{children}</ErrorBoundary>
    </ReactModal>
  )
}

Modal.propTypes = {
  customStyles: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onAfterOpen: PropTypes.func,
  onRequestClose: PropTypes.func,
  contentLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  labelledBy: PropTypes.string,
}

const CloseButton = styled(TransparentButton)`
  position: absolute;
  top: 1em;
  right: 1em;
`

export default Modal
