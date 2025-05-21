import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { FieldGroup, FieldInput, InfoText, Required, RequiredText, Title } from './index'
import ValidationError from '../errors/validationError'

const ModalInput = ({ Field, datum, handleBlur, type, error, translationsRoot, isRequired }) => {
  const { changeAttribute, fieldTranslationsRoot } = Field
  const t = translationsRoot || fieldTranslationsRoot
  const translations = {
    label: `${t}.${datum}.label`,
    infoText: `${t}.${datum}.infoText`,
  }

  return (
    <FieldGroup>
      <Title htmlFor={`${datum}-field`}>
        <Translate content={translations.label} />
        {isRequired && <Required />}
      </Title>
      <Translate
        component={ModalInputElem}
        type={type}
        id={`${datum}-field`}
        autoFocus
        disabled={Field.readonly}
        value={Field.inEdit[datum] || ''}
        onChange={event => changeAttribute(datum, event.target.value)}
        onBlur={handleBlur}
      />
      {isRequired && <RequiredText />}
      <Translate component={InfoText} content={translations.infoText} />
      {error && <ModalError>{error}</ModalError>}
    </FieldGroup>
  )
}

ModalInput.propTypes = {
  Field: PropTypes.object.isRequired,
  datum: PropTypes.string.isRequired,
  type: PropTypes.string,
  handleBlur: PropTypes.func,
  error: PropTypes.string,
  translationsRoot: PropTypes.string,
  isRequired: PropTypes.bool,
}

ModalInput.defaultProps = {
  isRequired: false,
  handleBlur: () => undefined,
  type: 'text',
  error: '',
  translationsRoot: null,
}

export const ModalError = styled(ValidationError)`
  margin-bottom: 0.5rem;
`

export const ModalInputElem = styled(FieldInput)`
  + ${ModalError} {
    margin-top: -0.5rem;
  }
`

export default observer(ModalInput)
