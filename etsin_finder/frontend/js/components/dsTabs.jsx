import React, { Component } from 'react'
import Translate from 'react-translate-component'
import { NavLink } from 'react-router-dom'

export default class DsTabs extends Component {
  constructor(props) {
    super(props)
    console.log(this.props.identifier)
  }
  render() {
    return (
      <ul className="nav nav-tabs etsin-tabs">
        <li className="nav-item">
          <NavLink exact to={`/dataset/${this.props.identifier}`} className="nav-link">
            <Translate content="nav.dataset" fallback="Dataset" />
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink exact to={`/dataset/${this.props.identifier}/data`} className="nav-link">
            <Translate content="nav.data" fallback="Data" />
          </NavLink>
        </li>
      </ul>
    );
  }
}
