import React, { Component } from 'react';
import styled from 'styled-components';
import {
  faBuilding,
  faUser,
  faPen,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SectionTitle } from '../general/section'
import { ContainerLight, ContainerSubsection } from '../general/card';

const EntityType = {
  PERSON: 'Person',
  ORGANIZATION: 'Organization'
}

const Role = {
  CREATOR: 'Creator',
  PUBLISHER: 'Publisher',
  CURATOR: 'Curator'
}

class Participants extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entity: {
        entityType: undefined,
        roles: []
      }
    }
  }

  getSelection = () => (
    <ParticipantSelection>
      <ParticipantEntityType>{this.state.entity.entityType}</ParticipantEntityType>
      {this.state.entity.roles.map(role => ` / ${role}`)}
    </ParticipantSelection>
  )

  addRole = (role) => this.setState((state) => ({
    entity: {
      ...state.entity,
      roles: [...state.entity.roles, role]
    }
  }))

  removeRole = (role) => this.setState((state) => ({
    entity: {
      ...state.entity,
      roles: state.entity.roles.filter((possessedRole) => possessedRole !== role)
    }
  }))

  handleChangeRole = (event) => {
    console.log('event: ', event.target.value)
    const role = event.target.value
    if (event.target.checked === true) {
      this.addRole(role)
    } else {
      this.removeRole(role)
    }
  }

  handleChangeEntity = (event) => {
    this.setState({
      entity: {
        entityType: event.target.value,
        roles: []
      }
    })
  }

  render() {
    console.log('render ', this.state)
    const { entity } = this.state
    return (
      <div className="container">
        <SectionTitle>Participants</SectionTitle>
        <ContainerLight>
          <ContainerSubsection>
            <h3>Participants *</h3>
            <p>Creator (1+) and publisher (max 1) roles are mandatory. Notice that one participant can have multiple roles.</p>
            <Fieldset>
              <Column>
                <FormField>
                  <RadioContainer>
                    <RadioInput
                      id="entityPerson"
                      name="entityType"
                      onClick={this.handleChangeEntity}
                      value={EntityType.PERSON}
                      type="radio"
                    />
                  </RadioContainer>
                  <Label htmlFor="entityPerson">Person</Label>
                </FormField>
                <List>
                  <ListItem disabled={entity.entityType !== EntityType.PERSON}>
                    <FormField>
                      <Checkbox
                        disabled={entity.entityType !== EntityType.PERSON}
                        onChange={this.handleChangeRole}
                        id="personCreator"
                        type="checkbox"
                        value={Role.CREATOR}
                        checked={
                          entity.entityType === EntityType.PERSON &&
                          entity.roles.includes(Role.CREATOR)
                        }
                      />
                      <Label htmlFor="personCreator">Creator *</Label>
                    </FormField>
                  </ListItem>
                  <ListItem disabled={entity.entityType !== EntityType.PERSON}>
                    <FormField>
                      <Checkbox
                        onChange={this.handleChangeRole}
                        disabled={entity.entityType !== EntityType.PERSON}
                        id="personPublisher"
                        value={Role.PUBLISHER}
                        type="checkbox"
                        checked={
                          entity.entityType === EntityType.PERSON &&
                          entity.roles.includes(Role.PUBLISHER)
                        }
                      />
                      <Label htmlFor="personPublisher">Publisher * <HelpField>max 1</HelpField></Label>
                    </FormField>
                  </ListItem>
                  <ListItem disabled={entity.entityType !== EntityType.PERSON}>
                    <FormField>
                      <Checkbox
                        disabled={entity.entityType !== EntityType.PERSON}
                        onChange={this.handleChangeRole}
                        id="personCurator"
                        value={Role.CURATOR}
                        checked={
                          entity.entityType === EntityType.PERSON &&
                          entity.roles.includes(Role.CURATOR)
                        }
                        type="checkbox"
                      />
                      <Label htmlFor="personCurator">Curator <HelpField>max 1</HelpField></Label>
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
                      onClick={this.handleChangeEntity}
                    />
                  </RadioContainer>
                  <Label for="entityOrg">Organization</Label>
                </FormField>
                <List>
                  <ListItem disabled={entity.entityType !== EntityType.ORGANIZATION}>
                    <FormField>
                      <Checkbox
                        id="orgCreator"
                        type="checkbox"
                        disabled={entity.entityType !== EntityType.ORGANIZATION}
                        onChange={this.handleChangeRole}
                        value={Role.CREATOR}
                        checked={
                          entity.entityType === EntityType.ORGANIZATION &&
                          entity.roles.includes(Role.CREATOR)
                        }
                      />
                      <Label htmlFor="orgCreator">Creator</Label>
                    </FormField>
                  </ListItem>
                  <ListItem disabled={entity.entityType !== EntityType.ORGANIZATION}>
                    <FormField>
                      <Checkbox
                        id="orgPublisher"
                        type="checkbox"
                        disabled={entity.entityType !== EntityType.ORGANIZATION}
                        onChange={this.handleChangeRole}
                        value={Role.PUBLISHER}
                        checked={
                          entity.entityType === EntityType.ORGANIZATION &&
                          entity.roles.includes(Role.PUBLISHER)
                        }
                      />
                      <Label htmlFor="orgPublisher">Publisher <HelpField>max 1</HelpField></Label>
                    </FormField>
                  </ListItem>
                  <ListItem disabled={entity.entityType !== EntityType.ORGANIZATION}>
                    <FormField>
                      <Checkbox
                        id="orgCurator"
                        type="checkbox"
                        disabled={entity.entityType !== EntityType.ORGANIZATION}
                        onChange={this.handleChangeRole}
                        value={Role.CURATOR}
                        checked={
                          entity.entityType === EntityType.ORGANIZATION &&
                          entity.roles.includes(Role.CURATOR)
                        }
                      />
                      <Label htmlFor="orgCurator">Curator <HelpField>max 1</HelpField></Label>
                    </FormField>
                  </ListItem>
                </List>
              </Column>
            </Fieldset>
            {entity.entityType !== undefined && this.getSelection()}
            <Label>Name *</Label>
            <Input type="text" placeholder="First And Last Name" />
            <Label>Email</Label>
            <Input type="email" placeholder="Email" />
            <Label>Identifier</Label>
            <Input type="text" placeholder="Identifier" />
            <Label>Organization *</Label>
            <Input type="text" placeholder="E.g. University of Helsinki" />
            <CancelButton>Cancel</CancelButton>
            <SaveButton>Save</SaveButton>
          </ContainerSubsection>
          <ContainerSubsection>
            <h3>Added Participants</h3>
            <AddedParticipant>
              <AddedParticipantLabel>
                <FontAwesomeIcon icon={faBuilding} style={{ marginRight: '8px' }} />
                 University of Helsinki / Creator
              </AddedParticipantLabel>
              <AddedParticipantEditButton>
                <FontAwesomeIcon size="lg" style={{ color: '#007fad' }} icon={faPen} />
              </AddedParticipantEditButton>
              <AddedParticipantDeleteButton>
                <FontAwesomeIcon size="lg" style={{ color: '#ad2300' }} icon={faTimes} />
              </AddedParticipantDeleteButton>
            </AddedParticipant>
            <AddedParticipant>
              <AddedParticipantLabel>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                 Tiia Tutkija / Creator
              </AddedParticipantLabel>
              <AddedParticipantEditButton>
                <FontAwesomeIcon size="lg" style={{ color: '#007fad' }} icon={faPen} />
              </AddedParticipantEditButton>
              <AddedParticipantDeleteButton>
                <FontAwesomeIcon size="lg" style={{ color: '#ad2300' }} icon={faTimes} />
              </AddedParticipantDeleteButton>
            </AddedParticipant>
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

const ParticipantSelection = styled.div`
  width: 100%;
  border-radius: 4px;
  padding: 5px 17px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
`

const ParticipantEntityType = styled.span`
  font-weight: 600;
`;

const Fieldset = styled.fieldset`
  border: none;
`

const CancelButton = styled.button`
  width: 84px;
  height: 38px;
  border-radius: 4px;
  border: solid 1px #4f4f4f;
  font-size: 16px;
  font-weight: 600px;
  line-height: 1.31;
  color: #4f4f4f;
`;

const SaveButton = styled.button`
  border-radius: 4px;
  border: solid 1px #49a24a;
  background-color: #49a24a;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.31;
  color: #fff;
  margin-left: 20px;
  padding: 10px 25px;
`

const AddedParticipant = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  border: solid 1px #eceeef;
  background-color: #fff;
  margin-bottom: 12px;
`

const AddedParticipantLabel = styled.span`
  background-color: transparent;
  display: inline-flex;
  padding: 0 8px 0 8px;
  position: relative;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  height: 36px;
  border: none;
  outline: none;
  overflow: hidden;
  vertical-align: middle;
  float: left;
  margin: 14px;
  white-space: nowrap;
`;

const AddedParticipantEditButton = styled.button`
  background-color: rgba(0,187,255, 0.1);
  width: 60px;
  height: 56px;
  border: none;
  text-align: center;
`;

const AddedParticipantDeleteButton = styled.button`
  background-color: rgba(255, 52, 0, 0.1);
  width: 60px;
  height: 56px;
  border: none;
  text-align: center;
`;

export default Participants
