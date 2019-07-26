import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import {
  faBuilding,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ContainerSubsectionBottom } from '../general/card';
import {
  ButtonGroup,
  ButtonLabel,
  EditButton,
  DeleteButton,
  ButtonContainer
} from '../general/buttons'
import { EntityType, EmptyParticipant } from '../../../stores/view/qvain'

export class AddedParticipantsBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleEditParticipant = (participant) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.editParticipant(participant)
  }

  handleRemoveParticipant = (participant) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.removeParticipant(participant)
    this.props.Stores.Qvain.editParticipant(EmptyParticipant)
  }

  getAddedParticipantName = (name, lang) => {
    if (typeof name === 'object' && name !== null) {
      if (lang in name) {
        return name[lang]
      }
      if ('und' in name) {
        return name.und
      }
      const langX = Object.keys(name)[0]
      return name[langX]
    }
    return name
  }

  render() {
    const { lang } = this.props.Stores.Locale
    return (
      <ContainerSubsectionBottom>
        <Translate
          component="h3"
          content="qvain.participants.added.title"
        />
        {this.props.Stores.Qvain.addedParticipants.length === 0 &&
          (<Translate component="p" content="qvain.participants.added.noneAddedNotice" />)
        }
        {this.props.Stores.Qvain.addedParticipants.map((addedParticipant) => (
          <ButtonGroup key={addedParticipant.uiId}>
            <ButtonLabel>
              <FontAwesomeIcon icon={addedParticipant.type === EntityType.PERSON ? faUser : faBuilding} style={{ marginRight: '8px' }} />
              {this.getAddedParticipantName(addedParticipant.name, lang)}{addedParticipant.role.map(role => (` / ${ role }`))}
            </ButtonLabel>
            <ButtonContainer>
              <EditButton onClick={this.handleEditParticipant(addedParticipant)} />
              <DeleteButton onClick={this.handleRemoveParticipant(addedParticipant)} />
            </ButtonContainer>
          </ButtonGroup>
        ))}
      </ContainerSubsectionBottom>
    );
  }
}

export default inject('Stores')(observer(AddedParticipantsBase));
