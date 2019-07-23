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
import Tooltip from '../general/tooltip'
import { HelpIcon } from '../general/form'
import ParticipantsInfoTooltip from './participantsInfoTooltip'

export class ParticipantsBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    tooltipOpen: false
  }

  render() {
    const participant = this.props.Stores.Qvain.participantInEdit
    return (
      <div className="container">
        <SectionTitle>
          <Translate content="qvain.participants.title" />
          <Tooltip
            isOpen={this.state.tooltipOpen}
            align="Right"
            text={<ParticipantsInfoTooltip />}
          >
            <HelpIcon
              onClick={() => this.setState(prevState => ({ tooltipOpen: !prevState.tooltipOpen }))}
            />
          </Tooltip>
        </SectionTitle>
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
