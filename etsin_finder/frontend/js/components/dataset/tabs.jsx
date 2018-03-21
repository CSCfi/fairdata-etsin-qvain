import React, { Component, Fragment } from 'react'
import Translate from 'react-translate-component'
import { NavLink } from 'react-router-dom'

export default class Tabs extends Component {
  render() {
    return (
      <Fragment>
        {(this.props.showDownloads || this.props.showEvents) && (
          <ul className="nav nav-tabs etsin-tabs">
            <li className="nav-item">
              <NavLink exact to={`/dataset/${this.props.identifier}`} className="nav-link" replace>
                <Translate content="nav.dataset" fallback="Dataset" />
              </NavLink>
            </li>
            {this.props.showDownloads && (
              <li className="nav-item">
                <NavLink
                  exact
                  to={`/dataset/${this.props.identifier}/data`}
                  className="nav-link"
                  replace
                >
                  <Translate content="nav.data" fallback="Data" />
                </NavLink>
              </li>
            )}
            {this.props.showEvents && (
              <li className="nav-item">
                <NavLink
                  exact
                  to={`/dataset/${this.props.identifier}/events`}
                  className="nav-link"
                  replace
                >
                  <Translate content="nav.events" fallback="Identifiers and events" />
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </Fragment>
    )
  }
}
