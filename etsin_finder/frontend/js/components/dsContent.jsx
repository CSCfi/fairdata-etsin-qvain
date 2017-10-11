import React, { Component } from 'react';

export default class DsContent extends Component {
  render() {
    return (
      <div className="content">
        <h2>{this.props.title}</h2>
        {this.props.children}
      </div>
    );
  }
}