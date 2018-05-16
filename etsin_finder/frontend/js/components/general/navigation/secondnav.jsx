import React, { Component } from 'react'
// import Translate from 'react-translate-component'
import styled from 'styled-components'

import UserInfo from './userInfo'
import LangToggle from './langToggle'
// import Button from '../button'
// import { VerticalSeparator } from '../separator'

export default class SecondNav extends Component {
  alertButton() {
    alert('Add dataset')
  }
  render() {
    return (
      <Positioner>
        {/* <Button noMargin width="max-content" onClick={this.alertButton}>
          <Translate content="addDataset" />
        </Button> */}
        <LangToggle />
        <UserInfo />
      </Positioner>
    )
  }
}

const Positioner = styled.div`
  display: inline-flex;
`
