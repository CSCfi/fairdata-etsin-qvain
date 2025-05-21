import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faUser } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

import { Input } from '../../general/modal/form'
import { ENTITY_TYPE } from '../../../../utils/constants'
import ValidationError from '../../general/errors/validationError'

export const ActorIcon = observer(({ actor, ...props }) => (
  <FontAwesomeIcon icon={actor.type === ENTITY_TYPE.PERSON ? faUser : faBuilding} {...props} />
))
ActorIcon.propTypes = {
  actor: PropTypes.object.isRequired,
}

export const getOrganizationName = (org, lang) => {
  // Check if org is object. If object then it comes from edit and the
  // values can be uncertain.
  // If the org object contains the current language, return that.
  // If not but contains 'und' language, return that.
  // Else find any language it contains and return that.
  const name = org.name
  if (typeof name === 'object' && name !== null) {
    if (lang in name) {
      return name[lang]
    }
    if ('und' in name) {
      return name.und
    }
    return Object.values(name)[0]
  }
  return name || ''
}

export const getOrganizationArrayName = (orgs, lang) => {
  const orgNames = orgs.map(org => {
    const name = org.name
    if (typeof name === 'object' && name !== null) {
      if (lang in name) {
        return name[lang]
      }
      if ('und' in name) {
        return name.und
      }
      const langX = Object.keys(name)[0]
      return name[langX]
    }
    return name
  })
  return orgNames.join(', ')
}

export const getActorName = (actor, lang) => {
  if (actor.type === ENTITY_TYPE.PERSON) {
    return actor.person.name || ''
  }
  return getOrganizationArrayName(actor.organizations, lang)
}

export const ActorError = styled(ValidationError)`
  margin-bottom: 0.5rem;
`

export const ActorInput = styled(Input)`
  margin-bottom: 0.75rem;
  + ${ActorError} {
    margin-top: -0.5rem;
  }
`
