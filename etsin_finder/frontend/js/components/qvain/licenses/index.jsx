import React, { Component } from 'react'
import AccessType from './accessType'
import Licenses from './licenses'
import { SectionTitle } from '../general/section'

class RightsAndLicenses extends Component {
  render() {
    return (
      <div className="container">
        <SectionTitle>Rights And Licenses</SectionTitle>
        <AccessType />
        <Licenses />
      </div>
    )
  }
}

export default RightsAndLicenses
