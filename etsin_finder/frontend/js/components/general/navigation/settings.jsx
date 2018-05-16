import React, { Component } from 'react'
// import Translate from 'react-translate-component'
import styled from 'styled-components'
import FontawesomeIcon from '@fortawesome/react-fontawesome'
import faCog from '@fortawesome/fontawesome-free-solid/faCog'

import UserInfo from './userInfo'
import LangToggle from './langToggle'
import { TransparentButton } from '../button'
// import { VerticalSeparator } from '../separator'

export default class Settings extends Component {
  alertButton() {
    alert('Add dataset')
  }
  render() {
    return (
      <React.Fragment>
        <TransparentButton noMargin>
          <FontawesomeIcon icon={faCog} />
        </TransparentButton>
        <Positioner>
          {/* <Button noMargin width="max-content" onClick={this.alertButton}>
            <Translate content="addDataset" />
          </Button> */}
          <LangToggle />
          <UserInfo />
        </Positioner>
      </React.Fragment>
    )
  }
}

const Positioner = styled.div`
  display: inline-flex;
`
