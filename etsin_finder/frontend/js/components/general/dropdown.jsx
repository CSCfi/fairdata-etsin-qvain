import React, { Component } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import PropTypes from 'prop-types'

import Button from './button'

export default class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
    this.content = React.createRef()
  }

  onBlur = () => {
    this.close()
  }

  open = () => {
    console.log('open')
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
    console.log('close')
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
        <CustomButton
          role="button"
          open={this.state.open}
          aria-pressed={this.state.open}
          onClick={() => (this.state.open ? this.close() : this.open())}
        >
          <span className="sr-only">Open user </span>Profile
        </CustomButton>
        <div
          style={{
            position: 'relative',
          }}
        >
          <Content open={this.state.open} innerRef={this.content} tabIndex="-1">
            <Container onBlur={this.onBlur}>{this.props.children}</Container>
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

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
}
