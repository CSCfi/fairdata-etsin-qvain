import React, { Component } from 'react'
import Translate from 'react-translate-component'

import UserInfo from './userInfo'
import LangToggle from './langToggle'
import Button from '../button'
import { VerticalSeparator } from '../separator'

export default class SecondNav extends Component {
  alertButton() {
    alert('Add dataset')
  }
  render() {
    return (
      <div className="top-nav-right">
        <Button width="max-content" onClick={this.alertButton}>
          <Translate content="addDataset" />
        </Button>
        <LangToggle />
        <VerticalSeparator margin="0em 1em 0 0.5em" height="1.5em" />
        <UserInfo />
      </div>
    )
  }
}
