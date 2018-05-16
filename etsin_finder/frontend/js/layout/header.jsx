import React, { Component } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import Translate from 'react-translate-component'

import EtsinLogo from '../../static/images/Etsin_300px.png'
import SecondNav from '../components/general/navigation/secondnav'

export default class Header extends Component {
  state = {}
  render() {
    return (
      <HeaderBar>
        <Positioner className="container">
          <LogoCont>
            <Img alt="Fairdata-Etsin logo" src={EtsinLogo} />
          </LogoCont>
          <NaviCont>
            <NavItem
              exact
              to="/"
              // onClick={() => {
              //   // this.props.closeNavi()
              //   // Accessibility.setNavText(
              //   //   translate('changepage', { page: translate('nav.datasets') })
              //   // )
              // }}
            >
              <Translate content="nav.home" />
            </NavItem>
            <NavItem
              to="/datasets"
              // onClick={() => {
              //   // this.props.closeNavi()
              //   // Accessibility.setNavText(
              //   //   translate('changepage', { page: translate('nav.datasets') })
              //   // )
              // }}
            >
              <Translate content="nav.datasets" />
            </NavItem>
            <NavItem
              to="/about"
              // onClick={() => {
              //   // this.props.closeNavi()
              //   // Accessibility.setNavText(translate('changepage', { page: translate('nav.help') }))
              // }}
            >
              <Translate content="nav.help" />
            </NavItem>
          </NaviCont>
          <Right>
            <SecondNav />
          </Right>
        </Positioner>
      </HeaderBar>
    )
  }
}

const HeaderBar = styled.div`
  width: 100%;
  height: 4em;
  background-color: white;
  color: ${p => p.theme.color.dark};
  display: flex;
  justify-content: center;
`

const Positioner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const LogoCont = styled.div`
  width: 12em;
`

const Img = styled.img`
  width: 11em;
`

const NaviCont = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const Right = styled.div`
  width: 12em;
  display: flex;
  justify-content: flex-end;
`

const NavItem = styled(NavLink)`
  margin: 0 1.5em;
  color: ${p => p.theme.color.dark};
  text-transform: uppercase;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
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
