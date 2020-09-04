import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Observer } from 'mobx-react'
import { Input, Label } from './form'
import ValidationError from './validationError'

const ModalInput = ({ Field, translationsRoot, datum, handleBlur, type, error, isRequired }) => {
  const { changeAttribute, readonly } = Field
  const translations = {
    label: `${translationsRoot}.modal.${datum}Input.label`,
    placeholder: `${translationsRoot}.modal.${datum}Input.placeholder`,
  }

  return (
    <>
      <Label htmlFor={`${datum}Field`}>
        <Translate content={translations.label} /> {isRequired ? '*' : ''}
      </Label>
      <Observer>
        {() => (
          <Translate
            component={ModalInputElem}
            type={type}
            id={`${datum}Field`}
            autoFocus
            attributes={{ placeholder: translations.placeholder }}
            disabled={readonly}
            value={Field.inEdit[datum] || ''}
            onChange={event => changeAttribute(datum, event.target.value)}
            onBlur={() => handleBlur()}
          />
        )}
      </Observer>
      {error && <ModalError>{error}</ModalError>}
    </>
  )
}

ModalInput.propTypes = {
  Field: PropTypes.object.isRequired,
  datum: PropTypes.string.isRequired,
  translationsRoot: PropTypes.string.isRequired,
  type: PropTypes.string,
  handleBlur: PropTypes.func,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
}

ModalInput.defaultProps = {
  isRequired: false,
  handleBlur: () => {},
  type: 'text',
  error: '',
}

export const ModalError = styled(ValidationError)`
  margin-bottom: 0.5rem;
`

export const ModalInputElem = styled(Input)`
  margin-bottom: 0.75rem;
  + ${ModalError} {
    margin-top: -0.5rem;
  }
`

export default ModalInput
