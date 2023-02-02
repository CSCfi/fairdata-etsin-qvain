import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import {
  Title,
  FieldGroup,
  FieldWrapper,
  Required,
  RequiredTextTitleOrDescription,
  InfoText,
} from '@/components/qvain/general/V2'
import { Input } from '@/components/qvain/general/modal/form'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { useStores } from '@/stores/stores'

const DescriptionFieldInput = ({ propName, fieldName, activeLang }) => {
  const {
    Qvain: {
      [fieldName]: { value, set, validate, validationError },
      readonly,
    },
  } = useStores()

  const handleChange = e => {
    set(e.target.value, activeLang)
  }

  const id = `${propName}Input`
  return (
    <FieldGroup>
      <FieldWrapper>
        <Title htmlFor={id}>
          <Translate content={`qvain.description.description.${propName}.label`} />
          <Required />
        </Title>
        <Translate
          component={StyledInput}
          type="text"
          id={id}
          disabled={readonly}
          value={value[activeLang] || ''}
          onChange={handleChange}
          onBlur={validate}
          placeholder=""
          required
        />
        <RequiredTextTitleOrDescription />
        <Translate
          component={InfoText}
          content={`qvain.description.description.title.infoText.${activeLang}`}
        />
      </FieldWrapper>
      {validationError && <ValidationError>{validationError}</ValidationError>}
    </FieldGroup>
  )
}

DescriptionFieldInput.propTypes = {
  propName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  activeLang: PropTypes.string.isRequired,
}

const StyledInput = styled(Input)`
  margin-bottom: 0.5rem;
`

export default observer(DescriptionFieldInput)
