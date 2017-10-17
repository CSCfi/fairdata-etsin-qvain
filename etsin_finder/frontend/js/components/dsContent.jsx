import React, { Component } from 'react';

export default class DsContent extends Component {
  render() {
    return (
      <div className="dsContent">
        <h1>{this.props.title}</h1>
        <p>
          {
            this.props.creator.map(person => <span key={person.name}>{person.name}</span>)
          }
        </p>
        {
          this.props.contributor
            ?
              <p>{this.props.contributor.map(person =>
                <span key={person.name}>{person.name}</span>)}
              </p>
            : null
        }
        <p>
          {this.props.issued}
        </p>
        {this.props.children}
      </div>
    );
  }
}
