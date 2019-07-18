import React, { Component } from 'react'
import Translate from 'react-translate-component'
import AccessType from './accessType'
import Licenses from './licenses'
import { SectionTitle } from '../general/section'

class RightsAndLicenses extends Component {
  render() {
    return (
      <div className="container">
        <Translate component={SectionTitle} content="qvain.rightsAndLicenses.title" />
        <Licenses />
        <AccessType />
      </div>
    )
  }
}

export default RightsAndLicenses
