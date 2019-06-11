import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import Translate from 'react-translate-component'
import {
  FormField,
  RadioInput,
  RadioContainer,
  Checkbox,
  Label,
  HelpField
} from '../general/form'
import {
  List,
  ListItem
} from '../general/list'
import { EntityType, Role } from '../../../stores/view/qvain'

export class ParticipantTypeSelectBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  handleChangeRole = (participant, role) => (event) => {
    if (event.target.checked === true) {
      participant.role = [...participant.role, role]
    } else {
      participant.role = participant.role.filter(r => r !== role)
    }
  }

  handleChangeEntity = (participant, type) => () => {
    participant.type = type
    participant.role = []
  }

  checkIfParticipantRoleExists = (role) => {
    const participant = this.props.Stores.Qvain.participantInEdit
    if (this.props.Stores.Qvain.addedParticipants.map(p => p.uiId).includes(participant.uiId)) {
      // we are editing a previously added participant, allow chaning roles
      return false
    }
    const participantMatchList = this.props.Stores.Qvain.addedParticipants.map((addedParticipant) => (
      addedParticipant.role.includes(role)
    ))
    if (participantMatchList.includes(true)) {
      return true
    }
    return false;
  }

  render() {
    const participant = this.props.Stores.Qvain.participantInEdit
    return (
      <Fieldset>
        <Column>
          <FormField>
            <RadioContainer>
              <RadioInput
                id="entityPerson"
                name="entityType"
                onChange={this.handleChangeEntity(participant, EntityType.PERSON)}
                type="radio"
                checked={participant.type === EntityType.PERSON}
              />
            </RadioContainer>
            <Label htmlFor="entityPerson">
              <Translate content="qvain.participants.add.radio.person" />
            </Label>
          </FormField>
          <List>
            <ListItem disabled={participant.type !== EntityType.PERSON}>
              <FormField>
                <Checkbox
                  disabled={participant.type !== EntityType.PERSON}
                  onChange={this.handleChangeRole(participant, Role.CREATOR)}
                  id="personCreator"
                  type="checkbox"
                  value={Role.CREATOR}
                  checked={
                    participant.type === EntityType.PERSON &&
                    participant.role.includes(Role.CREATOR)
                  }
                />
                <Label htmlFor="personCreator">
                  <Translate content="qvain.participants.add.checkbox.creator" /> *
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={participant.type !== EntityType.PERSON || this.checkIfParticipantRoleExists(Role.PUBLISHER)}>
              <FormField>
                <Checkbox
                  onChange={this.handleChangeRole(participant, Role.PUBLISHER)}
                  disabled={participant.type !== EntityType.PERSON || this.checkIfParticipantRoleExists(Role.PUBLISHER)}
                  id="personPublisher"
                  value={Role.PUBLISHER}
                  type="checkbox"
                  checked={
                    participant.type === EntityType.PERSON &&
                    participant.role.includes(Role.PUBLISHER)
                  }
                />
                <Label htmlFor="personPublisher">
                  <Translate content="qvain.participants.add.checkbox.publisher" /> * <HelpField>max 1</HelpField>
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={participant.type !== EntityType.PERSON || this.checkIfParticipantRoleExists(Role.CURATOR)}>
              <FormField>
                <Checkbox
                  disabled={participant.type !== EntityType.PERSON || this.checkIfParticipantRoleExists(Role.CURATOR)}
                  onChange={this.handleChangeRole(participant, Role.CURATOR)}
                  id="personCurator"
                  value={Role.CURATOR}
                  checked={
                    participant.type === EntityType.PERSON &&
                    participant.role.includes(Role.CURATOR)
                  }
                  type="checkbox"
                />
                <Label htmlFor="personCurator">
                  <Translate content="qvain.participants.add.checkbox.curator" /> <HelpField>max 1</HelpField>
                </Label>
              </FormField>
            </ListItem>
          </List>
        </Column>
        <Column>
          <FormField>
            <RadioContainer>
              <RadioInput
                id="entityOrg"
                name="entityType"
                type="radio"
                onChange={this.handleChangeEntity(participant, EntityType.ORGANIZATION)}
                checked={participant.type === EntityType.ORGANIZATION}
              />
            </RadioContainer>
            <Label htmlFor="entityOrg">
              <Translate content="qvain.participants.add.radio.organization" />
            </Label>
          </FormField>
          <List>
            <ListItem disabled={participant.type !== EntityType.ORGANIZATION}>
              <FormField>
                <Checkbox
                  id="orgCreator"
                  type="checkbox"
                  disabled={participant.type !== EntityType.ORGANIZATION}
                  onChange={this.handleChangeRole(participant, Role.CREATOR)}
                  value={Role.CREATOR}
                  checked={
                    participant.type === EntityType.ORGANIZATION &&
                    participant.role.includes(Role.CREATOR)
                  }
                />
                <Label htmlFor="orgCreator">
                  <Translate content="qvain.participants.add.checkbox.creator" />
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={participant.type !== EntityType.ORGANIZATION || this.checkIfParticipantRoleExists('Publisher')}>
              <FormField>
                <Checkbox
                  id="orgPublisher"
                  type="checkbox"
                  disabled={participant.type !== EntityType.ORGANIZATION || this.checkIfParticipantRoleExists('Publisher')}
                  onChange={this.handleChangeRole(participant, Role.PUBLISHER)}
                  value={Role.PUBLISHER}
                  checked={
                    participant.type === EntityType.ORGANIZATION &&
                    participant.role.includes(Role.PUBLISHER)
                  }
                />
                <Label htmlFor="orgPublisher">
                  <Translate content="qvain.participants.add.checkbox.publisher" /> <HelpField>max 1</HelpField>
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={participant.type !== EntityType.ORGANIZATION || this.checkIfParticipantRoleExists('Curator')}>
              <FormField>
                <Checkbox
                  id="orgCurator"
                  type="checkbox"
                  disabled={participant.type !== EntityType.ORGANIZATION || this.checkIfParticipantRoleExists('Curator')}
                  onChange={this.handleChangeRole(participant, Role.CURATOR)}
                  value={Role.CURATOR}
                  checked={
                    participant.type === EntityType.ORGANIZATION &&
                    participant.role.includes(Role.CURATOR)
                  }
                />
                <Label htmlFor="orgCurator">
                  <Translate content="qvain.participants.add.checkbox.curator" /> <HelpField>max 1</HelpField>
                </Label>
              </FormField>
            </ListItem>
          </List>
        </Column>
      </Fieldset>
    );
  }
}

const Column = styled.div`
  float: left;
  width: 50%;
`

export const ParticipantSelection = styled.div`
  width: 100%;
  border-radius: 4px;
  padding: 5px 17px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
`

const Fieldset = styled.fieldset`
  border: none;
`

export default inject('Stores')(observer(ParticipantTypeSelectBase));
