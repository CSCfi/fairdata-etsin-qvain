import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

export default class SidebarItem extends Component {
  constructor(props) {
    super(props)
    let component = this.props.component
    if (!component) {
      component = 'span'
    }
    this.state = { component }
  }

  render() {
    if (
      this.props.hideEmpty &&
      (!this.props.children || (Array.isArray(this.props.children) && !this.props.children[0]))
    ) {
      return null
    }
    return (
      <Spacer>
        {this.props.trans && (
          <Translate content={this.props.trans} fallback={this.props.fallback} component="h4" />
        )}
        {React.createElement(this.state.component, null, this.props.children)}
      </Spacer>
    )
  }
}

SidebarItem.defaultProps = {
  component: '',
  hideEmpty: undefined,
  fallback: undefined,
  children: undefined,
  trans: undefined,
}

SidebarItem.propTypes = {
  component: PropTypes.string,
  hideEmpty: PropTypes.string,
  children: PropTypes.node,
  trans: PropTypes.string,
  fallback: PropTypes.string,
}

const Spacer = styled.div`
  padding: 0 1.4em;
  @media screen and (min-width: ${p => p.theme.breakpoints.md}) {
    padding: 0 1.6em;
  }
  margin-bottom: 1rem;
  & > div {
    font-size: 0.92em;
  }
  &:last-of-type {
    margin-bottom: 0;
  }
`
