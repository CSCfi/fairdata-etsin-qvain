import React, { Component } from 'react';

export default class DsContent extends Component {
  accessRights() {
    // this is not the right place to check. type if array
    if (this.props.dataset.access_rights.type.id === 'open_access') {
      return (
        <button className="btn btn-gray" disabled>
          <i className="fa fa-unlock" aria-hidden="true" />
          <span>Open</span>
        </button>
      )
    }
    return (
      <button className="btn btn-gray" disabled>
        <i className="fa fa-lock" aria-hidden="true" />
        <span> Rajattu käyttöoikeus</span>
      </button>
    )
  }

  render() {
    return (
      <div className="dsContent">
        <div className="d-flex align-items-center">
          <h1 className="dataset-title mr-auto">{this.props.title}</h1>
          {this.accessRights()}
        </div>
        <p className="creator">
          {
            this.props.creator.map((creators, i, arr) => <span key={creators.name}>{creators.name}{(i + 1 !== arr.length) ? ', ' : ''}</span>)
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
        <p>
          {this.props.children}
        </p>
      </div>
    );
  }
}
