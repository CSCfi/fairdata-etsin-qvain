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

import PropTypes from 'prop-types'
import React from 'react'
import { NavLink } from 'react-router-dom'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCog } from '@fortawesome/free-solid-svg-icons'

import Accessibility from '../../../stores/view/accessibility'
import DropdownMenu from './dropdownMenu'
import LangToggle from './langToggle'
import Login from './loginButton'
import { Link } from '../button'

const MobileNavi = props => (
  <MobileItems>
    <DropdownMenu
      transparent
      buttonContent={<FontAwesomeIcon title="Menu" icon={faBars} size="lg" />}
      transparentButton
    >
      {props.naviRoutes.map(route => (
        <NavItem
          key={route.path}
          exact={route.exact}
          to={route.path}
          onPointerOver={() => {
            if (route.loadableComponent) {
              route.loadableComponent.preload()
            }
          }}
          onClick={() => {
            Accessibility.announce(translate('changepage', { page: translate(route.label) }))
          }}
        >
          <Translate content={route.label} />
        </NavItem>
      ))}
    </DropdownMenu>
    <DropdownMenu
      transparent
      buttonContent={<FontAwesomeIcon title="Settings" icon={faCog} size="lg" />}
      transparentButton
    >
      <CustomContainer>
        {props.children}
        <Row>
          <Link width="100%" href={props.helpUrl} rel="noopener noreferrer" target="_blank">
            <Translate content="nav.help" />
          </Link>
        </Row>
        <Row>
          <LangToggle margin="0.4em 0.4em 0.4em 0em" />
          <Login
            width="100%"
            margin="0.4em 0em 0.4em 0em"
            loginThroughService={props.loginThroughService}
          />
        </Row>
      </CustomContainer>
    </DropdownMenu>
  </MobileItems>
)

MobileNavi.propTypes = {
  helpUrl: PropTypes.string,
  naviRoutes: PropTypes.arrayOf(
    PropTypes.shape({
      loadableComponent: PropTypes.elementType,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      exact: PropTypes.bool,
    })
  ),
  children: PropTypes.node,
  loginThroughService: PropTypes.string,
}

export default MobileNavi

MobileNavi.defaultProps = {
  helpUrl: undefined,
  naviRoutes: [],
  children: null,
  loginThroughService: '',
}

const MobileItems = styled.div`
  display: inline-flex;
  height: 100%;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: none;
  }
`

const Row = styled.div`
  display: inline-flex;
  width: 100%;
  align-items: center;
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

const CustomContainer = styled.div`
  margin: 0 auto;
  padding: 1em 1.3em;
  max-width: 400px;
  width: 100%;
`
