import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import {
  onChange,
  onChangeMulti,
  getCurrentOption,
  getOptionLabel,
  getOptionValue,
  sortOptions,
  autoSortOptions,
} from '../../utils/select'
import getReferenceData from '../../utils/getReferenceData'
import etsinTheme from '../../../../styles/theme'
import { withStores } from '../../utils/stores'

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
    isClearable: PropTypes.bool,
    isMulti: PropTypes.bool,
  }

  static defaultProps = {
    getter: undefined,
    inModal: false,
    isClearable: true,
    isMulti: false,
  }

  state = {
    options: [],
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
    const { model } = this.props
    const options = list.map(ref => model(ref._source.label, ref._source.uri))
    const { lang } = this.props.Stores.Locale
    sortOptions(model, lang, options)
    this.setState({
      options,
    })
    autoSortOptions(this, this.props.Stores.Locale, model)
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
    const { getter, setter, model, name, inModal, isClearable, isMulti } = this.props
    const { options } = this.state
    const { lang } = this.props.Stores.Locale

    const props = {
      ...this.props,
      inputId: `${name}-select`,
      component: ReactSelect,
      attributes: { placeholder: 'qvain.select.placeholder' },
      isDisabled: readonly,
      value: getCurrentOption(model, options, getter),
      classNamePrefix: 'select',
      options,
      onChange: isMulti ? onChangeMulti(setter) : onChange(setter),
      isClearable,
      isMulti,
      getOptionLabel: getOptionLabel(model, lang),
      getOptionValue: getOptionValue(model),
      styles: { placeholder: () => ({ color: etsinTheme.color.gray }) },
    }

    if (inModal) {
      props.menuPlacement = 'auto'
      props.menuPosition = 'fixed'
      props.menuShouldScrollIntoView = false
    }

    if (!(props.attributes && props.attributes.placeholder)) {
      props.attributes = { ...props.attributes, placeholder: 'qvain.select.placeholder' }
    }

    return <Translate component={ReactSelect} {...props} />
  }
}

export default withStores(observer(Select))
