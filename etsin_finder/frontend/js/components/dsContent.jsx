import React, { Component } from 'react'
import DateFormat from './dateFormat'
import AccessRights from './accessRights'
import checkNested from './checkNested'

export default class DsContent extends Component {
  render() {
    return (
      <div className="dsContent">
        <div className="d-flex align-items-center">
          <h1 className="dataset-title mr-auto">{this.props.title}</h1>
          <AccessRights access_rights={checkNested(this.props.dataset, 'access_rights', 'type') ? this.props.dataset.access_rights : null} />
        </div>
        <p className="creator">
          {
            this.props.creator.map((creators, i, arr) => <span key={creators.name}>{creators.name}{(i + 1 !== arr.length) ? ', ' : ''}</span>)
          }
        </p>
        {
          this.props.contributor
            ?
              <p className="contributor">
                {this.props.contributor.map((person, i, arr) => <span key={person.name}>{person.name}{(i + 1 !== arr.length) ? ', ' : ''}</span>)}
              </p>
            : null
        }
        <p>
          { this.props.issued ? <DateFormat date={this.props.issued} /> : null }
        </p>
        <p>
          {this.props.children}
        </p>
      </div>
    );
  }
}
