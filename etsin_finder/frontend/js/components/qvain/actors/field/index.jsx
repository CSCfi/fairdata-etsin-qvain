import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import AddedActors from './addedActors'
import ActorTitle from './actorTitle'
import { Container } from '../../general/card'
import { Actor } from '../../../../stores/view/qvain.actors'
import { ButtonContainer, AddNewButton } from '../../general/buttons'

const ActorsField = ({ Stores }) => {
  const { editActor } = Stores.Qvain.Actors
  const { readonly } = Stores.Qvain

  const createActor = () => {
    editActor(Actor())
  }

  return (
    <Container>
      <ActorTitle />
      <AddedActors />
      <ButtonContainer>
        <AddNewButton type="button" onClick={createActor} disabled={readonly}>
          <Translate content="qvain.actors.addButton" />
        </AddNewButton>
      </ButtonContainer>
    </Container>
  )
}

ActorsField.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(ActorsField))
