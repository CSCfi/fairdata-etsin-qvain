import React from 'react'
import { NavLink } from 'react-router-dom'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Accessibility from '../../../stores/view/accessibility'
import SecondNav from './secondnav'

export default class Navi extends React.Component {
  static defaultProps = {
    navRef: () => {},
    closeNavi: () => {},
  }
  static propTypes = {
    navRef: PropTypes.func,
    closeNavi: PropTypes.func,
  }
  render() {
    return (
      <div className="row top-nav">
        <NavBar innerRef={this.props.navRef}>
          <SecondNav />
          <nav className="nav nav-list">
            <NavLink
              exact
              to="/"
              className="nav-link"
              onClick={() => {
                this.props.closeNavi()
                Accessibility.setNavText(translate('changepage', { page: translate('nav.home') }))
              }}
            >
              <Translate content="nav.home" />
            </NavLink>
            <NavLink
              to="/datasets"
              className="nav-link"
              onClick={() => {
                this.props.closeNavi()
                Accessibility.setNavText(
                  translate('changepage', { page: translate('nav.datasets') })
                )
              }}
            >
              <Translate content="nav.datasets" />
            </NavLink>
            <NavLink
              to="/about"
              className="nav-link"
              onClick={() => {
                this.props.closeNavi()
                Accessibility.setNavText(translate('changepage', { page: translate('nav.help') }))
              }}
            >
              <Translate content="nav.help" />
            </NavLink>
          </nav>
        </NavBar>
      </div>
    )
  }
}

const NavBar = styled.div`
  width: 100%;
  display: flex;
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s ease;
  flex-direction: column;
  &.open {
    max-height: 200px;
  }
  @media (min-width: ${p => p.theme.breakpoints.md}) {
    align-items: stretch;
    display: inline-flex;
    max-height: initial;
    flex-direction: row-reverse;
    justify-content: space-between;
    overflow: visible;
  }
`
