import React, { Component } from 'react';
import Translate from 'react-translate-component';

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
      (!this.props.children ||
      (Array.isArray(this.props.children) && !this.props.children[0]))
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
