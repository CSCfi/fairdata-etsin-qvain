import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Observer } from 'mobx-react'
import { Input, Label } from './form'
import ValidationError from './validationError'


const TranslationTabInput = ({ language, datum, Field, handleBlur, type, error, isRequired, translationsRoot }) => {
  const { changeAttribute, inEdit, readonly } = Field

  const handleChange = (event) => {
      const newData = { ...inEdit[datum], [language]: event.target.value }
      changeAttribute(datum, newData)
    }

  const translations = language
  ? {
    label: `${translationsRoot}.modal.${datum}Input.${language}.label`,
    placeholder: `${translationsRoot}.modal.${datum}Input.${language}.placeholder`
  } : {
    label: `${translationsRoot}.modal.${datum}Input.label`,
    placeholder: `${translationsRoot}.modal.${datum}Input.placeholder`
  }
  const id = `${datum}Field`

  return (
    <>
      <Label htmlFor={id}>
        <Translate content={translations.label} /> {isRequired ? '*' : ''}
      </Label>
      <Observer>{() => (
        <Translate
          component={TranslationTabInputElem}
          type={type}
          id={id}
          autoFocus
          attributes={{ placeholder: translations.placeholder }}
          disabled={readonly}
          value={inEdit[datum][language]}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      )}
      </Observer>
      {error && <TranslationTabError>{error}</TranslationTabError>}
    </>
  )
}

TranslationTabInput.propTypes = {
  Field: PropTypes.object.isRequired,
  datum: PropTypes.string.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  type: PropTypes.string,
  handleBlur: PropTypes.func,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
  language: PropTypes.string.isRequired,
}

TranslationTabInput.defaultProps = {
  isRequired: false,
  handleBlur: () => {},
  error: '',
  type: 'text'
}

export const TranslationTabError = styled(ValidationError)`
  margin-bottom: 0.5rem;
`

export const TranslationTabInputElem = styled(Input)`
    margin-bottom: 0.75rem;
    + ${TranslationTabError} {
      margin-top: -0.5rem;
    }
  `

export default TranslationTabInput
