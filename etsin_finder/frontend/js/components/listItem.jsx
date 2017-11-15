import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ErrorBoundary from './errorBoundary'
import checkDataLang from '../utils/checkDataLang'
import AccessRights from './accessRights'

export default class ListItem extends Component {
  render() {
    return (
      <div className="listItem">
        <Link to={`/dataset/${this.props.item.urn_identifier}`} >
          <div className="content-box">
            <ErrorBoundary>
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="title">
                  {
                    checkDataLang(this.props.item.title, this.props.lang)
                  }
                </h2>
                {this.props.item.access_rights
                  ? <AccessRights access_rights={this.props.item.access_rights} />
                  : null
                }
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <div className="basic-info">
                <p>
                  {
                    this.props.item.field_of_science
                      ? this.props.item.field_of_science.map(field => (
                        checkDataLang(field.label, this.props.lang)
                      )) : null
                  }
                </p>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <p>
                {this.props.item.description.map(description => (
                  checkDataLang(description, this.props.lang)
                ))}
              </p>
            </ErrorBoundary>
          </div>
        </Link>
      </div>
    );
  }
}
