import PropTypes from 'prop-types'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import { useStores } from '@/stores/stores'

import {
  FieldWrapper,
  FieldGroup,
  FieldInput,
  FieldLabel,
  InfoText,
  RequiredText,
} from '@/components/qvain/general/V2'
import ValidationError from '@/components/qvain/general/errors/validationError'

const TabInput = ({ language, fieldName, item, changeCallback, isRequired }) => {
  const {
    Qvain: { readonly },
  } = useStores()

  const {
    [fieldName]: value,
    translationPath,
    controller: { validate, set },
    validationError,
  } = item

  const handleChange = event => {
    set({ fieldName, value: { ...value, [language]: event.target.value } })
    changeCallback()
  }

  const translations = language
    ? {
        label: `${translationPath}.fields.${fieldName}.${language}.label`,
        infoText: `${translationPath}.fields.${fieldName}.${language}.infoText`,
      }
    : {
        label: `${translationPath}.fields.${fieldName}.label`,
        infoText: `${translationPath}.fields.${fieldName}.infoText`,
      }

  const id = `${fieldName}Field`

  return (
    <FieldGroup>
      <FieldWrapper>
        <FieldLabel htmlFor={id}>
          <Translate content={translations.label} /> {isRequired ? '*' : ''}
        </FieldLabel>
        <Translate
          component={TabInputElem}
          type="text"
          id={id}
          disabled={readonly}
          value={value[language]}
          onChange={handleChange}
          onBlur={() => validate(fieldName)}
        />
      </FieldWrapper>
      {isRequired && <RequiredText weight={2} />}
      <Translate component={InfoText} content={translations.infoText} weight={isRequired ? 1 : 2} />

      {validationError?.[fieldName] && (
        <ValidationError>{validationError[fieldName]}</ValidationError>
      )}
    </FieldGroup>
  )
}

TabInput.propTypes = {
  item: PropTypes.object.isRequired,
  fieldName: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  changeCallback: PropTypes.func,
  isRequired: PropTypes.bool,
}

TabInput.defaultProps = {
  isRequired: false,
  changeCallback: () => {},
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
