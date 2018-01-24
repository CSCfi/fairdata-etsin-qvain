import React, { Component } from 'react';

export default class HeroBanner extends Component {
  constructor(props) {
    super(props)
    this.state = { classes: '' }
  }
  componentWillMount() {
    if (this.props.className) {
      this.setState({ classes: this.props.className })
    }
  }
  render() {
    return (
      <div className={`hero ${this.state.classes}`}>
        {this.props.children}
      </div>
    );
  }
}
