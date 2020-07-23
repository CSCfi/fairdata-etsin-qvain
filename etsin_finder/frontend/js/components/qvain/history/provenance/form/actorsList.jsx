import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import {
  ButtonGroup,
  ButtonLabel,
  DeleteButton,
  ButtonContainer
} from '../../../general/buttons'

const ActorsList = ({ Stores, associations, items, language }) => {
  const { readonly } = Stores.Qvain

  const handleRemoveActor = (actor) => {
    associations.removeActorRef(actor.value)
  }

  const associationItems = items.map((actor) => {
    const actorName = actor.label[language] || actor.label
    const rolesStr = actor.roles.map(role => ` / ${translate(`qvain.actors.add.checkbox.${role}`)}`)
    const name = `${actorName} ${rolesStr}`
    return (
      <ButtonGroup tabIndex="0" key={actor.value}>
        <ActorLabel>
          {name}
        </ActorLabel>
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

  return (
    <>
      {items.length === 0 &&
        (<Translate tabIndex="0" component="p" content="qvain.actors.added.noneAddedNotice" />)
      }
      {associationItems}
    </>
  )
}

const ActorLabel = styled(ButtonLabel)`
  white-space: normal;
  overflow: hidden;
  height: auto;
  word-break: break-word;
`

ActorsList.propTypes = {
  Stores: PropTypes.object.isRequired,
  associations: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  language: PropTypes.string.isRequired
}

export default ActorsList
