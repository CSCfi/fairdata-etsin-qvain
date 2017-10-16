import React from 'react';
import { NavLink } from 'react-router-dom';
import Translate from 'react-translate-component';

export default class Navi extends React.Component {
  openNavi(event) {
    if (event.target.classList.contains('open')) {
      event.target.classList.remove('open')
    } else {
      event.target.classList.add('open')
    }
    const navList = document.querySelector('.nav-list')
    if (navList.classList.contains('open')) {
      navList.classList.remove('open')
    } else {
      navList.classList.add('open')
    }
  }

  render() {
    return (
      <div className="navigation">
        <button id="nav-icon" className="btn btn-transparent" onClick={this.openNavi}>
          <span />
          <span />
          <span />
        </button>
        <nav className="nav nav-list">
          <NavLink exact to="/" className="nav-link">
            <Translate content="nav.home" />
          </NavLink>
          <NavLink to="/datasets" className="nav-link">
            <Translate content="nav.datasets" />
          </NavLink>
          <NavLink to="/organizations" className="nav-link">
            <Translate content="nav.organizations" />
          </NavLink>
          <NavLink href="/help" className="nav-link">
            <Translate content="nav.help" />
          </NavLink>
        </nav>
      </div>
    );
  }
}
