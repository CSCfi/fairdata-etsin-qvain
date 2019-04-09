import React, { Component } from 'react'
import styled from 'styled-components'
import AccessType from './accessType'
import Licenses from './licenses'

class RightsAndLicenses extends Component {
  render() {
    return (
      <div className="container">
        <RightsAndLicensesTitle>Rights And Licenses</RightsAndLicensesTitle>
        <AccessType />
        <Licenses />
      </div>
    )
  }
}

const RightsAndLicensesTitle = styled.h2`
  text-transform: uppercase
`

export default RightsAndLicenses
