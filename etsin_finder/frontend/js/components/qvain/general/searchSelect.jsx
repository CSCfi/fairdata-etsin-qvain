import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select/async'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import {
  onChange,
  onChangeMulti,
  getOptions,
  getOptionLabel,
  getOptionValue,
  sortOptions,
} from '../utils/select'

class Select extends Component {
  promises = []

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    metaxIdentifier: PropTypes.string.isRequired,
    getter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    setter: PropTypes.func.isRequired,
    model: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    inModal: PropTypes.bool,
    placeholder: PropTypes.string,
    isMulti: PropTypes.bool,
  }

  static defaultProps = {
    getter: undefined,
    inModal: false,
    placeholder: 'qvain.select.searchPlaceholder',
    isMulti: false,
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
      placeholder,
      isMulti,
    } = this.props
    const { lang } = this.props.Stores.Locale

    const props = {
      ...this.props,
      classNamePrefix: 'select',
      inputId: `${name}-select`,
      component: ReactSelect,
      attributes: { placeholder },
      isDisabled: readonly,
      value: getter,
      onChange: isMulti ? onChangeMulti(setter) : onChange(setter),
      cacheOptions: true,
      defaultOptions: [],
      getOptionLabel: getOptionLabel(model, lang),
      getOptionValue: getOptionValue(model),
      loadOptions: async inputValue => {
        const opts = await getOptions(model, metaxIdentifier, inputValue)
        sortOptions(model, lang, opts)
        return opts
      },
    }

    return inModal ? (
      <Translate
        {...props}
        menuPlacement="auto"
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
      />
    ) : (
      <Translate {...props} />
    )
  }
}

export default inject('Stores')(observer(Select))
