import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FormField, RadioInput, RadioContainer, Checkbox, Label, HelpField } from '../general/form'
import { List, ListItem } from '../general/list'
import { EntityType, Role } from '../utils/constants'

export class ActorTypeSelectBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  handleChangeRole = (actor, role) => event => {
    if (event.target.checked === true) {
      actor.role = [...actor.role, role]
    } else {
      actor.role = actor.role.filter(r => r !== role)
    }
  }

  handleChangeEntity = (actor, type) => () => {
    actor.type = type
    actor.role = []
    this.props.Stores.Qvain.emptyActorInEdit(type)
  }

  checkIfActorRoleExists = role => {
    const actor = this.props.Stores.Qvain.actorInEdit
    if (this.props.Stores.Qvain.addedActors.map(p => p.uiId).includes(actor.uiId)) {
      // we are editing a previously added actor, allow changing roles
      return false
    }
    const actorMatchList = this.props.Stores.Qvain.addedActors.map(addedActor =>
      addedActor.role.includes(role)
    )
    if (actorMatchList.includes(true)) {
      return true
    }
    return false
  }

  render() {
    const actor = this.props.Stores.Qvain.actorInEdit
    return (
      <Fieldset>
        <Column>
          <FormField>
            <RadioContainer>
              <RadioInput
                id="entityPerson"
                name="entityType"
                onChange={this.handleChangeEntity(actor, EntityType.PERSON)}
                type="radio"
                checked={actor.type === EntityType.PERSON}
              />
            </RadioContainer>
            <Label htmlFor="entityPerson">
              <Translate content="qvain.actors.add.radio.person" />
            </Label>
          </FormField>
          <List>
            <ListItem disabled={actor.type !== EntityType.PERSON}>
              <FormField>
                <Checkbox
                  disabled={actor.type !== EntityType.PERSON}
                  onChange={this.handleChangeRole(actor, Role.CREATOR)}
                  id="personCreator"
                  type="checkbox"
                  value={Role.CREATOR}
                  checked={actor.type === EntityType.PERSON && actor.role.includes(Role.CREATOR)}
                />
                <Label htmlFor="personCreator">
                  <Translate content="qvain.actors.add.checkbox.creator" /> *
                </Label>
              </FormField>
            </ListItem>
            <ListItem
              disabled={
                actor.type !== EntityType.PERSON || this.checkIfActorRoleExists(Role.PUBLISHER)
              }
            >
              <FormField>
                <Checkbox
                  onChange={this.handleChangeRole(actor, Role.PUBLISHER)}
                  disabled={
                    actor.type !== EntityType.PERSON || this.checkIfActorRoleExists(Role.PUBLISHER)
                  }
                  id="personPublisher"
                  value={Role.PUBLISHER}
                  type="checkbox"
                  checked={actor.type === EntityType.PERSON && actor.role.includes(Role.PUBLISHER)}
                />
                <Label htmlFor="personPublisher">
                  <Translate content="qvain.actors.add.checkbox.publisher" />{' '}
                  <HelpField>(max 1)</HelpField>
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={actor.type !== EntityType.PERSON}>
              <FormField>
                <Checkbox
                  disabled={actor.type !== EntityType.PERSON}
                  onChange={this.handleChangeRole(actor, Role.CURATOR)}
                  id="personCurator"
                  value={Role.CURATOR}
                  checked={actor.type === EntityType.PERSON && actor.role.includes(Role.CURATOR)}
                  type="checkbox"
                />
                <Label htmlFor="personCurator">
                  <Translate content="qvain.actors.add.checkbox.curator" />
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={actor.type !== EntityType.PERSON}>
              <FormField>
                <Checkbox
                  disabled={actor.type !== EntityType.PERSON}
                  onChange={this.handleChangeRole(actor, Role.RIGHTS_HOLDER)}
                  id="personRightsHolder"
                  type="checkbox"
                  value={Role.RIGHTS_HOLDER}
                  checked={
                    actor.type === EntityType.PERSON && actor.role.includes(Role.RIGHTS_HOLDER)
                  }
                />
                <Label htmlFor="personRightsHolder">
                  <Translate content="qvain.actors.add.checkbox.rights_holder" />
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={actor.type !== EntityType.PERSON}>
              <FormField>
                <Checkbox
                  disabled={actor.type !== EntityType.PERSON}
                  onChange={this.handleChangeRole(actor, Role.CONTRIBUTOR)}
                  id="personContributor"
                  type="checkbox"
                  value={Role.CONTRIBUTOR}
                  checked={
                    actor.type === EntityType.PERSON && actor.role.includes(Role.CONTRIBUTOR)
                  }
                />
                <Label htmlFor="personContributor">
                  <Translate content="qvain.actors.add.checkbox.contributor" />
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
                onChange={this.handleChangeEntity(actor, EntityType.ORGANIZATION)}
                checked={actor.type === EntityType.ORGANIZATION}
              />
            </RadioContainer>
            <Label htmlFor="entityOrg">
              <Translate content="qvain.actors.add.radio.organization" />
            </Label>
          </FormField>
          <List>
            <ListItem disabled={actor.type !== EntityType.ORGANIZATION}>
              <FormField>
                <Checkbox
                  id="orgCreator"
                  type="checkbox"
                  disabled={actor.type !== EntityType.ORGANIZATION}
                  onChange={this.handleChangeRole(actor, Role.CREATOR)}
                  value={Role.CREATOR}
                  checked={
                    actor.type === EntityType.ORGANIZATION && actor.role.includes(Role.CREATOR)
                  }
                />
                <Label htmlFor="orgCreator">
                  <Translate content="qvain.actors.add.checkbox.creator" />
                </Label>
              </FormField>
            </ListItem>
            <ListItem
              disabled={
                actor.type !== EntityType.ORGANIZATION ||
                this.checkIfActorRoleExists(Role.PUBLISHER)
              }
            >
              <FormField>
                <Checkbox
                  id="orgPublisher"
                  type="checkbox"
                  disabled={
                    actor.type !== EntityType.ORGANIZATION ||
                    this.checkIfActorRoleExists(Role.PUBLISHER)
                  }
                  onChange={this.handleChangeRole(actor, Role.PUBLISHER)}
                  value={Role.PUBLISHER}
                  checked={
                    actor.type === EntityType.ORGANIZATION && actor.role.includes(Role.PUBLISHER)
                  }
                />
                <Label htmlFor="orgPublisher">
                  <Translate content="qvain.actors.add.checkbox.publisher" />{' '}
                  <HelpField>(max 1)</HelpField>
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={actor.type !== EntityType.ORGANIZATION}>
              <FormField>
                <Checkbox
                  id="orgCurator"
                  type="checkbox"
                  disabled={actor.type !== EntityType.ORGANIZATION}
                  onChange={this.handleChangeRole(actor, Role.CURATOR)}
                  value={Role.CURATOR}
                  checked={
                    actor.type === EntityType.ORGANIZATION && actor.role.includes(Role.CURATOR)
                  }
                />
                <Label htmlFor="orgCurator">
                  <Translate content="qvain.actors.add.checkbox.curator" />
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={actor.type !== EntityType.ORGANIZATION}>
              <FormField>
                <Checkbox
                  id="orgRightsHolder"
                  type="checkbox"
                  disabled={actor.type !== EntityType.ORGANIZATION}
                  onChange={this.handleChangeRole(actor, Role.RIGHTS_HOLDER)}
                  value={Role.RIGHTS_HOLDER}
                  checked={
                    actor.type === EntityType.ORGANIZATION &&
                    actor.role.includes(Role.RIGHTS_HOLDER)
                  }
                />
                <Label htmlFor="orgRightsHolder">
                  <Translate content="qvain.actors.add.checkbox.rights_holder" />
                </Label>
              </FormField>
            </ListItem>
            <ListItem disabled={actor.type !== EntityType.ORGANIZATION}>
              <FormField>
                <Checkbox
                  id="orgContributor"
                  type="checkbox"
                  disabled={actor.type !== EntityType.ORGANIZATION}
                  onChange={this.handleChangeRole(actor, Role.CONTRIBUTOR)}
                  value={Role.CONTRIBUTOR}
                  checked={
                    actor.type === EntityType.ORGANIZATION && actor.role.includes(Role.CONTRIBUTOR)
                  }
                />
                <Label htmlFor="orgContributor">
                  <Translate content="qvain.actors.add.checkbox.contributor" />
                </Label>
              </FormField>
            </ListItem>
          </List>
        </Column>
      </Fieldset>
    )
  }
}

const Column = styled.div`
  float: left;
  width: 50%;
`

export const ActorSelection = styled.div`
  width: 100%;
  border-radius: 4px;
  padding: 5px 17px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
`

const Fieldset = styled.fieldset`
  border: none;
`

Column.displayName = 'Column'
Column.displayName = 'Column'
Column.displayName = 'Column'
Column.displayName = 'Column'
Column.displayName = 'Column'

export default inject('Stores')(observer(ActorTypeSelectBase))
