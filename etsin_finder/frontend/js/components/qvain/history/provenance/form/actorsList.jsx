import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import { ButtonGroup, ButtonLabel, DeleteButton, ButtonContainer } from '../../../general/buttons'

const ActorsList = ({ Stores, actors, items, language }) => {
  const { readonly } = Stores.Qvain

  const handleRemoveActor = actor => {
    actors.removeActorRef(actor.value)
  }

  const actorItems = items.map(actor => {
    const actorName = actor.label[language] || actor.label
    const rolesStr = actor.roles.map(role => `${translate(`qvain.actors.add.checkbox.${role}`)}`)
    const name = `${actorName} / ${rolesStr.join(' / ')}`
    return (
      <ButtonGroup tabIndex="0" key={actor.value}>
        <ActorLabel>{name}</ActorLabel>
        <ButtonContainer>
          {!readonly && (
            <Translate
              type="button"
              onClick={() => handleRemoveActor(actor)}
              component={DeleteButton}
              attributes={{ 'aria-label': 'qvain.general.buttons.remove' }}
            />
          )}
        </ButtonContainer>
      </ButtonGroup>
    )
  })

  return actorItems
}

const ActorLabel = styled(ButtonLabel)`
  white-space: normal;
  overflow: hidden;
  height: auto;
  word-break: break-word;
`

ActorsList.propTypes = {
  Stores: PropTypes.object.isRequired,
  actors: PropTypes.object,
  items: PropTypes.array,
  language: PropTypes.string.isRequired,
}

ActorsList.defaultProps = {
  items: [],
  actors: {},
}

export default ActorsList
