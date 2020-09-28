import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import translate from 'counterpart'

import { Textarea, LabelLarge } from '../general/modal/form'
import Tooltip from '../../general/tooltipHover'
import ValidationError from '../general/errors/validationError'

class DescriptionFieldTextField extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    propName: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
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
    const { propName, activeLang, fieldName } = this.props
    const { readonly, value, validationError } = this.props.Stores.Qvain[fieldName]
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
          component={Textarea}
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

DescriptionFieldTextField.propTypes = {
  Stores: PropTypes.object.isRequired,
}

export default inject('Stores')(observer(DescriptionFieldTextField))
