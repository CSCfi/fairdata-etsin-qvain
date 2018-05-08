import React, { Component, Fragment } from 'react'
import Translate from 'react-translate-component'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export default class Tabs extends Component {
  render() {
    return (
      <Fragment>
        {(this.props.showData || this.props.showEvents) && (
          <EtsinTabs className="nav nav-tabs">
            <li className="nav-item">
              <NavLink exact to={`/dataset/${this.props.identifier}`} className="nav-link" replace>
                <Translate content="nav.dataset" fallback="Dataset" />
              </NavLink>
            </li>
            {this.props.showData && (
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
          </EtsinTabs>
        )}
      </Fragment>
    )
  }
}

Tabs.propTypes = {
  showData: PropTypes.bool.isRequired,
  showEvents: PropTypes.bool.isRequired,
  identifier: PropTypes.string.isRequired,
}

/* prettier-ignore */
const EtsinTabs = styled.ul`
  border-bottom-color: ${props => props.theme.color.primary};
  .nav-item {
    &:first-of-type {
      margin-left: 1em;
    }
  }
  .nav-link {
    border-top-right-radius: 0.5em;
    border-top-left-radius: 0.5em;
    transition: all ease-out 0.3s;
    &:not(.active) {
      background-color: transparent;
      color: ${props => props.theme.color.medgray};
      &:hover {
        background-color: ${props => props.theme.color.primary};
        color: white;
      }
    }
    &.active,
    &:hover {
      color: ${props => props.theme.color.primary};
      border-color: ${props => props.theme.color.primary} ${props => props.theme.color.primary} transparent ${props => props.theme.color.primary};
    }
  }
`
