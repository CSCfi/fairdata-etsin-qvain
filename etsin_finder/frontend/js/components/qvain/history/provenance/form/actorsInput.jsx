import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactSelect, { components as selectComponents } from 'react-select'
import Translate from 'react-translate-component'
import { inject, observer, Observer } from 'mobx-react'
import translate from 'counterpart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { Label } from '../../../general/form'
import Button from '../../../../general/button'
import ActorsList from './actorsList'
import { Actor } from '../../../../../stores/view/qvain.actors'
import { ROLE } from '../../../../../utils/constants'

const ActorsInput = ({ Stores, language }) => {
  const { Actors, Provenances } = Stores.Qvain

  const CreateOption = { Option: CustomOption }

  const options = [
    { value: 'create-actor', label: 'Luo uusi toimija' },
    ...Actors.actorOptions.map(option => {
      const actorName = option.label[language] || option.label
      const rolesStr = option.roles.map(role => `${translate(`qvain.actors.add.checkbox.${role}`)}`)
      const name = `${actorName} / ${rolesStr.join(' / ')}`

      return {
        value: option.value,
        label: name,
      }
    }),
  ]

  const createActor = () => {
    const { editActor } = Actors
    editActor(Actor({ roles: [ROLE.PROVENANCE] }), freshActor =>
      Provenances.inEdit.associations.addActorWithId(freshActor.uiid)
    )
  }

  const handleSelect = selection => {
    if ((selection || {}).value === 'create-actor') {
      createActor()
      setSelectedActor(null)
      return
    }
    setSelectedActor(selection)
  }

  const setSelectedActor = value => {
    Stores.Qvain.Provenances.changeAttribute('selectedActor', value)
  }

  return (
    <Observer>
      {() => (
        <>
          <Translate
            component={Label}
            content="qvain.history.provenance.modal.actorsInput.label"
            htmlFor="actors-input"
          />
          <ActorsList
            language={language}
            Stores={Stores}
            actors={Provenances.inEdit.associations}
            items={(Provenances.inEdit.associations || {}).actorOptions}
          />
          <Translate
            component={ReactSelect}
            inputId="actors-select"
            attributes={{ placeholder: 'qvain.select.placeholder' }}
            options={options}
            components={CreateOption}
            value={Provenances.inEdit.selectedActor}
            menuPlacement="auto"
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            isClearable
            onChange={handleSelect}
          />
          <ButtonContainer>
            <Translate
              component={Button}
              content="qvain.history.provenance.modal.actorsInput.addButton"
              onClick={() => {
                if (!Provenances.inEdit.selectedActor) return
                const id = Provenances.inEdit.selectedActor.value
                Provenances.inEdit.associations.addActorWithId(id)
                Stores.Qvain.Provenances.inEdit.associations.addRole(id, ROLE.PROVENANCE)
                setSelectedActor('selectedActor', undefined)
              }}
            />
          </ButtonContainer>
        </>
      )}
    </Observer>
  )
}

const CustomOption = ({ children, ...props }) => (
  <>
    <selectComponents.Option
      {...props}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      {children} {props.value === 'create-actor' && <EditIcon color="primary" />}
    </selectComponents.Option>
  </>
)

CustomOption.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

const EditIcon = styled(FontAwesomeIcon).attrs(() => ({
  icon: faPen,
}))`
  color: ${props => props.theme.color[props.color || 'primary']};
  margin: 0 0.5rem;
  margin-left: auto;
`

ActorsInput.propTypes = {
  Stores: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
}

const ButtonContainer = styled.div`
  text-align: left;
`

export default inject('Stores')(observer(ActorsInput))
