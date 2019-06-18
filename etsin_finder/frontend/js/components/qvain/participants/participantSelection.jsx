import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import Translate from 'react-translate-component'

export class SelectedParticipantBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  render() {
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

export default inject('Stores')(observer(SelectedParticipantBase))
