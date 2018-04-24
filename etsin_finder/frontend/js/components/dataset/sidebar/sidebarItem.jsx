import React, { Component } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

export default class SidebarItem extends Component {
  constructor(props) {
    super(props)
    let component = this.props.component
    if (!component) {
      component = 'p'
    }
    this.state = { component }
  }

  render() {
    if (!this.props.component) {
      this.setState({ component: 'span' })
    }
    if (
      this.props.hideEmpty &&
      (!this.props.children || (Array.isArray(this.props.children) && !this.props.children[0]))
    ) {
      return null
    }
    return (
      <div>
        <Translate content={this.props.trans} fallback={this.props.fallback} component="h4" />
        {React.createElement(this.state.component, null, this.props.children)}
      </div>
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
