import React, { Component } from 'react'
import DateFormat from './data/dateFormat'
import AccessRights from './data/accessRights'
import checkNested from '../../utils/checkNested'
import ErrorBoundary from '../general/errorBoundary'
import Person from './person'

export default class Content extends Component {
  render() {
    return (
      <div className="dsContent">
        <div className="d-flex align-items-center dataset-title">
          <h1 className="mr-auto">{this.props.title}</h1>
          <AccessRights
            access_rights={
              checkNested(this.props.dataset, 'access_rights', 'access_type')
                ? this.props.dataset.access_rights
                : null
            }
          />
        </div>
        <div className="d-flex justify-content-between basic-info">
          <div>
            <ErrorBoundary>
              <Person creator={this.props.creator} />
            </ErrorBoundary>
            <ErrorBoundary>
              <Person contributor={this.props.contributor} />
            </ErrorBoundary>
          </div>
          <p>{this.props.issued ? <DateFormat date={this.props.issued} /> : null}</p>
        </div>
        <p className="description">{this.props.children}</p>
      </div>
    )
  }
}
