import React, { Component } from 'react'
import styled from 'styled-components'
import RightsAndLicenses from './licenses'
import Description from './description';
import Participants from './participants'

class Qvain extends Component {
  render() {
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderText>Publish Dataset</SubHeaderText>
        </SubHeader>
        <form className="container">
          <Description />
          <RightsAndLicenses />
          <Participants />
        </form>
      </QvainContainer>
    )
  }
}

const QvainContainer = styled.div`
  background-color: #fafafa;
`

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
