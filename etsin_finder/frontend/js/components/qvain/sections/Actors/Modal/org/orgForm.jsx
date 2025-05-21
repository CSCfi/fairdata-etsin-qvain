import { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import { Label } from '../../../../general/modal/form'
import { ActorInput, ActorError } from '../../common'
import { useStores } from '../../../../utils/stores'
import {
  FieldGroup,
  FieldWrapper,
  InfoText,
  Divider,
  ModalLabel,
} from '@/components/qvain/general/V2'

export const OrgFormBase = ({ organization, updateOrganization }) => {
  const [nameError, setNameError] = useState()
  const [emailError, setEmailError] = useState()
  const [identifierError, setIdentifierError] = useState()
  const {
    Locale: { lang: preferredLang, languages },
    Qvain: {
      readonly,
      Actors: { organizationNameSchema, organizationEmailSchema, organizationIdentifierSchema },
    },
  } = useStores()
  const schemas = {
    name: organizationNameSchema,
    email: organizationEmailSchema,
    identifier: organizationIdentifierSchema,
  }

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
  const nameLang = getNameLang()

  return (
    <>
      <Translate
        component={ModalLabel}
        content="qvain.actors.add.organization.labels.manualOrganization"
      />
      <Divider />
      <FormContainer>
        <FieldGroup>
          <FieldWrapper>
            <Label htmlFor="nameField">
              <Translate content="qvain.actors.add.organization.labels.name" /> *
            </Label>
            <Translate
              component={ActorInput}
              type="text"
              id="nameField"
              autoFocus
              disabled={readonly}
              value={organization.name[nameLang] || ''}
              onChange={event => handleUpdateName(event.target.value, nameLang)}
              onBlur={() => handleOnBlur('name', nameLang)}
            />
          </FieldWrapper>
          <Translate
            component={InfoText}
            content="qvain.actors.add.name.infoText.manualOrganization"
            weight={2}
          />
          {nameError && <ActorError>{nameError}</ActorError>}
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="emailField">
            <Translate content="qvain.actors.add.organization.labels.email" />
          </Label>
          <Translate
            component={ActorInput}
            type="text"
            id="emailField"
            disabled={readonly}
            value={organization.email}
            onChange={event => handleUpdateEmail(event.target.value)}
            onBlur={() => handleOnBlur('email')}
          />
          <Translate component={InfoText} content="qvain.actors.add.email.infoText" weight={2} />
          {emailError && <ActorError>{emailError}</ActorError>}
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="identifierField">
            <Translate content="qvain.actors.add.organization.labels.identifier" />
          </Label>
          <Translate
            id="identifierField"
            component={ActorInput}
            type="text"
            disabled={readonly}
            onChange={event => handleUpdateIdentifier(event.target.value)}
            value={organization.identifier}
            onBlur={() => handleOnBlur('identifier')}
          />
          <Translate
            component={InfoText}
            content="qvain.actors.add.identifier.infoText.organization"
            weight={2}
          />
          {identifierError && <ActorError>{identifierError}</ActorError>}
        </FieldGroup>
      </FormContainer>
    </>
  )
}

OrgFormBase.propTypes = {
  organization: PropTypes.object.isRequired,
  updateOrganization: PropTypes.func.isRequired,
}

const FormContainer = styled.div`
  border: 1px solid #ccc;
  padding: 0.5rem;
  padding-top: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
`

export default observer(OrgFormBase)
