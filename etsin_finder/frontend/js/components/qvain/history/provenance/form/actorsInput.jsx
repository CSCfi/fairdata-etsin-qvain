import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactSelect from 'react-select'
import Translate from 'react-translate-component'
import { inject, observer, Observer } from 'mobx-react'
import translate from 'counterpart'
import { Label } from '../../../general/form'
import Button from '../../../../general/button'
import ActorsList from './actorsList'
import { Actor } from '../../../../../stores/view/qvain.actors'

const ActorsInput = ({ Stores, language }) => {
  const { Actors, Provenances } = Stores.Qvain
  const setSelectedActor = value => {
    Stores.Qvain.Provenances.changeAttribute('selectedActor', value)
  }
  const options = Actors.actorOptions.map(
    option => ({
      value: option.value,
      label: `${option.label[language] || option.label} ${option.roles.map(role => ` / ${translate(`qvain.actors.add.checkbox.${role}`)}`)}`
    })
  )

  const createActor = () => {
    const { editActor } = Actors
    editActor(Actor())
  }


  return (
    <Observer>
      {() => (
        <>
          <Translate component={Label} content="qvain.history.provenance.modal.actorsInput.label" htmlFor="actors-input" />
          <ActorsList language={language} Stores={Stores} associations={Provenances.inEdit.associations} items={Provenances.inEdit.associations.actorOptions} />
          <Translate
            component={ReactSelect}
            inputId="actors-select"
            attributes={{ placeholder: 'qvain.select.placeholder' }}
            options={options}
            value={Provenances.inEdit.selectedActor}
            menuPlacement="auto"
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            isClearable
            onChange={setSelectedActor}
          />
          <ButtonContainer>
            <Translate
              component={Button}
              content="qvain.history.provenance.modal.actorsInput.addButton"
              onClick={() => {
              Provenances.inEdit.associations.addActorWithId(Provenances.inEdit.selectedActor.value)
              setSelectedActor('selectedActor', undefined)
            }}
            />
            <Translate
              component={Button}
              content="qvain.history.provenance.modal.actorsInput.createButton"
              onClick={createActor}
            />
          </ButtonContainer>
        </>
        )}
    </Observer>
    )
}

ActorsInput.propTypes = {
  Stores: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired
}

const ButtonContainer = styled.div`
  text-align: right
`

export default inject('Stores')(observer(ActorsInput))
