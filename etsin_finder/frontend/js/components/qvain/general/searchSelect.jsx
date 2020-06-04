import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select/async'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import { getOptions, getCurrentValue, onChange } from '../utils/select'

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
  }

  static defaultProps = {
    getter: undefined,
    inModal: false,
  }

  state = {
    options: { en: [], fi: [] },
  }

  render() {
    const { readonly } = this.props.Stores.Qvain
    const { getter, setter, name, model, inModal, metaxIdentifier } = this.props
    const { options } = this.state
    const { lang } = this.props.Stores.Locale

    return inModal ? (
      <Translate
        name={name}
        className="basic-single"
        classNamePrefix="select"
        inputId={`${name}-select`}
        component={ReactSelect}
        attributes={{ placeholder: 'qvain.select.placeholder' }}
        isDisabled={readonly}
        value={getCurrentValue(getter, options, lang) || ''}
        onChange={onChange(options, lang, setter, model)}
        cacheOptions
        defaultOptions={[]}
        loadOptions={inputValue =>
          new Promise(async res => {
            const opts = await getOptions(metaxIdentifier, inputValue)
            this.setState({ options: opts })
            res(opts[lang])
          })
        }
        menuPlacement="auto"
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
      />
    ) : (
      <Translate
        name={name}
        className="basic-single"
        classNamePrefix="select"
        inputId={`${name}-select`}
        component={ReactSelect}
        attributes={{ placeholder: 'qvain.select.placeholder' }}
        isDisabled={readonly}
        value={getCurrentValue(getter, options, lang) || ''}
        onChange={onChange(options, lang, setter, model)}
        cacheOptions
        defaultOptions={[]}
        loadOptions={inputValue =>
          new Promise(async res => {
            const opts = await getOptions(metaxIdentifier, inputValue)
            this.setState({ options: opts })
            res(opts[lang])
          })
        }
      />
    )
  }
}

export default inject('Stores')(observer(Select))
