import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { FieldWrapper, FieldGroup, FieldInput, FieldLabel, InfoText, RequiredText } from './index'
import ValidationError from '../errors/validationError'

const TabInput = ({
  language,
  datum,
  Field,
  handleBlur,
  type,
  error,
  isRequired,
  translationsRoot,
}) => {
  const { changeAttribute, inEdit, readonly, translationsRoot: fieldTranslationsRoot } = Field

  const handleChange = event => {
    const newData = { ...inEdit[datum], [language]: event.target.value }
    changeAttribute(datum, newData)
  }

  const t = translationsRoot || fieldTranslationsRoot
  const translations = language
    ? {
        label: `${t}.${datum}.${language}.label`,
        infoText: `${t}.${datum}.${language}.infoText`,
      }
    : {
        label: `${t}.${datum}.label`,
        infoText: `${t}.${datum}.infoText`,
      }
  const id = `${datum}Field`

  return (
    <FieldGroup>
      <FieldWrapper>
        <FieldLabel htmlFor={id}>
          <Translate content={translations.label} /> {isRequired ? '*' : ''}
        </FieldLabel>
        <Translate
          component={TabInputElem}
          type={type}
          id={id}
          autoFocus
          disabled={readonly}
          value={(inEdit[datum] || {})[language]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FieldWrapper>
      {isRequired && <RequiredText weight={2} />}
      <Translate component={InfoText} content={translations.infoText} weight={isRequired ? 1 : 2} />

      {error && <TabError>{error}</TabError>}
    </FieldGroup>
  )
}

TabInput.propTypes = {
  Field: PropTypes.object.isRequired,
  datum: PropTypes.string.isRequired,
  type: PropTypes.string,
  handleBlur: PropTypes.func,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
  language: PropTypes.string.isRequired,
  translationsRoot: PropTypes.string,
}

TabInput.defaultProps = {
  isRequired: false,
  handleBlur: () => undefined,
  error: '',
  type: 'text',
  translationsRoot: null,
}

const TabError = styled(ValidationError)`
  margin-bottom: 0.5rem;
`

const TabInputElem = styled(FieldInput)`
  margin-bottom: 0.75rem;
  + ${TabError} {
    margin-top: -0.5rem;
  }
`

export default observer(TabInput)
