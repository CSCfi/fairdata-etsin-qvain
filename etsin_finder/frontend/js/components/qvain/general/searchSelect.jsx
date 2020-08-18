import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select/async'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import { getOptions, getCurrentValue, onChange } from '../utils/select'
import etsinTheme from '../../../styles/theme'

class Select extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    metaxIdentifier: PropTypes.string.isRequired,
    getter: PropTypes.object,
    setter: PropTypes.func.isRequired,
    model: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    inModal: PropTypes.bool,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    getter: undefined,
    inModal: false,
    placeholder: ''
  }

  state = {
    options: undefined,
  }

  render() {
    const { readonly } = this.props.Stores.Qvain
    const {
      getter,
      setter,
      name,
      model,
      inModal,
      metaxIdentifier,
      placeholder
    } = this.props
    const { options } = this.state
    const { lang } = this.props.Stores.Locale

    const props = {
      ...this.props,
      className: 'basic-single',
      classNamePrefix: 'select',
      inputId: `${name}-select`,
      component: ReactSelect,
      attributes: { placeholder },
      isDisabled: readonly,
      value: getCurrentValue(getter, options, lang),
      onChange: onChange(options, lang, setter, model),
      cacheOptions: true,
      defaultOptions: [],
      styles: { placeholder: () => ({ color: etsinTheme.color.gray }) },
      loadOptions: (inputValue =>
        new Promise(async res => {
          const opts = await getOptions(metaxIdentifier, inputValue)
          this.setState({ options: opts })
          res(opts[lang])
        })
      ),
    }

    return inModal ? (
      <Translate
        {...props}
        menuPlacement="auto"
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
      />
    ) : <Translate {...props} />
  }
}

export default inject('Stores')(observer(Select))
