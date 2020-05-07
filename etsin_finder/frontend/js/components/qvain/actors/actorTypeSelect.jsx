import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { RadioInput, NestedLabel } from '../general/form'
import { EntityType } from '../utils/constants'
import { GroupLabel } from './common'

export class ActorTypeSelectBase extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  handleChangeEntity = (actor, type) => () => {
    const { updateActor } = this.props.Stores.Qvain.Actors
    updateActor(actor, { type })
  }

  render() {
    const {
      Actors: { actorInEdit: actor },
      readonly,
    } = this.props.Stores.Qvain
    const isPerson = actor.type === EntityType.PERSON
    const isOrganization = actor.type === EntityType.ORGANIZATION
    return (
      <Fieldset>
        <Translate component={GroupLabel} content="qvain.actors.add.groups.type" />
        <List>
          <ListItem>
            <NestedLabel>
              <RadioInput
                id="entityPerson"
                name="entityType"
                disabled={readonly}
                onChange={this.handleChangeEntity(actor, EntityType.PERSON)}
                type="radio"
                checked={isPerson}
              />
              <Translate content="qvain.actors.add.radio.person" />
            </NestedLabel>
          </ListItem>
          <ListItem>
            <NestedLabel>
              <RadioInput
                id="entityOrg"
                name="entityType"
                type="radio"
                disabled={readonly}
                onChange={this.handleChangeEntity(actor, EntityType.ORGANIZATION)}
                checked={isOrganization}
              />
              <Translate content="qvain.actors.add.radio.organization" />
            </NestedLabel>
          </ListItem>
        </List>
      </Fieldset>
    )
  }
}

export const List = styled.ul`
  padding: 0px;
  margin: 0;
  list-style-type: none;
  display: flex;
  margin: -0.5rem;
  width: 100%;
`

export const ListItem = styled.li`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: no-wrap;
  color: ${(props) => (props.disabled ? 'grey' : 'inherit')};
  margin: 0.5rem;
`

const Fieldset = styled.fieldset`
  border: none;
`

export default inject('Stores')(observer(ActorTypeSelectBase))
