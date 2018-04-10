import React, { Component } from 'react'
import Translate from 'react-translate-component'
import LangToggle from './langToggle'
import Button from '../button'

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
      </div>
    )
  }
}
