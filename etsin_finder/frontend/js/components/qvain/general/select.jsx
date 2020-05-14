import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import Translate from 'react-translate-component'
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
    name: PropTypes.string.isRequired
  }

  static defaultProps = {
    getter: undefined
  }

  state = {
    options: { en: [], fi: [] },
  }


  componentDidMount = () => {
    this.promises.push(
      getReferenceData(this.props.metaxIdentifier)
        .then(res => {
          const list = res.data.hits.hits
          const refsEn = list.map(ref => ({
            value: ref._source.uri,
            label: ref._source.label.en,
          }))
          const refsFi = list.map(ref => ({
            value: ref._source.uri,
            label: ref._source.label.fi,
          }))
          this.setState({
            options: {
              en: refsEn,
              fi: refsFi,
            },
          })
        })
        .catch(error => {
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
        })
    )
  }

  componentWillUnmount() {
    this.promises.forEach(promise => promise && promise.cancel && promise.cancel())
  }


  render() {
    const { readonly } = this.props.Stores.Qvain
    const { getter, setter, model, name } = this.props
    const { lang } = this.props.Stores.Locale
    const { options } = this.state

    return (
      <Translate
        name={name}
        inputId={`${name}-select`}
        component={ReactSelect}
        attributes={{ placeholder: 'qvain.select.placeholder' }}
        isDisabled={readonly}
        value={getCurrentValue(getter, options, lang)}
        className="basic-single"
        classNamePrefix="select"
        options={options[lang]}
        onChange={onChange(options, lang, setter, model)}
      />
    )
  }
}

export default inject('Stores')(observer(Select))
