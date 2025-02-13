import React from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { SectionContentWrapper } from '@/components/qvain/general/V2/Section'
import { Actor } from '@/stores/view/qvain/qvain.actors'
import { ButtonContainer, AddNewButton } from '@/components/qvain/general/buttons'
import { useStores } from '@/components/qvain/utils/stores'
import { withFieldErrorBoundary } from '@/components/qvain/general/errors/fieldErrorBoundary'
import AddedActors from './addedActors'

const ActorsField = () => {
  const Stores = useStores()
  const { editActor } = Stores.Qvain.Actors
  const { readonly } = Stores.Qvain

  const createActor = () => {
    editActor(Actor())
  }

  return (
    <SectionContentWrapper>
      <AddedActors />
      <ButtonContainer>
        <AddNewButton
          type="button"
          onClick={createActor}
          disabled={readonly}
          data-cy="add-new-actor"
        >
          <Translate content="qvain.actors.addButton" />
        </AddNewButton>
      </ButtonContainer>
    </SectionContentWrapper>
  )
}

export default withFieldErrorBoundary(observer(ActorsField), 'qvain.actors.added.title')
