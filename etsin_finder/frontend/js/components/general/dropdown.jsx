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
import { darken } from 'polished'
import PropTypes from 'prop-types'

import Button, { TransparentButton } from './button'

export default class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
    this.content = React.createRef()
  }

  onBlur = e => {
    const currentTarget = e.currentTarget
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.close()
      }
    }, 0)
  }

  open = () => {
    this.setState(
      {
        open: true,
      },
      () => {
        this.content.current.focus()
      }
    )
  }

  close = () => {
    this.setState({
      open: false,
    })
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          width: 'max-content',
        }}
      >
        {this.props.transparentButton ? (
          <CustomTransparentButton
            role="button"
            open={this.state.open}
            aria-pressed={this.state.open}
            onClick={() => (this.state.open ? this.close() : this.open())}
          >
            {this.props.buttonContent}
          </CustomTransparentButton>
        ) : (
          <CustomButton
            role="button"
            open={this.state.open}
            aria-pressed={this.state.open}
            onClick={() => (this.state.open ? this.close() : this.open())}
          >
            {this.props.buttonContent}
          </CustomButton>
        )}
        <div
          style={{
            position: 'relative',
          }}
        >
          <Content
            open={this.state.open}
            innerRef={this.content}
            tabIndex="-1"
            onBlur={this.onBlur}
          >
            <Container>{this.props.children}</Container>
          </Content>
        </div>
      </div>
    )
  }
}

const CustomButton = styled(Button)`
  position: relative;
  ${p =>
    p.open &&
    `
    &:after {
      bottom: -20px;
      content: '';
      position: absolute;
      display: block;
      width: 10px;
      border: 10px solid transparent;
      border-top: 10px solid ${p.theme.color.primary};
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      transition: 0.2s ease;
    }
    &:hover:after {
      border-top: 10px solid ${darken(0.1, p.theme.color.primary)};
    }`};
`

const CustomTransparentButton = styled(TransparentButton)`
  position: relative;
  ${p =>
    p.open &&
    `
    &:after {
      bottom: -20px;
      content: '';
      position: absolute;
      display: block;
      width: 10px;
      border: 10px solid transparent;
      border-top: 10px solid ${p.theme.color.primary};
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      transition: 0.2s ease;
    }
    &:hover:after {
      border-top: 10px solid ${darken(0.1, p.theme.color.primary)};
    }`};
`

const Content = styled.div`
  height: ${p => (p.open ? 'auto' : 0)};
  position: absolute;
  overflow: hidden;
  display: ${p => (p.open ? '' : 'none')};
  top: 0;
  right: 0;
  margin-top: 0.4em;
  border-radius: 0.3em;
  background-color: white;
  z-index: 2;
  /* border: ${p => (p.open ? '1px' : 0)} solid ${p => p.theme.color.dark}; */
  &:after {
    content: '';
    display: table;
    clear: both;
  }
  width: 12em;
  box-shadow: 0px 1px 3px 0px ${p => p.theme.color.insetdark};
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

Dropdown.defaultProps = {
  transparentButton: false,
}

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  buttonContent: PropTypes.node.isRequired,
  transparentButton: PropTypes.bool,
}
