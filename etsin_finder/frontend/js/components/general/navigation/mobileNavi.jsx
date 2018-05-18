import React from 'react'
import { NavLink } from 'react-router-dom'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import styled from 'styled-components'
import FontawesomeIcon from '@fortawesome/react-fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'
import faCog from '@fortawesome/fontawesome-free-solid/faCog'

import Accessibility from '../../../stores/view/accessibility'
import DropdownMenu from './dropdownMenu'
import LangToggle from './langToggle'

export default class MobileNavi extends React.Component {
  render() {
    return (
      <MobileItems>
        <DropdownMenu buttonContent={<FontawesomeIcon icon={faBars} size="lg" />} transparentButton>
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
        </DropdownMenu>
        <DropdownMenu buttonContent={<FontawesomeIcon icon={faCog} size="lg" />} transparentButton>
          <LangToggle />
        </DropdownMenu>
      </MobileItems>
    )
  }
}

const MobileItems = styled.div`
  display: inline-flex;
  height: 100%;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: none;
  }
`

const NavItem = styled(NavLink)`
  margin: 0.8em 1.5em;
  color: ${p => p.theme.color.dark};
  text-transform: uppercase;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  text-decoration: none;
  font-size: 1.1em;
  span {
    position: relative;
  }
  &.active {
    color: ${p => p.theme.color.primary};
    & span::after {
      content: '';
      position: absolute;
      display: block;
      border-bottom: 2px solid ${p => p.theme.color.primary};
      width: 100%;
      bottom: -2px;
    }
  }
  &:hover {
    color: ${p => p.theme.color.primary};
  }
`
