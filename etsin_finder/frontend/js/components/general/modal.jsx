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

import React, { Component } from 'react'
import styled from 'styled-components'
import ReactModal from 'react-modal'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Translate from '@/utils/Translate'

import ErrorBoundary from './errorBoundary'
import { TransparentButton } from './button'

const customStyles = {
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

export default class Modal extends Component {
  static propTypes = {
    customStyles: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    contentLabel: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    labelledBy: PropTypes.string,
  }

  static defaultProps = {
    customStyles: {},
    onAfterOpen: () => {},
    onRequestClose: () => {},
    labelledBy: undefined,
  }

  state = {
    clearError: null,
  }

  getStyles() {
    if (this.state.clearError) {
      return customStyles
    }

    const overlayStyle = { ...customStyles.overlay, ...this.props.customStyles.overlay }
    const contentStyle = { ...customStyles.content, ...this.props.customStyles.content }
    return { overlay: overlayStyle, content: contentStyle }
  }

  errorCallback = (_error, _info, clearError) => {
    this.setState({ clearError })
  }

  requestClose = () => {
    if (this.state.clearError) {
      this.state.clearError()
    }
    this.props.onRequestClose()
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.props.onAfterOpen}
        onRequestClose={this.requestClose}
        style={this.getStyles()}
        contentLabel={this.props.contentLabel}
        aria={{ labelledby: this.props.labelledBy }}
      >
        <Translate
          component={CloseButton}
          onClick={this.props.onRequestClose}
          noMargin
          attributes={{ 'aria-label': 'qvain.common.close' }}
        >
          <FontAwesomeIcon aria-hidden icon={faTimes} />
        </Translate>
        <ErrorBoundary callback={this.errorCallback}>{this.props.children}</ErrorBoundary>
      </ReactModal>
    )
  }
}

const CloseButton = styled(TransparentButton)`
  position: absolute;
  top: 1em;
  right: 1em;
`
