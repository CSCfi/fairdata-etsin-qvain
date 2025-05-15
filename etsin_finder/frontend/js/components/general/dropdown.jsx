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
import { tint } from 'polished'
import Translate from '@/utils/Translate'

import Button from './button'
import withCustomProps from '@/utils/withCustomProps'

export class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
    this.content = React.createRef()
    this.container = React.createRef()
    this.listenersAdded = false
  }

  componentDidUpdate() {
    if (this.state.open) {
      this.addListeners()
    } else {
      this.removeListeners()
    }
  }

  updatePosition = () => {
    if (!this.content.current || !this.container.current) {
      return
    }
    const list = this.content.current
    const containerRect = this.container.current.getBoundingClientRect()

    let listHeight = list.offsetHeight
    const listWidth = list.offsetWidth
    if (listHeight === 0) {
      // If the list has display: none, it doesn't have a height.
      // Temporarily make list displayed but hidden so the height can be computed.
      const oldVisibility = list.style.visibility
      const oldDisplay = list.style.display
      list.style.visibility = 'hidden'
      list.style.display = 'block'
      listHeight = list.offsetHeight
      list.style.display = oldDisplay
      list.style.visibility = oldVisibility
    }

    // move dropdown above button if it doesn't fit below
    const pageHeight = document.documentElement.clientHeight
    if (containerRect.bottom + listHeight < pageHeight) {
      list.style.top = `${containerRect.bottom}px`
    } else {
      list.style.top = `${containerRect.top - listHeight}px`
    }

    // position dropdown horizontally, keep inside window
    const margin = 5 // margin from edge of window
    const pageWidth = document.documentElement.clientWidth
    let left
    if (this.props.align === 'right') {
      left = containerRect.left
    } else if (this.props.align === 'left') {
      left = containerRect.right - listWidth
    } else { // center
      left = (containerRect.left + containerRect.right) / 2 - listWidth / 2
    }
    left = Math.max(margin, Math.min(pageWidth - listWidth - margin, left))
    list.style.left = `${left}px`
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
        this.updatePosition()
      }
    )
  }

  close = () => {
    this.setState({
      open: false,
    })
  }

  onClick = e => {
    e.stopPropagation()
    if (this.state.open) {
      this.close()
    } else {
      this.open()
    }
  }

  addListeners() {
    if (this.listenersAdded) {
      return
    }
    window.addEventListener('scroll', this.updatePosition)
    window.addEventListener('resize', this.updatePosition)
    this.listenersAdded = true
  }

  removeListeners() {
    if (!this.listenersAdded) {
      return
    }
    window.removeEventListener('scroll', this.updatePosition)
    window.removeEventListener('resize', this.updatePosition)
    this.listenersAdded = false
  }

  render() {
    const ButtonComponent = this.props.buttonComponent
    return (
      <DropdownContainer ref={this.container} onBlur={this.onBlur} aria-haspopup="true">
        <ButtonWrapper>
          <Translate
            role="button"
            component={ButtonComponent}
            open={this.state.open}
            aria-pressed={this.state.open}
            with={this.props.with}
            onClick={this.onClick}
            attributes={{
              'aria-label':
                typeof this.props.buttonContent === 'string' ? this.props.buttonContent : undefined,
            }}
            {...this.props.buttonProps}
          >
            {this.props.buttonContent &&
              (typeof this.props.buttonContent === 'string' ? (
                <Translate content={this.props.buttonContent} with={this.props.with} />
              ) : (
                this.props.buttonContent
              ))}
            {this.props.icon && <Icon icon={this.props.icon} />}
          </Translate>
        </ButtonWrapper>
        <Content
          role="menu"
          ref={this.content}
          open={this.state.open}
          onClick={this.close}
          tabIndex="-1"
        >
          {this.props.children}
        </Content>
      </DropdownContainer>
    )
  }
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`

const DropdownContainer = styled.div`
  position: relative;
`

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
  position: fixed;
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
  buttonContent: PropTypes.node,
  with: PropTypes.object,
  buttonComponent: PropTypes.elementType,
  buttonProps: PropTypes.object,
  icon: PropTypes.object,
  align: PropTypes.oneOf(['left', 'center', 'right']),
}

Dropdown.defaultProps = {
  icon: faCaretDown,
  buttonContent: null,
  with: undefined,
  buttonComponent: CustomButton,
  buttonProps: {},
  align: 'center',
}

export const DropdownItem = ({ onlyNarrow, children, ...props }) => (
  <DropdownItemLi onlyNarrow={onlyNarrow}>
    <DropdownItemButton {...props}>{children}</DropdownItemButton>
  </DropdownItemLi>
)

DropdownItem.propTypes = {
  onlyNarrow: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

DropdownItem.defaultProps = {
  onlyNarrow: false,
}

const DropdownItemLi = withCustomProps(styled.li)`
  ${p =>
    p.onlyNarrow &&
    `
    display: block;
    @media screen and (min-width: ${p.theme.breakpoints.lg}) {
      display: none;
    }
    `}
`

export const DropdownItemButton = withCustomProps(styled.button).attrs({ type: 'button' })`
  width: 100%;
  border: none;
  ${p => (p.border === 'top' || p.border === 'both') && `border-top: 1px solid rgba(0, 0, 0, 0.4);`}
  ${p =>
    (p.border === 'bottom' || p.border === 'both') && `border-top: 1px solid rgba(0, 0, 0, 0.4);`}
  background: none;
  color: ${p => (p.disabled ? p.theme.color.gray : p.theme.color.dark)};
  :not(:disabled) {
    :hover,
    :focus {
      background: ${p => p.theme.color.lightgray};
    }
  }
  padding: 0.5rem 1rem;
  text-align: left;

  ${p =>
    p.danger &&
    `
    color: ${p.disabled ? tint(0.65, '#cc0000') : '#cc0000'};
    :not(:disabled) {
      :hover, :focus {
        background: #ffb2b2;
      }
    }
  `};
`
