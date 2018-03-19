import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import checkDataLang from 'Utils/checkDataLang'
import ErrorBoundary from '../../general/errorBoundary'
import AccessRights from '../../dataset/data/accessRights'

export default class ListItem extends Component {
  shortDescription(string) {
    // shortens description to 500
    if (string.length > 500) {
      let trimmed = string.substring(0, 499)
      // checks that words haven't been cut
      trimmed = `${trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')))}...`
      return trimmed
    }
    return string
  }
  render() {
    return (
      <div className="listItem">
        <ErrorBoundary>
          <Link to={`/dataset/${this.props.item.preferred_identifier}`}>
            <div className="content-box">
              <ErrorBoundary>
                <div className="d-flex justify-content-between align-items-start item-header">
                  <h2 className="title">{checkDataLang(this.props.item.title, this.props.lang)}</h2>
                  <AccessRights
                    access_rights={this.props.item.access_rights}
                    style={{ marginBottom: '1em' }}
                  />
                </div>
              </ErrorBoundary>
              <ErrorBoundary>
                {Array.isArray(this.props.item.field_of_science) && (
                  <div className="basic-info">
                    <p>
                      {this.props.item.field_of_science.map(field =>
                        checkDataLang(field.pref_label)
                      )}
                    </p>
                  </div>
                )}
              </ErrorBoundary>
              <ErrorBoundary>
                <p>
                  {this.shortDescription(
                    this.props.item.description.map(description =>
                      checkDataLang(description, this.props.lang)
                    )[0]
                  )}
                </p>
              </ErrorBoundary>
            </div>
          </Link>
        </ErrorBoundary>
      </div>
    )
  }
}
