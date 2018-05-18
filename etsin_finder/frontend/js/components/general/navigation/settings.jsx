import React, { Component } from 'react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import UserInfo from './userInfo'
import Button from '../button'
import LangToggle from './langToggle'
// import { VerticalSeparator } from '../separator'

export default class Settings extends Component {
  alertButton() {
    alert('Add dataset')
  }
  render() {
    return (
      <React.Fragment>
        <Positioner>
          <Button noMargin width="max-content" onClick={this.alertButton}>
            <Translate content="addDataset" />
          </Button>
          <LangToggle />
          <UserInfo />
        </Positioner>
      </React.Fragment>
    )
  }
}

const Positioner = styled.div`
  display: none;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: inline-flex;
  }
`
