import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import AddedParticipants from './addedParticipants'
import ParticipantTypeSelect from './participantTypeSelect'
import SelectedParticipant from './participantSelection'
import ParticipantInfo from './participantInfo'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsection } from '../general/card';

export class ParticipantsBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
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
            {participant.type !== undefined && <SelectedParticipant />}
            {participant.type !== undefined && <ParticipantInfo />}
          </ContainerSubsection>
          <AddedParticipants />
        </ContainerLight>
      </div>
    )
  }
}

export default inject('Stores')(observer(ParticipantsBase))
