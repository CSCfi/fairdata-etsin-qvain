import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components';
import {
  faBuilding,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsection } from '../general/card';
import {
  SaveButton,
  CancelButton,
  ButtonGroup,
  ButtonLabel,
  EditButton,
  DeleteButton
} from '../general/buttons'

export const EntityType = {
  PERSON: 'Person',
  ORGANIZATION: 'Organization'
}

export const Role = {
  CREATOR: 'Creator',
  PUBLISHER: 'Publisher',
  CURATOR: 'Curator'
}

class Participants extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    participant: {
      entityType: EntityType.PERSON,
      roles: []
    },
    name: '',
    email: '',
    identifier: '',
    organization: ''
  }

  getSelection = () => {
    const { participant } = this.state
    return (
      <ParticipantSelection>
        <ParticipantEntityType>
          <Translate content={`qvain.participants.add.radio.${participant.entityType.toLowerCase()}`} />
        </ParticipantEntityType>
        {participant.roles.map(role => (
          <React.Fragment key={role}>
            <span> / </span>
            <Translate content={`qvain.participants.add.checkbox.${role.toLowerCase()}`} />
          </React.Fragment>
        ))}
      </ParticipantSelection>
    )
  }

  addRole = (role) => this.setState((state) => ({
    participant: {
      ...state.participant,
      roles: [...state.participant.roles, role]
    }
  }))

  removeRole = (role) => this.setState((state) => ({
    participant: {
      ...state.participant,
      roles: state.participant.roles.filter((possessedRole) => possessedRole !== role)
    }
  }))

  handleChangeRole = (event) => {
    const role = event.target.value
    if (event.target.checked === true) {
      this.addRole(role)
    } else {
      this.removeRole(role)
    }
  }

  handleChangeEntity = (event) => {
    this.setState({
      participant: {
        entityType: event.target.value,
        roles: []
      }
    })
  }

  handleReset = () => {
    this.setState({
      participant: {
        entityType: EntityType.PERSON,
        roles: [],
      },
      name: '',
      email: '',
      identifier: '',
      organization: ''
    })
  }

  handleSave = (event) => {
    event.preventDefault()
    const { name, email, identifier, organization } = this.state
    const participant = {
      ...this.state.participant,
      name,
      email,
      identifier,
      organization
    }
    this.props.Stores.Qvain.addParticipant(participant)
    this.handleReset()
  }

  handleCancel = (event) => {
    event.preventDefault()
    this.handleReset()
  }

  createHandleEdit = (participant) => (event) => {
    event.preventDefault()
    this.setState({
      participant: {
        entityType: participant.entityType,
        roles: participant.roles
      },
      ...participant
    })
  }

  createHandleRemove = (participant) => (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.removeParticipant(participant)
  }

  checkIfParticipantRoleExists = (role) => {
    const participantMatchList = this.props.Stores.Qvain.addedParticipants.map((addedParticipant) => (
      addedParticipant.roles.includes(role)
    ))
    if (participantMatchList.includes(true)) {
      return true
    }
    return false;
  }

  render() {
    const { participant, name, email, identifier, organization } = this.state
    return (
      <div className="container">
        <Translate component={SectionTitle} content="qvain.participants.title" />
        <ContainerLight>
          <ContainerSubsection>
            <h3><Translate content="qvain.participants.add.title" /> *</h3>
            <Translate component="p" content="qvain.participants.add.help" />
            <Fieldset>
              <Column>
                <FormField>
                  <RadioContainer>
                    <RadioInput
                      id="entityPerson"
                      name="entityType"
                      onChange={this.handleChangeEntity}
                      value={EntityType.PERSON}
                      type="radio"
                      checked={participant.entityType === EntityType.PERSON}
                    />
                  </RadioContainer>
                  <Label htmlFor="entityPerson">
                    <Translate content="qvain.participants.add.radio.person" />
                  </Label>
                </FormField>
                <List>
                  <ListItem disabled={participant.entityType !== EntityType.PERSON}>
                    <FormField>
                      <Checkbox
                        disabled={participant.entityType !== EntityType.PERSON}
                        onChange={this.handleChangeRole}
                        id="personCreator"
                        type="checkbox"
                        value={Role.CREATOR}
                        checked={
                          participant.entityType === EntityType.PERSON &&
                          participant.roles.includes(Role.CREATOR)
                        }
                      />
                      <Label htmlFor="personCreator">
                        <Translate content="qvain.participants.add.checkbox.creator" /> *
                      </Label>
                    </FormField>
                  </ListItem>
                  <ListItem disabled={participant.entityType !== EntityType.PERSON || this.checkIfParticipantRoleExists('Publisher')}>
                    <FormField>
                      <Checkbox
                        onChange={this.handleChangeRole}
                        disabled={participant.entityType !== EntityType.PERSON || this.checkIfParticipantRoleExists('Publisher')}
                        id="personPublisher"
                        value={Role.PUBLISHER}
                        type="checkbox"
                        checked={
                          participant.entityType === EntityType.PERSON &&
                          participant.roles.includes(Role.PUBLISHER)
                        }
                      />
                      <Label htmlFor="personPublisher">
                        <Translate content="qvain.participants.add.checkbox.publisher" /> * <HelpField>max 1</HelpField>
                      </Label>
                    </FormField>
                  </ListItem>
                  <ListItem disabled={participant.entityType !== EntityType.PERSON || this.checkIfParticipantRoleExists('Curator')}>
                    <FormField>
                      <Checkbox
                        disabled={participant.entityType !== EntityType.PERSON || this.checkIfParticipantRoleExists('Curator')}
                        onChange={this.handleChangeRole}
                        id="personCurator"
                        value={Role.CURATOR}
                        checked={
                          participant.entityType === EntityType.PERSON &&
                          participant.roles.includes(Role.CURATOR)
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
                      value={EntityType.ORGANIZATION}
                      type="radio"
                      onChange={this.handleChangeEntity}
                      checked={participant.entityType === EntityType.ORGANIZATION}
                    />
                  </RadioContainer>
                  <Label htmlFor="entityOrg">
                    <Translate content="qvain.participants.add.radio.organization" />
                  </Label>
                </FormField>
                <List>
                  <ListItem disabled={participant.entityType !== EntityType.ORGANIZATION}>
                    <FormField>
                      <Checkbox
                        id="orgCreator"
                        type="checkbox"
                        disabled={participant.entityType !== EntityType.ORGANIZATION}
                        onChange={this.handleChangeRole}
                        value={Role.CREATOR}
                        checked={
                          participant.entityType === EntityType.ORGANIZATION &&
                          participant.roles.includes(Role.CREATOR)
                        }
                      />
                      <Label htmlFor="orgCreator">
                        <Translate content="qvain.participants.add.checkbox.creator" />
                      </Label>
                    </FormField>
                  </ListItem>
                  <ListItem disabled={participant.entityType !== EntityType.ORGANIZATION || this.checkIfParticipantRoleExists('Publisher')}>
                    <FormField>
                      <Checkbox
                        id="orgPublisher"
                        type="checkbox"
                        disabled={participant.entityType !== EntityType.ORGANIZATION || this.checkIfParticipantRoleExists('Publisher')}
                        onChange={this.handleChangeRole}
                        value={Role.PUBLISHER}
                        checked={
                          participant.entityType === EntityType.ORGANIZATION &&
                          participant.roles.includes(Role.PUBLISHER)
                        }
                      />
                      <Label htmlFor="orgPublisher">
                        <Translate content="qvain.participants.add.checkbox.publisher" /> <HelpField>max 1</HelpField>
                      </Label>
                    </FormField>
                  </ListItem>
                  <ListItem disabled={participant.entityType !== EntityType.ORGANIZATION || this.checkIfParticipantRoleExists('Curator')}>
                    <FormField>
                      <Checkbox
                        id="orgCurator"
                        type="checkbox"
                        disabled={participant.entityType !== EntityType.ORGANIZATION || this.checkIfParticipantRoleExists('Curator')}
                        onChange={this.handleChangeRole}
                        value={Role.CURATOR}
                        checked={
                          participant.entityType === EntityType.ORGANIZATION &&
                          participant.roles.includes(Role.CURATOR)
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
            {participant.entityType !== undefined && this.getSelection()}
            {participant.entityType !== undefined && (
              <React.Fragment>
                <Label htmlFor="nameField">
                  <Translate content="qvain.participants.add.name.label" /> *
                </Label>
                <Translate
                  component={Input}
                  type="text"
                  id="nameField"
                  attributes={{ placeholder: `qvain.participants.add.name.placeholder.${participant.entityType.toLowerCase()}` }}
                  placeholder={participant.entityType === EntityType.PERSON ? 'First And Last Name' : 'Name'}
                  value={name}
                  onChange={(event) => this.setState({ name: event.target.value })}
                />
                <Label htmlFor="emailField">
                  <Translate content="qvain.participants.add.email.label" />
                </Label>
                <Translate
                  component={Input}
                  id="emailField"
                  type="email"
                  attributes={{ placeholder: 'qvain.participants.add.email.placeholder' }}
                  onChange={(event) => this.setState({ email: event.target.value })}
                  value={email}
                />
                <Label htmlFor="identifierField">
                  <Translate content="qvain.participants.add.identifier.label" />
                </Label>
                <Translate
                  id="identifierField"
                  component={Input}
                  type="text"
                  attributes={{ placeholder: 'qvain.participants.add.identifier.placeholder' }}
                  onChange={(event) => this.setState({ identifier: event.target.value })}
                  value={identifier}
                />
                <Label htmlFor="orgField">
                  <Translate content={`qvain.participants.add.organization.label.${participant.entityType.toLowerCase()}`} />
                  {participant.entityType === EntityType.PERSON && ' *'}
                </Label>
                <Translate
                  component={Input}
                  id="orgField"
                  type="text"
                  attributes={{ placeholder: 'qvain.participants.add.organization.placeholder' }}
                  onChange={(event) => this.setState({ organization: event.target.value })}
                  value={organization}
                />
                <Translate
                  component={CancelButton}
                  onClick={this.handleCancel}
                  content="qvain.participants.add.cancel.label"
                />
                <Translate
                  component={SaveButton}
                  onClick={this.handleSave}
                  content="qvain.participants.add.save.label"
                />
              </React.Fragment>
          )}
          </ContainerSubsection>
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
                  <FontAwesomeIcon icon={addedParticipant.entityType === EntityType.PERSON ? faUser : faBuilding} style={{ marginRight: '8px' }} />
                  {addedParticipant.name}{addedParticipant.roles.map(role => (` / ${ role }`))}
                </ButtonLabel>
                <EditButton onClick={this.createHandleEdit(addedParticipant)} />
                <DeleteButton onClick={this.createHandleRemove(addedParticipant)} />
              </ButtonGroup>
            ))}
          </ContainerSubsection>
        </ContainerLight>
      </div>
    )
  }
}

const Column = styled.div`
  float: left;
  width: 50%;
`

const FormField = styled.div`
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
`

const RadioContainer = styled.div`
  display: inline-block;
  position: relative;
  flex: 0 0 auto;
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  padding: 10px;
  cursor: pointer;
`

const RadioInput = styled.input`
  position: absolute;
  z-index: 1;
`

const Label = styled.label`
  margin-right: auto;
  padding-left: 4px;
  display: block;
`

const List = styled.ul`
  padding: 0px;
  margin: 0;
  list-style-type: none;
`

const ListItem = styled.li`
  padding-left: 48px;
  height: 40px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  cursor: pointer;
  color: ${props => (props.disabled ? 'grey' : 'inherit')};
`

const Checkbox = styled.input`
  display: inline-block;
  position: relative;
  flex: 0 0 18px;
  box-sizing: content-box;
  width: 18px;
  height: 18px;
  padding: 11px;
  line-height: 0;
  white-space: nowrap;
  cursor: pointer;
  vertical-align: bottom;
`

const HelpField = styled.span`
  font-weight: 200;
  font-family: "Lato"
`

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  border: 1px solid #eceeef;
  padding: 8px;
  color: #808080;
  margin-bottom: 20px;
`

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

const Fieldset = styled.fieldset`
  border: none;
`

const AddedParticipantDeleteButton = styled.button`
  background-color: rgba(255, 52, 0, 0.1);
  width: 60px;
  height: 56px;
  border: none;
  text-align: center;
`;

export default inject('Stores')(observer(Participants))
