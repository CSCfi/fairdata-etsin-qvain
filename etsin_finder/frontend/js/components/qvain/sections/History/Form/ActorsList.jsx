import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { useStores } from '@/stores/stores'
import {
  ButtonGroup,
  ButtonLabel,
  DeleteButton,
  ListItemButtonContainer,
} from '@/components/qvain/general/V2/buttons'
import parseActorLabel from '@/components/qvain/utils/actor'

const ActorsList = ({ actors, items, language }) => {
  const { readonly } = useStores().Qvain

  const handleRemoveActor = actor => {
    actors.removeActorRef(actor.value)
  }

  return items.map(actor => {
    const actorName = parseActorLabel(actor, language)
    const rolesStr = actor.roles.map(role => translate(`qvain.actors.add.checkbox.${role}`))
    const name = `${actorName} / ${rolesStr.join(' / ')}`
    return (
      <ButtonGroup tabIndex="0" key={actor.value}>
        <ActorLabel className="actor-label">{name}</ActorLabel>
        <ListItemButtonContainer>
          {!readonly && (
            <Translate
              type="button"
              onClick={() => handleRemoveActor(actor)}
              component={DeleteButton}
              attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
            />
          )}
        </ListItemButtonContainer>
      </ButtonGroup>
    )
  })
}

const ActorLabel = styled(ButtonLabel)`
  white-space: normal;
  overflow: hidden;
  height: auto;
  word-break: break-word;
`

ActorsList.propTypes = {
  actors: PropTypes.object,
  items: PropTypes.array,
  language: PropTypes.string.isRequired,
}

ActorsList.defaultProps = {
  items: [],
  actors: {},
}

export default ActorsList
