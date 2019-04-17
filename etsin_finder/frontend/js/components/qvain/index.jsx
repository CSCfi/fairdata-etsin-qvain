import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import RightsAndLicenses from './licenses'
import Description from './description';
import Participants from './participants'
import Files from './files'

class Qvain extends Component {
  render() {
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderText><Translate content="qvain.title" /></SubHeaderText>
        </SubHeader>
        <form className="container">
          <Description />
          <RightsAndLicenses />
          <Participants />
          <Files />
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
