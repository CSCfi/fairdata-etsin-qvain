import React, { Component } from 'react'
import styled from 'styled-components'
import RightsAndLicenses from './licenses'

class Qvain extends Component {
  render() {
    return (
      <div>
        <SubHeader>
          <SubHeaderText>Publish Dataset</SubHeaderText>
        </SubHeader>
        <form>
          <RightsAndLicenses />
        </form>
      </div>
    )
  }
}

const SubHeader = styled.div`
  height: 100px;
  background-color: #007fad;
  color: white;
  display: flex;
  align-items: center;
`

const SubHeaderText = styled.div`
  font-family: Lato;
  font-size: 32px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 0.81;
  letter-spacing: normal;
  color: #ffffff;
  margin-left: 47px;
`

export default Qvain
