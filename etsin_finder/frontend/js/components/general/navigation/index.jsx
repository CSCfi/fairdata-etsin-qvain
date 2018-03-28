import React from 'react'
import { NavLink } from 'react-router-dom'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import Accessibility from 'Stores/view/accessibility'
import SecondNav from './secondnav'

export default class Navi extends React.Component {
  constructor() {
    super()

    this.openNavi = this.openNavi.bind(this)
  }
  openNavi() {
    if (this.navIcon.classList.contains('open')) {
      this.navIcon.classList.remove('open')
    } else {
      this.navIcon.classList.add('open')
    }
    if (this.navList.classList.contains('open')) {
      this.navList.classList.remove('open')
    } else {
      this.navList.classList.add('open')
    }
  }

  render() {
    return (
      <div className="row top-nav">
        <button
          id="nav-icon"
          className="btn btn-transparent"
          name="Navigation"
          aria-label="Navigation"
          ref={button => {
            this.navIcon = button
          }}
          onClick={this.openNavi}
        >
          <span />
          <span />
          <span />
        </button>
        <div
          className="navigation"
          ref={list => {
            this.navList = list
          }}
        >
          <nav className="nav nav-list">
            <NavLink
              exact
              to="/"
              className="nav-link"
              onClick={() => {
                this.openNavi()
                Accessibility.setNavText(translate('changepage', { page: translate('nav.home') }))
              }}
            >
              <Translate content="nav.home" />
            </NavLink>
            <NavLink
              to="/datasets"
              className="nav-link"
              onClick={() => {
                this.openNavi()
                Accessibility.setNavText(
                  translate('changepage', { page: translate('nav.datasets') })
                )
              }}
            >
              <Translate content="nav.datasets" />
            </NavLink>
            <NavLink
              to="/organizations"
              className="nav-link"
              onClick={() => {
                this.openNavi()
                Accessibility.setNavText(
                  translate('changepage', { page: translate('nav.organizations') })
                )
              }}
            >
              <Translate content="nav.organizations" />
            </NavLink>
            <NavLink
              to="/about"
              className="nav-link"
              onClick={() => {
                this.openNavi()
                Accessibility.setNavText(translate('changepage', { page: translate('nav.help') }))
              }}
            >
              <Translate content="nav.help" />
            </NavLink>
          </nav>
          <SecondNav />
        </div>
      </div>
    )
  }
}
