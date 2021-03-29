import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Label } from '../../../../general/modal/form'
import { ActorInput, ActorError } from '../../common'
import {
  organizationNameSchema,
  organizationEmailSchema,
  organizationIdentifierSchema,
} from '../../../../utils/formValidation'
import { useStores } from '../../../../utils/stores'

const schemas = {
  name: organizationNameSchema,
  email: organizationEmailSchema,
  identifier: organizationIdentifierSchema,
}

export const OrgFormBase = ({ organization, updateOrganization }) => {
  const [nameError, setNameError] = useState()
  const [emailError, setEmailError] = useState()
  const [identifierError, setIdentifierError] = useState()
  const Stores = useStores()
  const { lang: preferredLang, languages } = Stores.Locale
  const { readonly } = Stores.Qvain

  const onError = (propTag, err) => {
    switch (propTag) {
      case 'name':
        return setNameError(err)
      case 'email':
        return setEmailError(err)
      case 'identifier':
        return setIdentifierError(err)
      default:
    }
    return null
  }

  const handleOnBlur = (propTag, lang = undefined) => {
    const value = lang ? organization[propTag][lang] : organization[propTag]
    const validator = schemas[propTag]
    validator
      .validate(value, { strict: true })
      .then(() => onError(propTag))
      .catch(err => onError(propTag, err.errors))
  }

  const handleUpdateName = (name, lang) => {
    updateOrganization({ name: { ...organization.name, [lang]: name } })
  }

  const handleUpdateEmail = email => {
    updateOrganization({ email })
  }

  const handleUpdateIdentifier = identifier => {
    updateOrganization({ identifier })
  }

  const getNameLang = () => {
    // Get organization name based on which translations exist, with the following priority:
    // - current language
    // - languages in the order of Locale.languages
    // - first language in the name object
    // - if no translations exist, create new translation in the current language
    if (organization.name[preferredLang] != null) {
      return preferredLang
    }

    for (const lang of languages) {
      if (organization.name[lang] != null) {
        return lang
      }
    }

    if (Object.keys(organization.name).length > 0) {
      return Object.keys(organization.name)
    }

    return preferredLang
  }
  const lang = getNameLang()

  return (
    <FormContainer>
      <Label htmlFor="nameField">
        <Translate content="qvain.actors.add.organization.labels.name" /> *
      </Label>
      <Translate
        component={ActorInput}
        type="text"
        id="nameField"
        autoFocus
        attributes={{ placeholder: 'qvain.actors.add.name.placeholder.organization' }}
        disabled={readonly}
        value={organization.name[lang] || ''}
        onChange={event => handleUpdateName(event.target.value, lang)}
        onBlur={() => handleOnBlur('name', lang)}
      />
      {nameError && <ActorError>{nameError}</ActorError>}

      <Label htmlFor="emailField">
        <Translate content="qvain.actors.add.organization.labels.email" />
      </Label>
      <Translate
        component={ActorInput}
        type="text"
        id="emailField"
        attributes={{ placeholder: 'qvain.actors.add.email.placeholder' }}
        disabled={readonly}
        value={organization.email}
        onChange={event => handleUpdateEmail(event.target.value)}
        onBlur={() => handleOnBlur('email')}
      />
      {emailError && <ActorError>{emailError}</ActorError>}

      <Label htmlFor="identifierField">
        <Translate content="qvain.actors.add.organization.labels.identifier" />
      </Label>
      <Translate
        id="identifierField"
        component={ActorInput}
        type="text"
        disabled={readonly}
        attributes={{ placeholder: 'qvain.actors.add.identifier.placeholder' }}
        onChange={event => handleUpdateIdentifier(event.target.value)}
        value={organization.identifier}
        onBlur={() => handleOnBlur('identifier')}
      />
      {identifierError && <ActorError>{identifierError}</ActorError>}
    </FormContainer>
  )
}

OrgFormBase.propTypes = {
  organization: PropTypes.object.isRequired,
  updateOrganization: PropTypes.func.isRequired,
}

const FormContainer = styled.div`
  border: 1px solid #ccc;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
`

export default observer(OrgFormBase)
