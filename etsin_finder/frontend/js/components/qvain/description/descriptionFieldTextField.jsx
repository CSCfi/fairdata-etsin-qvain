import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { Textarea, LabelLarge } from '../general/modal/form'
import Tooltip from '../../general/tooltipHover'
import ValidationError from '../general/errors/validationError'
import { useStores } from '../utils/stores'

const DescriptionFieldTextField = ({ propName, activeLang, schema }) => {
  const [error, setError] = useState(null)
  const {
    Qvain: { setLangValue, [propName]: value = {}, readonly },
    Locale: { lang },
  } = useStores()

  const handleChange = e => {
    setLangValue(propName, e.target.value, activeLang)
    setError(null)
  }

  const handleBlur = () => {
    schema
      .validate(value)
      .then(() => {
        setError(null)
      })
      .catch(err => {
        setError(err.errors)
      })
  }

  const getPlaceholder = () => {
    const stub = `qvain.description.description.${propName}.`
    return lang === 'fi' ? `${stub}placeholderFi` : `${stub}placeholderEn`
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
        component={Textarea}
        id={id}
        disabled={readonly}
        value={value[activeLang]}
        onChange={handleChange}
        onBlur={handleBlur}
        attributes={{ placeholder: getPlaceholder() }}
      />
      {error && (
        <Translate component={ValidationError} content={`qvain.description.error.${propName}`} />
      )}
    </>
  )
}

DescriptionFieldTextField.propTypes = {
  propName: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  activeLang: PropTypes.string.isRequired,
}

export default observer(DescriptionFieldTextField)
