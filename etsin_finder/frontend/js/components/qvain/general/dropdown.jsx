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
import PropTypes from 'prop-types'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Translate from 'react-translate-component'

import Button from '../../general/button'

export class Dropdown extends Component {
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

  onClick = () => {
    if (this.state.open) {
      this.close()
    } else {
      this.open()
    }
  }

  render() {
    const ButtonComponent = this.props.buttonComponent
    return (
      <div
        style={{
          position: 'relative',
          flexGrow: 1,
        }}
        onBlur={this.onBlur}
      >
        <div style={{ display: 'flex' }}>
          <ButtonComponent
            role="button"
            open={this.state.open}
            aria-pressed={this.state.open}
            onClick={this.onClick}
          >
            <Translate content={this.props.buttonContent} />
            {this.props.icon && <Icon icon={this.props.icon} />}
          </ButtonComponent>
        </div>
        <Content ref={this.content} open={this.state.open} tabIndex="-1">
          {this.props.children}
        </Content>
      </div>
    )
  }
}

const CustomButton = styled(Button)`
  position: relative;
  display: flex;
  align-items: center;
`

const Icon = styled(FontAwesomeIcon)`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`

const Content = styled.ul`
  height: ${p => (p.open ? 'auto' : 0)};
  position: absolute;
  overflow: hidden;
  display: ${p => (p.open ? '' : 'none')};
  right: 0;
  top: 100%;
  margin-top: 0em;
  border-radius: 0.3em;
  background-color: white;
  z-index: 2;
  &:after {
    content: '';
    display: table;
    clear: both;
  }
  min-width: 6em;
  width: max-content;
  box-shadow: 0px 1px 3px 0px ${p => p.theme.color.insetdark};
`

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  buttonContent: PropTypes.node.isRequired,
  buttonComponent: PropTypes.object,
  icon: PropTypes.object,
}

Dropdown.defaultProps = {
  icon: faCaretDown,
  buttonComponent: CustomButton,
}

export const DropdownItem = ({ children, ...props }) => (
  <li>
    <DropdownItemButton {...props}>{children}</DropdownItemButton>
  </li>
)

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
}

export const DropdownItemButton = styled.button`
  width: 100%;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  background: none;
  &:hover,
  &:focus {
    background: ${p => p.theme.color.lightgray};
  }
  padding: 0.5rem 1rem;
  text-align: left;

  ${p => p.danger && `
    color: #cc0000;
    &:hover,
    &:focus {
      background: #ffb2b2;
    }
  `};
`
