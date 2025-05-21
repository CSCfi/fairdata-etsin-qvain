import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactSelect, { components as selectComponents } from 'react-select'
import { observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'

import Translate from '@/utils/Translate'
import { Title, FieldGroup, InfoText } from '@/components/qvain/general/V2'
import { useStores } from '@/stores/stores'
import { Actor } from '@/stores/view/qvain/qvain.actors'
import { ROLE } from '@/utils/constants'
import parseActorLabel from '@/components/qvain/utils/actor'

import ActorsList from './ActorsList'

const ActorsInput = () => {
  const {
    Qvain: { Actors, Provenances, readonly },
    Locale: { lang: language, translate },
  } = useStores()

  const associations = Provenances.inEdit.associations || {}
  const selectedOptions = associations.actorOptions || []
  const selectedOptionIds = selectedOptions.map(option => option.value)
  const translationsRoot = Provenances.associationsTranslationsRoot
  const CreateOption = { Option: CustomOption }

  const getRoleTranslation = role => translate(`qvain.actors.add.checkbox.${role}`)

  const options = [
    {
      value: 'create-actor',
      label: translate(`${translationsRoot}.createButton`),
    },
    ...Actors.actorOptions
      .filter(option => !selectedOptionIds.includes(option.value))
      .map(option => {
        const rolesStr = option.roles.map(getRoleTranslation)
        const actorName = parseActorLabel(option, language)
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
    const id = selection?.value
    if (id === 'create-actor') {
      createActor()
      setSelectedActor(null)
      return
    }
    if (id) {
      Provenances.inEdit.associations.addActorWithId(id)
      Provenances.inEdit.associations.addRole(id, ROLE.PROVENANCE)
      setSelectedActor(undefined)
    }
  }

  const setSelectedActor = value => {
    Provenances.changeAttribute('selectedActor', value)
  }

  const styles = {
    option: style => ({
      ...style,
      display: 'flex',
      alignItems: 'center',
    }),
  }

  return (
    <FieldGroup>
      <Translate component={Title} content={`${translationsRoot}.label`} htmlFor="actors-select" />
      <ActorsList
        language={language}
        actors={Provenances.inEdit.associations}
        items={selectedOptions}
      />
      <Translate
        component={ReactSelect}
        inputId="actors-select"
        options={options}
        styles={styles}
        components={CreateOption}
        value={Provenances.inEdit.selectedActor}
        menuPlacement="auto"
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
        isClearable
        isDisabled={readonly}
        onChange={handleSelect}
        placeholder=""
      />
      <Translate component={InfoText} content={`${translationsRoot}.infoText`} />
    </FieldGroup>
  )
}

export const CustomOption = ({ children, ...props }) => (
  <selectComponents.Option {...props}>
    {children} {props.value === 'create-actor' && <EditIcon color="primary" />}
  </selectComponents.Option>
)

CustomOption.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

const EditIcon = styled(FontAwesomeIcon).attrs({
  icon: faPen,
})`
  color: ${props => props.theme.color[props.color || 'primary']};
  margin: 0 0.5rem;
  margin-left: auto;
`

export default observer(ActorsInput)
