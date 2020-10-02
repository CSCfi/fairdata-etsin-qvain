import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { RadioInput, NestedLabel } from '../../../general/modal/form'

const propTypes = {
  Stores: PropTypes.object.isRequired,
  role: PropTypes.string.isRequired,
}

const ActorRadio = ({
  Stores: {
    Qvain: {
      readonly,
      Actors: { actorInEdit: actor, updateActor },
    },
  },
  role,
}) => {
  const checked = role === actor.type

  const handleChangeEntity = type => () => {
    updateActor(actor, { type })
  }

  return (
    <ListItem>
      <NestedLabel>
        <RadioInput
          id={`entity-${role}`}
          name="entityType"
          type="radio"
          disabled={readonly}
          onChange={handleChangeEntity(role)}
          checked={checked}
        />
        <Translate content={`qvain.actors.add.radio.${role}`} />
      </NestedLabel>
    </ListItem>
  )
}

export const ListItem = styled.li`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: no-wrap;
  color: ${props => (props.disabled ? 'grey' : 'inherit')};
  margin: 0.5rem;
`

ActorRadio.propTypes = propTypes

export default inject('Stores')(observer(ActorRadio))
