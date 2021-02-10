import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { Textarea, LabelLarge } from '../../../general/modal/form'
import Tooltip from '../../../../general/tooltipHover'
import ValidationError from '../../../general/errors/validationError'
import { useStores } from '../../../utils/stores'

const DescriptionFieldTextField = ({ propName, fieldName, activeLang }) => {
  const {
    Qvain: {
      [fieldName]: { value, set, validate, validationError },
      readonly,
    },
    Locale: { lang },
  } = useStores()

  const handleChange = e => {
    set(e.target.value, activeLang)
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
        component={Textarea}
        id={id}
        disabled={readonly}
        value={value[activeLang]}
        onChange={handleChange}
        onBlur={validate}
        attributes={{ placeholder: getPlaceholder() }}
        required
      />
      {validationError && <ValidationError>{validationError}</ValidationError>}
    </>
  )
}

DescriptionFieldTextField.propTypes = {
  propName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  activeLang: PropTypes.string.isRequired,
}

export default observer(DescriptionFieldTextField)
