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
import FontawesomeIcon from '@fortawesome/react-fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'
import faCog from '@fortawesome/fontawesome-free-solid/faCog'

import Accessibility from '../../../stores/view/accessibility'
import DropdownMenu from './dropdownMenu'
import LangToggle from './langToggle'
import Login from './loginButton'
import { Link } from '../button'

export default class MobileNavi extends React.Component {
  render() {
    return (
      <MobileItems>
        <DropdownMenu buttonContent={<FontawesomeIcon icon={faBars} size="lg" />} transparentButton>
          <NavItem
            exact
            to="/"
            onClick={() => {
              Accessibility.announce(translate('changepage', { page: translate('nav.datasets') }))
            }}
          >
            <Translate content="nav.home" />
          </NavItem>
          <NavItem
            to="/datasets"
            onClick={() => {
              Accessibility.announce(translate('changepage', { page: translate('nav.datasets') }))
            }}
          >
            <Translate content="nav.datasets" />
          </NavItem>
        </DropdownMenu>
        <DropdownMenu buttonContent={<FontawesomeIcon icon={faCog} size="lg" />} transparentButton>
          <CustomContainer>
            <Row>
              <LangToggle inverted margin="0.4em 0.4em 0.4em 0em" />
              <Link
                width="100%"
                margin="0.4em 0em 0.4em 0.4em"
                href="https://qvain.fairdata.fi"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Translate content="nav.addDataset" />
              </Link>
            </Row>
            <Row>
              <Link
                margin="0.4em 0"
                width="100%"
                href={this.props.helpUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Translate content="nav.help" />
              </Link>
            </Row>
            <Row>
              <Login width="100%" margin="0.4em 0" />
            </Row>
          </CustomContainer>
        </DropdownMenu>
      </MobileItems>
    )
  }
}

MobileNavi.defaultProps = {
  helpUrl: undefined,
}

MobileNavi.propTypes = {
  helpUrl: PropTypes.string,
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
