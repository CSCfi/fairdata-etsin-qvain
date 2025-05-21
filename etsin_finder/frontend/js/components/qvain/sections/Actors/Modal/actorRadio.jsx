import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { RadioInput, NestedLabel } from '../../../general/modal/form'
import { useStores } from '../../../utils/stores'

const propTypes = {
  role: PropTypes.string.isRequired,
}

const ActorRadio = ({ role }) => {
  const {
    Qvain: {
      Actors: { actorInEdit: actor, updateActor },
      readonly,
    },
  } = useStores()
  const checked = role === actor.type

  const handleChangeEntity = type => () => {
    updateActor(actor, { type })
  }
  const roleKey = role.toLowerCase()

  return (
    <ListItem>
      <NestedLabel>
        <RadioInput
          id={`entity-${roleKey}`}
          name="entityType"
          type="radio"
          disabled={readonly}
          onChange={handleChangeEntity(role)}
          checked={checked}
        />
        <Translate content={`qvain.actors.add.radio.${roleKey}`} />
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

export default observer(ActorRadio)
