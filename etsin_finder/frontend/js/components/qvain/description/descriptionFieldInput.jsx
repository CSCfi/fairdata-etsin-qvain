import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { Input, LabelLarge } from '../general/modal/form'
import Tooltip from '../../general/tooltipHover'
import ValidationError from '../general/errors/validationError'

class DescriptionFieldInput extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    fieldName: PropTypes.string.isRequired,
    propName: PropTypes.string.isRequired,
    activeLang: PropTypes.string.isRequired,
  }

  handleChange = e => {
    const { fieldName, activeLang } = this.props
    const { set } = this.props.Stores.Qvain[fieldName]
    set(e.target.value, activeLang)
  }

  handleBlur = () => {
    const { fieldName, Stores } = this.props
    const { validate } = Stores.Qvain[fieldName]
    validate()
  }

  getPlaceholder = () => {
    const { propName, activeLang } = this.props
    const stub = `qvain.description.description.${propName}.`
    return activeLang === 'fi' ? `${stub}placeholderFi` : `${stub}placeholderEn`
  }

  render() {
    const { fieldName, propName, activeLang } = this.props
    const { value, readonly, validationError } = this.props.Stores.Qvain[fieldName]
    const { lang } = this.props.Stores.Locale
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
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          attributes={{ placeholder: this.getPlaceholder() }}
        />
        {validationError && (
          <Translate component={ValidationError} content={`qvain.description.error.${propName}`} />
        )}
      </>
    )
  }
}

DescriptionFieldInput.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(DescriptionFieldInput))
