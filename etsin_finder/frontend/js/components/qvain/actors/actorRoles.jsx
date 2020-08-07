import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { FormField, Checkbox, Label, HelpField } from '../general/form'
import { ROLE } from '../../../utils/constants'
import { GroupLabel } from './common'

export const List = styled.ul`
  padding: 0px;
  margin: 0;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-flow: row;
`

export const ListItem = styled.li`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: no-wrap;
  color: ${(props) => (props.disabled ? 'grey' : 'inherit')};
`

export class ActorRolesBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  handleChangeRole = (actor, role) => (event) => {
    const { updateActor } = this.props.Stores.Qvain.Actors
    let roles
    if (event.target.checked === true) {
      roles = [...actor.roles, role]
    } else {
      roles = actor.roles.filter((r) => r !== role)
    }
    updateActor(actor, { roles })
  }

  handleChangeEntity = (actor, type) => () => {
    const { updateActor } = this.props.Stores.Qvain.Actors
    updateActor(actor, { type })
  }

  checkIfActorRoleExists = (role) => {
    const { actors, actorInEdit } = this.props.Stores.Qvain.Actors
    if (actors.map((p) => p.uiid).includes(actorInEdit.uiid)) {
      // we are editing a previously added actor, allow changing roles
      return false
    }
    const actorMatchList = actors.map((addedActor) => addedActor.roles.includes(role))
    if (actorMatchList.includes(true)) {
      return true
    }
    return false
  }

  render() {
    const {
      Actors: { actorInEdit: actor },
      readonly,
    } = this.props.Stores.Qvain
    return (
      <Fieldset>
        <Translate component={GroupLabel} content="qvain.actors.add.groups.roles" />
        <List>
          <ListItem disabled={readonly}>
            <FormField>
              <Checkbox
                disabled={readonly}
                onChange={this.handleChangeRole(actor, ROLE.CREATOR)}
                id="roleCreator"
                type="checkbox"
                value={ROLE.CREATOR}
                checked={actor.roles.includes(ROLE.CREATOR)}
              />
              <Label htmlFor="roleCreator">
                <Translate content="qvain.actors.add.checkbox.creator" />{' '}
                <HelpField>(min 1)</HelpField>
              </Label>
            </FormField>
          </ListItem>
          <ListItem disabled={readonly || this.checkIfActorRoleExists(ROLE.PUBLISHER)}>
            <FormField>
              <Checkbox
                onChange={this.handleChangeRole(actor, ROLE.PUBLISHER)}
                disabled={this.checkIfActorRoleExists(ROLE.PUBLISHER) || readonly}
                id="rolePublisher"
                value={ROLE.PUBLISHER}
                type="checkbox"
                checked={actor.roles.includes(ROLE.PUBLISHER)}
              />
              <Label htmlFor="rolePublisher">
                <Translate content="qvain.actors.add.checkbox.publisher" />{' '}
                <HelpField>(max 1)</HelpField>
              </Label>
            </FormField>
          </ListItem>
          <ListItem disabled={readonly}>
            <FormField>
              <Checkbox
                disabled={readonly}
                onChange={this.handleChangeRole(actor, ROLE.CURATOR)}
                id="roleCurator"
                value={ROLE.CURATOR}
                checked={actor.roles.includes(ROLE.CURATOR)}
                type="checkbox"
              />
              <Label htmlFor="roleCurator">
                <Translate content="qvain.actors.add.checkbox.curator" />
              </Label>
            </FormField>
          </ListItem>
          <ListItem disabled={readonly}>
            <FormField>
              <Checkbox
                disabled={readonly}
                onChange={this.handleChangeRole(actor, ROLE.RIGHTS_HOLDER)}
                id="roleRightsHolder"
                type="checkbox"
                value={ROLE.RIGHTS_HOLDER}
                checked={actor.roles.includes(ROLE.RIGHTS_HOLDER)}
              />
              <Label htmlFor="roleRightsHolder">
                <Translate content="qvain.actors.add.checkbox.rights_holder" />
              </Label>
            </FormField>
          </ListItem>
          <ListItem disabled={readonly}>
            <FormField>
              <Checkbox
                disabled={readonly}
                onChange={this.handleChangeRole(actor, ROLE.CONTRIBUTOR)}
                id="roleContributor"
                type="checkbox"
                value={ROLE.CONTRIBUTOR}
                checked={actor.roles.includes(ROLE.CONTRIBUTOR)}
              />
              <Label htmlFor="roleContributor">
                <Translate content="qvain.actors.add.checkbox.contributor" />
              </Label>
            </FormField>
          </ListItem>
          {actor.roles.includes(ROLE.PROVENANCE) && (
          <ListItem disabled={readonly}>
            <FormField>
              <Checkbox
                disabled
                id="roleProvenance"
                type="checkbox"
                value={ROLE.PROVENANCE}
                checked
              />
              <Label htmlFor="roleProvenance">
                <Translate content="qvain.actors.add.checkbox.provenance" />
              </Label>
            </FormField>
          </ListItem>
          )}
        </List>
      </Fieldset>
    )
  }
}

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

export default inject('Stores')(observer(ActorRolesBase))
