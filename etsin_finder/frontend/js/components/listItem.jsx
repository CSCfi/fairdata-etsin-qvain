import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ErrorBoundary from './errorBoundary'
import checkDataLang from '../utils/checkDataLang'
import AccessRights from './accessRights'

export default class ListItem extends Component {
  render() {
    console.log(this.props.item)
    return (
      <div className="listItem">
        <Link to={`/dataset/${this.props.item.urn_identifier}`} >
          <div className="content-box">
            <ErrorBoundary>
              <div className="d-flex">
                <h2 className="title">
                  {
                    checkDataLang(this.props.item.title)
                  }
                </h2>
                {this.props.item.access_rights
                  ? <AccessRights access_rights={this.props.item.access_rights} />
                  : null
                }
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <p>
                {this.props.item.description.map(description => (
                  checkDataLang(description)
                ))}
              </p>
            </ErrorBoundary>
          </div>
        </Link>
      </div>
    );
  }
}
