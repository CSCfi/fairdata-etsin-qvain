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
import { NavLink } from 'react-router-dom'

import Login from './loginButton'
import { Link } from '../button'
import LangToggle from './langToggle'
import DropdownMenu from './dropdownMenu'
import { VerticalSeparator } from '../separator'

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
          <DropdownMenu transparent={false} buttonContent={<Translate content="nav.addDataset" />}>
            <CustomContainer>
              <Row>
                <Link
                  width="100%"
                  margin="0.4em 0em 0.4em 0.4em"
                  href="https://qvain.fairdata.fi"
                  rel="noopener noreferrer"
                  target="_blank"
                >Qvain
                </Link>
              </Row>
              <VerticalSeparator />
              <Row>
                <QvainNavLink
                  width="100%"
                  margin="0.4em 0em 0.4em 0.4em"
                  to="/qvain"
                >Qvain Light
                </QvainNavLink>
              </Row>
            </CustomContainer>
          </DropdownMenu>
          <LangToggle margin="0em 0em 0em 0em" />
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
  align-items: center;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: flex;
  }
`

const CustomContainer = styled.div`
  margin: 0 auto;
  padding: 1em 1.3em;
  max-width: 400px;
  width: 100%;
`

const QvainNavLink = Link.withComponent(NavLink)

const Row = styled.div`
  display: inline-flex;
  width: 100%;
`
