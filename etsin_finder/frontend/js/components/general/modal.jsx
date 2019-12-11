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
import Translate from 'react-translate-component'

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

if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#root');

export default class Modal extends Component {
  static propTypes = {
    customStyles: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    contentLabel: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    customStyles: {},
    onAfterOpen: () => {},
    onRequestClose: () => {},
  }

  constructor(props) {
    super(props)
    const overlayStyle = { ...customStyles.overlay, ...props.customStyles.overlay }
    const contentStyle = { ...customStyles.content, ...props.customStyles.content }
    this.state = {
      styles: { overlay: overlayStyle, content: contentStyle },
    }
  }

  componentWillMount() {
    this.updateBlur()
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen !== prevProps.isOpen) {
      this.updateBlur()
    }
  }

  componentWillUnmount() {
    this.hideBlur()
  }

  showBlur() {
    const root = document.getElementById('root')
    root.classList.add('blur')
  }

  hideBlur() {
    const root = document.getElementById('root')
    root.classList.remove('blur')
  }

  updateBlur() {
    if (this.props.isOpen) {
      this.showBlur()
    } else {
      this.hideBlur()
    }
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onAfterOpen={this.props.onAfterOpen}
        onRequestClose={this.props.onRequestClose}
        style={this.state.styles}
        contentLabel={this.props.contentLabel}
      >
        <CloseButton onClick={this.props.onRequestClose} noMargin>
          <Translate className="sr-only" content="dataset.dl.close_modal" />
          <span aria-hidden>X</span>
        </CloseButton>
        {this.props.children}
      </ReactModal>
    )
  }
}

const CloseButton = styled(TransparentButton)`
  position: absolute;
  top: 1em;
  right: 1em;
`
