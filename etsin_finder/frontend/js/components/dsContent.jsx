import React, { Component } from 'react';

export default class DsContent extends Component {
  render() {
    return (
      <div className="dsContent">
        <h1>{this.props.title}</h1>
        <p>
          {
            this.props.curator.map(person => {
              return <span key={person.identifier}>{person.name}</span>
            })
          }
        </p>
        {this.props.children}
      </div>
    );
  }
}