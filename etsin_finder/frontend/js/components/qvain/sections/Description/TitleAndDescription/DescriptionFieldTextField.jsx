import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import {
  FieldGroup,
  FieldWrapper,
  Title,
  InfoText,
  TextArea,
  Required,
  RequiredText,
} from '@/components/qvain/general/V2'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { useStores } from '@/stores/stores'

const DescriptionFieldTextField = ({ activeLang }) => {
  const {
    Qvain: {
      Description: { value, set, validate, validationError, charactersRemaining },
      readonly,
    },
    Locale: { lang },
  } = useStores()

  const handleChange = e => {
    set(e.target.value, activeLang)
  }

  const id = 'description-input'

  return (
    <FieldGroup>
      <FieldWrapper>
        <Title htmlFor={id}>
          <Translate content={`qvain.description.description.description.label`} />
          <Required />
        </Title>
        <Translate
          component={TextArea}
          id={id}
          disabled={readonly}
          value={value[activeLang]}
          onChange={handleChange}
          onBlur={validate}
          required
        />
      </FieldWrapper>
      <span>
        <RequiredText />{' '}
        <Translate
          component={InfoText}
          id="description-char-counter"
          content="qvain.description.charactersRemaining"
          with={{ charactersRemaining: charactersRemaining[lang] }}
        />
      </span>
      <Translate
        component={InfoText}
        content={`qvain.description.description.description.infoText.${activeLang}`}
      />
      {validationError && <ValidationError>{validationError}</ValidationError>}
    </FieldGroup>
  )
}

DescriptionFieldTextField.propTypes = {
  activeLang: PropTypes.string.isRequired,
}

export default observer(DescriptionFieldTextField)
