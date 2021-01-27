import React from 'react'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import AddedActors from './addedActors'
import ActorTitle from './actorTitle'
import { Container } from '../../../general/card'
import { Actor } from '../../../../../stores/view/qvain/qvain.actors'
import { ButtonContainer, AddNewButton } from '../../../general/buttons'
import { useStores } from '../../../utils/stores'
import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'

const ActorsField = () => {
  const Stores = useStores()
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

export default withFieldErrorBoundary(observer(ActorsField), 'qvain.actors.added.title')
