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

import { createRef, Component } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import PropTypes from 'prop-types'

import Button, { TransparentButton } from '../button'

export default class DropdownMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
    this.content = createRef()
    this.button = createRef()
  }

  onBlur = e => {
    const currentTarget = e.currentTarget
    setTimeout(() => {
      if (
        !currentTarget.contains(document.activeElement) &&
        this.button.current !== document.activeElement
      ) {
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
      <MenuContainer>
        <ButtonContainer>
          {this.props.transparent ? (
            <CustomTransparentButton
              role="button"
              color="primary"
              open={this.state.open}
              ref={this.button}
              aria-pressed={this.state.open}
              onClick={() => (this.state.open ? this.close() : this.open())}
            >
              {this.props.buttonContent}
            </CustomTransparentButton>
          ) : (
            <CustomButton
              role="button"
              color="primary"
              open={this.state.open}
              ref={this.button}
              aria-pressed={this.state.open}
              onClick={() => (this.state.open ? this.close() : this.open())}
            >
              {this.props.buttonContent}
            </CustomButton>
          )}
        </ButtonContainer>
        <Content
          open={this.state.open}
          onClick={this.close}
          ref={this.content}
          tabIndex="-1"
          onBlur={this.onBlur}
        >
          <Container>{this.props.children}</Container>
        </Content>
      </MenuContainer>
    )
  }
}

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 3;
`

const ButtonContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
`

const CustomTransparentButton = styled(TransparentButton)`
  ${p =>
    p.open &&
    `
    &:after {
      content: '';
      position: absolute;
      display: block;
      width: 10px;
      border: 10px solid transparent;
      border-bottom: 10px solid ${p.theme.color.primary};
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      bottom: 0;
      transition: 0.2s ease;
    }
    &:hover:after {
      border-bottom: 10px solid ${darken(0.1, p.theme.color.primary)};
    }`};
`
const CustomButton = styled(Button)`
  white-space: nowrap;
`

const Content = styled.div`
  height: ${p => (p.open ? 'auto' : 0)};
  position: absolute;
  overflow: hidden;
  width: 100%;
  display: ${p => (p.open ? '' : 'none')};
  top: 4em;
  right: 0;
  border: 2px solid ${p => p.theme.color.primary};
  border-right: none;
  border-left: none;
  background-color: white;
  z-index: 2;
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

DropdownMenu.defaultProps = {
  transparent: false,
}

DropdownMenu.propTypes = {
  children: PropTypes.node.isRequired,
  buttonContent: PropTypes.node.isRequired,
  transparent: PropTypes.bool,
}
