import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import {
  FieldGroup,
  FieldInput,
  InfoText,
  Required,
  RequiredText,
  Title,
} from '@/components/qvain/general/V2'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { useStores } from '@/stores/stores'

const ModalInput = ({ fieldName, item, type, isRequired, changeCallback }) => {
  const {
    Qvain: { readonly },
  } = useStores()

  const {
    controller: { set, validate },
    translationPath,
    [fieldName]: value,
    validationError,
  } = item

  const translations = {
    label: `${translationPath}.fields.${fieldName}.label`,
    infoText: `${translationPath}.fields.${fieldName}.infoText`,
  }

  const handleChange = event => {
    set({ fieldName, value: event.target.value })
    changeCallback()
  }

  return (
    <FieldGroup>
      <Title htmlFor={`${fieldName}-field`}>
        <Translate content={translations.label} />
        {isRequired && <Required />}
      </Title>
      <Translate
        component={ModalInputElem}
        type={type}
        id={`${fieldName}-field`}
        disabled={readonly}
        value={value}
        onChange={handleChange}
        onBlur={() => validate(fieldName)}
      />
      {isRequired && <RequiredText />}
      <Translate component={InfoText} content={translations.infoText} />
      {validationError[fieldName] && <ModalError>{validationError[fieldName]}</ModalError>}
    </FieldGroup>
  )
}

ModalInput.propTypes = {
  item: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  type: PropTypes.string,
  isRequired: PropTypes.bool,
  changeCallback: PropTypes.func,
}

ModalInput.defaultProps = {
  isRequired: false,
  type: 'text',
  changeCallback: () => {},
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
