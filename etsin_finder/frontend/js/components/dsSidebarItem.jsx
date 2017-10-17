import React, { Component } from 'react';
import Translate from 'react-translate-component';

export default class DsSidebarItem extends Component {
  constructor(props) {
    super(props)
    this.state = { component: this.props.component }
  }

  render() {
    if (!this.props.component) {
      this.setState({ component: 'span' })
    }
    if (this.props.hideEmpty && !this.props.children) {
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
