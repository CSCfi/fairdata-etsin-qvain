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

import DropdownMenu from './dropdownMenu'
import LangToggle from './langToggle'
import LoginButton from './loginButton'
import { Link } from '../button'
import { useStores } from '@/stores/stores'

const MobileNavi = ({ helpUrl, naviRoutes, children, loginThroughService }) => {
  const { Accessibility } = useStores()
  return (
    <MobileItems>
      <DropdownMenu
        transparent
        buttonContent={<FontAwesomeIcon title="Menu" icon={faBars} size="lg" />}
        transparentButton
      >
        {naviRoutes.map(route => (
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
          <Row>
            {children}
            <LangToggle mobile margin="0.4em 0.4em 0.4em 0em" />
            <Link width="100%" href={helpUrl} rel="noopener noreferrer" target="_blank">
              <Translate content="nav.help" />
            </Link>
          </Row>
        </CustomContainer>
      </DropdownMenu>
      <LoginContainer>
        <LoginButton loginThroughService={loginThroughService} />
      </LoginContainer>
    </MobileItems>
  )
}

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
`

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
