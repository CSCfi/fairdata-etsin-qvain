import React, { Component } from 'react'
import Translate from 'react-translate-component'
import RightsAndLicenses from './licenses'
import Description from './description';
import Participants from './participants'
import Files from './files'
import { QvainContainer, SubHeader, SubHeaderText } from './general/card'

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

export default Qvain
