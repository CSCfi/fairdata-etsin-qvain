import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { Input, LabelLarge } from '../../../general/modal/form'
import Tooltip from '../../../../general/tooltipHover'
import ValidationError from '../../../general/errors/validationError'
import { useStores } from '../../../utils/stores'

const DescriptionFieldInput = ({ propName, fieldName, activeLang }) => {
  const {
    Qvain: {
      [fieldName]: { value, set, Schema },
      readonly,
    },
    Locale: { lang },
  } = useStores()

  const [error, setError] = useState(null)

  const handleChange = e => {
    set(e.target.value, activeLang)
    setError(null)
  }

  const handleBlur = () => {
    Schema.validate(value)
      .then(() => {
        setError(null)
      })
      .catch(err => {
        setError(err.errors)
      })
  }

  const getPlaceholder = () => {
    const stub = `qvain.description.description.${propName}.`
    return activeLang === 'fi' ? `${stub}placeholderFi` : `${stub}placeholderEn`
  }

  const id = `${propName}Input`
  return (
    <>
      <LabelLarge htmlFor={id}>
        <Tooltip
          title={translate('qvain.description.fieldHelpTexts.requiredForAll', {
            locale: lang,
          })}
          position="right"
        >
          <Translate content={`qvain.description.description.${propName}.label`} /> *
        </Tooltip>
      </LabelLarge>
      <Translate
        component={Input}
        type="text"
        id={id}
        disabled={readonly}
        value={value[activeLang]}
        onChange={handleChange}
        onBlur={handleBlur}
        attributes={{ placeholder: getPlaceholder() }}
        required
      />
      {error && (
        <Translate component={ValidationError} content={`qvain.description.error.${propName}`} />
      )}
    </>
  )
}

DescriptionFieldInput.propTypes = {
  propName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  activeLang: PropTypes.string.isRequired,
}

export default observer(DescriptionFieldInput)
