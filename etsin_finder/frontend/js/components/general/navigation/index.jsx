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

import React from 'react'
import { NavLink } from 'react-router-dom'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Home, Search } from '../../../routes'

class Navi extends React.Component {
  render() {
    const Accessibility = this.props.Stores.Accessibility
    const SearchFilters = this.props.Stores.SearchFilters
    return (
      <React.Fragment>
        <NavItem
          exact
          to="/"
          onPointerOver={() => {
            Home.preload()
          }}
          onClick={() => {
            Accessibility.announce(translate('changepage', { page: translate('nav.datasets') }))
            SearchFilters.closeFilters()
          }}
        >
          <Translate content="nav.home" />
        </NavItem>
        <NavItem
          to="/datasets"
          onPointerOver={() => {
            Search.preload()
          }}
          onClick={() => {
            Accessibility.announce(translate('changepage', { page: translate('nav.datasets') }))
          }}
        >
          <Translate content="nav.datasets" />
        </NavItem>
      </React.Fragment>
    )
  }
}

Navi.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(Navi))

const NavItem = styled(NavLink)`
  margin: 0 1.5em;
  color: ${p => p.theme.color.dark};
  text-transform: uppercase;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  text-decoration: none;
  &.active {
    color: ${p => p.theme.color.primary};
    &::after {
      content: '';
      position: absolute;
      display: block;
      border: 8px solid transparent;
      border-bottom: 8px solid ${p => p.theme.color.primary};
      bottom: 0;
      right: 0;
      left: 0;
      margin-left: auto;
      margin-right: auto;
      width: 16px;
    }
  }
  &:hover {
    color: ${p => p.theme.color.primary};
  }
`
