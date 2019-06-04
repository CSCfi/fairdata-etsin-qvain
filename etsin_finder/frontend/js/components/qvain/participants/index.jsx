import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components';
import AddedParticipants from './addedParticipants'
import ParticipantTypeSelect from './participantTypeSelect'
import ParticipantInfo from './participantInfo'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsection } from '../general/card';

class Participants extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  getSelection = () => {
    const participant = this.props.Stores.Qvain.participantInEdit
    return (
      <ParticipantSelection>
        <ParticipantEntityType>
          <Translate content={`qvain.participants.add.radio.${participant.type.toLowerCase()}`} />
        </ParticipantEntityType>
        {participant.role.map(role => (
          <React.Fragment key={role}>
            <span> / </span>
            <Translate content={`qvain.participants.add.checkbox.${role.toLowerCase()}`} />
          </React.Fragment>
        ))}
      </ParticipantSelection>
    )
  }

  render() {
    const participant = this.props.Stores.Qvain.participantInEdit
    return (
      <div className="container">
        <Translate component={SectionTitle} content="qvain.participants.title" />
        <ContainerLight>
          <ContainerSubsection>
            <h3><Translate content="qvain.participants.add.title" /> *</h3>
            <Translate component="p" content="qvain.participants.add.help" />
            <ParticipantTypeSelect />
            {participant.type !== undefined && this.getSelection()}
            {participant.type !== undefined && <ParticipantInfo />}
          </ContainerSubsection>
          <AddedParticipants />
        </ContainerLight>
      </div>
    )
  }
}

export const ParticipantSelection = styled.div`
  width: 100%;
  border-radius: 4px;
  padding: 5px 17px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
`

const ParticipantEntityType = styled.span`
  font-weight: 800;
`;

export default inject('Stores')(observer(Participants))
