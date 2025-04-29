import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'

import { FieldWrapper, NarrowTextArea, TitleSmall } from '@/components/qvain/general/V3'
import { ValidationErrors } from '@/components/qvain/general/errors'
import { useStores } from '@/stores/stores'
import Translate from '@/utils/Translate'

const DataAccessTextArea = ({ id, field, language, title }) => {
  const {
    Qvain: { readonly },
    Locale: { translate },
  } = useStores()
  const { set, value, validate, validationError } = field

  const handleChange = e => {
    set(e.target.value, language)
    validate()
  }

  return (
    <>
      <FieldWrapper>
        <TitleSmall htmlFor={id}>{translate(title)}</TitleSmall>
        <Translate
          component={NarrowTextArea}
          id={id}
          disabled={readonly}
          value={value[language] || ''}
          onChange={handleChange}
          onBlur={validate}
        />
      </FieldWrapper>
      {validationError && <ValidationErrors errors={validationError} />}
    </>
  )
}

DataAccessTextArea.propTypes = {
  field: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default observer(DataAccessTextArea)
