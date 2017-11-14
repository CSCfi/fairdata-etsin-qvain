import React, { Component } from 'react'
import Translate from 'react-translate-component'
import DateFormat from './dateFormat'
import AccessRights from './accessRights'
import checkNested from '../utils/checkNested'
import ErrorBoundary from './errorBoundary'
import Stores from '../stores'

export default class DsContent extends Component {
  render() {
    return (
      <div className="dsContent">
        <div className="d-flex align-items-center dataset-title">
          <h1 className="mr-auto">{this.props.title}</h1>
          <AccessRights access_rights={checkNested(this.props.dataset, 'access_rights', 'type') ? this.props.dataset.access_rights : null} />
        </div>
        <div className="d-flex justify-content-between basic-info">
          <div>
            <ErrorBoundary>
              <p className="creator">
                {
                  this.props.creator.length > 1
                    ? <Translate content="dataset.creator.plrl" />
                    : <Translate content="dataset.creator.snglr" />
                }
                {
                  ': '
                }
                {
                  this.props.creator.map((creators, i, arr) => (
                    typeof creators.name === 'object' ? creators.name[Stores.Locale.currentLang] : <span key={creators.name}>{creators.name}{(i + 1 !== arr.length) ? ', ' : ''}</span>
                  ))
                }
              </p>
            </ErrorBoundary>
            <ErrorBoundary>
              {
                this.props.contributor
                  ?
                    <p className="contributor">
                      {
                        this.props.contributor.length > 1
                        ? <Translate content="dataset.contributor.plrl" />
                        : <Translate content="dataset.contributor.snglr" />
                      }
                      {
                        ': '
                      }
                      {this.props.contributor.map((person, i, arr) => <span key={person.name}>{person.name}{(i + 1 !== arr.length) ? ', ' : ''}</span>)}
                    </p>
                  : null
              }
            </ErrorBoundary>
          </div>
          <p>
            { this.props.issued ? <DateFormat date={this.props.issued} /> : null }
          </p>
        </div>
        <p>
          {this.props.children}
        </p>
      </div>
    );
  }
}
