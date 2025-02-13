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
import { NavLink, withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
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

const EtsinTabs = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style: none;
  border-bottom: 0.3rem solid #e0e0e0;
  overflow-x: overlay;
  overflow-y: hidden;
  @media screen and (min-width: ${p => p.theme.breakpoints.md}) {
    overflow: initial;
  }
  .nav-item {
    margin-bottom: -0.25rem;
  }
  .nav-link {
    display: block;
    font-size: 1.1em;
    padding: 0.7rem 2.5rem;
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    transition: all ease-out 0.3s;
    white-space: nowrap;
    &:hover,
    &:focus {
      text-decoration: none;
    }
    &:not(.active) {
      background-color: transparent;
      color: ${props => props.theme.color.superdarkgray};
      &:hover,
      &:focus {
        background-color: rgba(234, 244, 248, 0.4);
        border-bottom: 0.3rem solid ${props => props.theme.color.primary};
        transition: ease-out 0s;
      }
    }
    &.active,
    &:hover,
    &:focus {
      color: black;
    }
    &.active {
      background-color: ${props => props.theme.color.primaryLight};
      border-bottom: 0.3rem solid ${props => props.theme.color.primary};
    }
  }
`

export default withRouter(withStores(observer(Tabs)))
