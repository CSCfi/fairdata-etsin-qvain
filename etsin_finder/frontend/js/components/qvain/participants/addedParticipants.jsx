import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import {
  faBuilding,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ContainerSubsection } from '../general/card';
import {
  ButtonGroup,
  ButtonLabel,
  EditButton,
  DeleteButton
} from '../general/buttons'
import { EntityType, EmptyParticipant } from '../../../stores/view/qvain'

class AddedParticipants extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleEdit = (participant) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.editParticipant(participant)
  }

  handleRemove = (participant) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.removeParticipant(participant)
    this.props.Stores.Qvain.editParticipant(EmptyParticipant)
  }

  render() {
    return (
      <ContainerSubsection>
        <Translate
          component="h3"
          content="qvain.participants.added.title"
        />
        {this.props.Stores.Qvain.addedParticipants.length === 0 &&
          (<Translate component="p" content="qvain.participants.added.noneAddedNotice" />)
        }
        {this.props.Stores.Qvain.addedParticipants.map((addedParticipant) => (
          <ButtonGroup key={addedParticipant.identifier}>
            <ButtonLabel>
              <FontAwesomeIcon icon={addedParticipant.type === EntityType.PERSON ? faUser : faBuilding} style={{ marginRight: '8px' }} />
              {addedParticipant.name}{addedParticipant.role.map(role => (` / ${ role }`))}
            </ButtonLabel>
            <EditButton onClick={this.handleEdit(addedParticipant)} />
            <DeleteButton onClick={this.handleRemove(addedParticipant)} />
          </ButtonGroup>
        ))}
      </ContainerSubsection>
    );
  }
}

export default inject('Stores')(observer(AddedParticipants));
