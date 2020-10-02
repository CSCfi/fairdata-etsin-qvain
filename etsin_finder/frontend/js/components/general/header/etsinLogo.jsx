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
import { NavLink } from 'react-router-dom'

import Logo from '../../../../static/images/Etsin_300px.png'

export default class EtsinLogo extends Component {
  state = {}

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <LogoCont to="/">
        <Img alt="Fairdata-Etsin logo" src={Logo} />
      </LogoCont>
    )
  }
}

const LogoCont = styled(NavLink)`
  width: 12em;
`

const Img = styled.img`
  width: 11em;
`
