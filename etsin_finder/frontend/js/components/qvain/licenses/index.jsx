import React, { Component } from 'react'
import Translation from 'react-translate-component'
import Select from '../../general/select'
import AccessType from './accessType'
import Licenses from './licenses'
import styled from 'styled-components'

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
