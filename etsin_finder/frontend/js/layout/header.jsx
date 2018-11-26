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
import styled from 'styled-components'
import counterpart from 'counterpart'

import EtsinLogo from '../components/general/header/etsinLogo'
import Settings from '../components/general/navigation/settings'
import Navi from '../components/general/navigation/index'
import MobileNavi from '../components/general/navigation/mobileNavi'

export default class Header extends Component {
  constructor() {
    super()
    this.state = {
      lang: counterpart.getLocale(),
    }
    this.localeChanged = this.localeChanged.bind(this)
  }
  componentWillMount() {
    counterpart.onLocaleChange(this.localeChanged)
  }
  componentWillUnmount() {
    counterpart.offLocaleChange(this.localeChanged)
  }
  localeChanged() {
    this.setState({
      lang: counterpart.getLocale(),
    })
  }
  render() {
    const helpUrl =
      this.state.lang === 'fi'
        ? 'https://www.fairdata.fi/etsin/'
        : 'https://www.fairdata.fi/en/etsin/'
    return (
      <HeaderBar>
        <Positioner className="container">
          <EtsinLogo />
          <NaviCont>
            <Navi />
          </NaviCont>
          <Right>
            <MobileNavi helpUrl={helpUrl} />
            <Settings helpUrl={helpUrl} />
          </Right>
        </Positioner>
      </HeaderBar>
    )
  }
}

const HeaderBar = styled.header`
  width: 100%;
  height: 4em;
  background-color: white;
  color: ${p => p.theme.color.dark};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
`

const Positioner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const NaviCont = styled.nav`
  display: none;
  justify-content: center;
  align-items: center;
  height: 100%;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: flex;
  }
`

const Right = styled.nav`
  width: 12em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`
