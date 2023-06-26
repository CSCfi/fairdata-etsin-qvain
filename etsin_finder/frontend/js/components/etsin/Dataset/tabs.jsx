{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import Translate from 'react-translate-component'
import { NavLink, withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withStores } from '@/stores/stores'

class Tabs extends Component {
  render() {
    const {
      Etsin: {
        EtsinDataset: { identifier },
      },
    } = this.props.Stores

    let query = ''
    const params = new URLSearchParams(this.props.location.search)
    if (params.get('preview') === '1') {
      query = '?preview=1'
    }

    return (
      <EtsinTabs className="nav nav-tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <NavLink
            exact
            replace
            to={`/dataset/${identifier}${query}`}
            id="tab-for-description"
            aria-controls="tab-description"
            role="tab"
            className="nav-link"
            aria-selected={this.props.location.pathname === `/dataset/${identifier}${query}`}
          >
            <Translate content="nav.dataset" fallback="Dataset" />
          </NavLink>
        </li>
        {this.props.showData && (
          <li className="nav-item" role="presentation">
            <NavLink
              exact
              replace
              to={`/dataset/${identifier}/data${query}`}
              id="tab-for-data"
              aria-controls="tab-data"
              role="tab"
              className="nav-link"
              aria-selected={this.props.location.pathname === `/dataset/${identifier}/data${query}`}
            >
              <Translate content="nav.data" fallback="Data" />
            </NavLink>
          </li>
        )}
        {this.props.showEvents && (
          <li className="nav-item" role="presentation">
            <NavLink
              exact
              replace
              to={`/dataset/${identifier}/events${query}`}
              id="tab-for-events"
              aria-controls="tab-events"
              role="tab"
              className="nav-link"
              aria-selected={
                this.props.location.pathname === `/dataset/${identifier}/events${query}`
              }
            >
              <Translate content="nav.events" fallback="Identifiers and events" />
            </NavLink>
          </li>
        )}
        {this.props.showMaps && (
          <li className="nav-item" role="presentation">
            <NavLink
              exact
              replace
              to={`/dataset/${identifier}/maps${query}`}
              id="tab-for-maps"
              aria-controls="tab-maps"
              role="tab"
              className="nav-link"
              aria-selected={this.props.location.pathname === `/dataset/${identifier}/maps${query}`}
            >
              <Translate content="nav.maps" fallback="Maps" />
            </NavLink>
          </li>
        )}
      </EtsinTabs>
    )
  }
}

Tabs.propTypes = {
  Stores: PropTypes.object.isRequired,
  showData: PropTypes.bool.isRequired,
  showEvents: PropTypes.bool.isRequired,
  showMaps: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
}

/* prettier-ignore */
const EtsinTabs = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  padding-left: 0;
  margin-bottom: 1em;
  list-style: none;
  border-bottom: 1px solid ${props => props.theme.color.primary};
  margin-top: 5px;
  overflow-x: overlay;
  overflow-y: hidden;
  @media screen and (min-width: ${p => p.theme.breakpoints.md}) {
    overflow: initial;
  }
  .nav-item {
    margin-bottom: -1px;
    &:first-of-type {
      margin-left: 1em;
    }
  }
  .nav-link {
    display: block;
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    border-top-right-radius: 0.5em;
    border-top-left-radius: 0.5em;
    transition: all ease-out 0.3s;
    white-space: nowrap;
    &:hover, &:focus {
      text-decoration: none;
    }
    &:not(.active) {
      background-color: transparent;
      color: ${props => props.theme.color.darkgray};
      &:hover {
        background-color: ${props => props.theme.color.primary};
        color: white;
      }
    }
    &.active,
    &:hover,
    &:focus {
      color: ${props => props.theme.color.primary};
      border-color: ${props => props.theme.color.primary} ${props => props.theme.color.primary} transparent ${props => props.theme.color.primary};
    }
    &.active {
      background-color: white;
    }
  }
`

export default withRouter(withStores(observer(Tabs)))
