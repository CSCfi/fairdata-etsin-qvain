import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import AddedActors from './addedActors'
import ActorTitle from './actorTitle'
import { Container } from '../../general/card'
import { Actor } from '../../../../stores/view/qvain.actors'
import Button from '../../../general/button'

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

const ButtonContainer = styled.div`
  text-align: right;
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
`

export default inject('Stores')(observer(ActorsField))
