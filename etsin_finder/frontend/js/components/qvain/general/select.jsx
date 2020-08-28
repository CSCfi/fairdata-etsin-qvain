import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
import { inject, observer } from 'mobx-react'

import { onChange, getCurrentValue } from '../utils/select'
import getReferenceData from '../utils/getReferenceData'

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
    placeholder: PropTypes.string,
    noOptionsMessage: PropTypes.string,
  }

  static defaultProps = {
    getter: undefined,
    inModal: false,
    placeholder: 'qvain.select.placeholder',
    noOptionsMessage: null,
  }

  state = {
    options: { en: [], fi: [] },
  }

  componentDidMount = () => {
    this.promises.push(
      getReferenceData(this.props.metaxIdentifier)
        .then(this.resolveRefData)
        .catch(this.rejectRefData)
    )
  }

  componentWillUnmount() {
    this.promises.forEach(promise => promise && promise.cancel && promise.cancel())
  }

  resolveRefData = res => {
    const list = res.data.hits.hits
    const refsEn = list.map(ref => ({
      value: ref._source.uri,
      label: ref._source.label.en || ref._source.label.und,
    }))
    const refsFi = list.map(ref => ({
      value: ref._source.uri,
      label: ref._source.label.fi || ref._source.label.und,
    }))
    this.setState({
      options: {
        en: refsEn,
        fi: refsFi,
      },
    })
  }

  rejectRefData = error => {
    if (error.response) {
      // Error response from Metax
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      // No response from Metax
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
  }

  render() {
    const { readonly } = this.props.Stores.Qvain
    const { getter, setter, model, name, inModal, placeholder, noOptionsMessage } = this.props
    const { options } = this.state
    const { lang } = this.props.Stores.Locale

    const selectProps = {
      name,
      inputId: `${name}-select`,
      component: ReactSelect,
      attributes: { placeholder },
      isDisabled: readonly,
      value: getCurrentValue(getter, options, lang),
      className: 'basic-single',
      classNamePrefix: 'select',
      defaultOptions: [],
      options: options[lang],
      onChange: onChange(options, lang, setter, model),
      isClearable: true,
    }

    if (noOptionsMessage) {
      selectProps.noOptionsMessage = ({ inputValue }) => {
        if (inputValue) return counterpart(noOptionsMessage)
        return counterpart(placeholder)
      }
    }

    return inModal ? (
      <Translate
        {...selectProps}
        menuPlacement="auto"
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
      />
    ) : <Translate {...selectProps} />
  }
}

export default inject('Stores')(observer(Select))
