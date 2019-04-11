import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import AccessType from './accessType'
import Licenses from './licenses'

const RightsAndLicensesTitle = styled.h2`
  text-transform: uppercase
`

class RightsAndLicenses extends Component {
  render() {
    return (
      <div className="container">
        <Translate component={RightsAndLicensesTitle} content="qvain.rightsAndLicenses.title" />
        <AccessType />
        <Licenses />
      </div>
    )
  }
}

export default RightsAndLicenses
