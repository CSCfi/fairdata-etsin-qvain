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
import React, { Component } from 'react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import Login from './loginButton'
import { Link } from '../button'
import LangToggle from './langToggle'
// import { VerticalSeparator } from '../separator'

export default class Settings extends Component {
  render() {
    return (
      <React.Fragment>
        <Positioner>
          <Link
            margin="0em 1em 0em 0em"
            width="max-content"
            href={this.props.helpUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Translate content="nav.help" />
          </Link>
          <Link
            noMargin
            width="max-content"
            href="https://qvain.fairdata.fi"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Translate content="nav.addDataset" />
          </Link>
          <LangToggle margin="0em 0em 0em 0.4em" />
          <Login />
        </Positioner>
      </React.Fragment>
    )
  }
}

Settings.defaultProps = {
  helpUrl: undefined,
}

Settings.propTypes = {
  helpUrl: PropTypes.string,
}

const Positioner = styled.div`
  display: none;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: inline-flex;
  }
`
