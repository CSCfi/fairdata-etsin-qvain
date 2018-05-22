import React from 'react'
import { NavLink } from 'react-router-dom'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import styled from 'styled-components'

import Accessibility from '../../../stores/view/accessibility'

export default class Navi extends React.Component {
  render() {
    return (
      <React.Fragment>
        {console.log(this.props)}
        <NavItem
          exact
          to="/"
          onClick={() => {
            Accessibility.setNavText(translate('changepage', { page: translate('nav.datasets') }))
          }}
        >
          <Translate content="nav.home" />
        </NavItem>
        <NavItem
          to="/datasets"
          onClick={() => {
            Accessibility.setNavText(translate('changepage', { page: translate('nav.datasets') }))
          }}
        >
          <Translate content="nav.datasets" />
        </NavItem>
        <NavItem
          to="/about"
          onClick={() => {
            Accessibility.setNavText(translate('changepage', { page: translate('nav.help') }))
          }}
        >
          <Translate content="nav.help" />
        </NavItem>
      </React.Fragment>
    )
  }
}

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
    }
  }
  &:hover {
    color: ${p => p.theme.color.primary};
  }
`
