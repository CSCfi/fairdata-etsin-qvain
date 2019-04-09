import React, { Component } from 'react'
import styled from 'styled-components'
import AccessType from './accessType'
import Licenses from './licenses'

class RightsAndLicenses extends Component {
  render() {
    return (
      <div className="container">
        <RightsAndLicensesTitle>
          <h1>Rights And Licenses</h1>
        </RightsAndLicensesTitle>
        <AccessType />
        <Licenses />
      </div>
    )
  }
}

const RightsAndLicensesTitle = styled.div`
  text-transform: uppercase
`

export default RightsAndLicenses
