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
    propName: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    activeLang: PropTypes.string.isRequired,
  }

  state = {
    [`${this.props.propName}Error`]: null,
  }

  handleChange = e => {
    const { propName, activeLang } = this.props
    const { setLangValue } = this.props.Stores.Qvain
    setLangValue(propName, e.target.value, activeLang)
    this.setState({ [`${propName}Error`]: null })
  }

  handleBlur = () => {
    const { propName, schema, Stores } = this.props
    schema
      .validate(Stores.Qvain[propName])
      .then(() => {
        this.setState({ [`${propName}Error`]: null })
      })
      .catch(err => {
        this.setState({ [`${propName}Error`]: err.errors })
      })
  }

  getPlaceholder = () => {
    const { propName } = this.props
    const { lang } = this.props.Stores.Locale
    const stub = `qvain.description.description.${propName}.`
    return lang === 'fi' ? `${stub}placeholderFi` : `${stub}placeholderEn`
  }

  render() {
    const { propName, activeLang } = this.props
    const { readonly } = this.props.Stores.Qvain
    const value = this.props.Stores.Qvain[propName] || {}
    const { lang } = this.props.Stores.Locale
    const { [`${propName}Error`]: error } = this.state
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
        {error && (
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
