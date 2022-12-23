import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'

import {
  onChange,
  onChangeMulti,
  getCurrentOption,
  getGroupLabel,
  getOptionLabel,
  getOptionValue,
  sortGroups,
  sortOptions,
  autoSortOptions,
} from '@/components/qvain/utils/select'
import getReferenceData from '@/components/qvain/utils/getReferenceData'
import { withStores } from '@/stores/stores'
import AbortClient, { isAbort } from '@/utils/AbortClient'

class Select extends Component {
  client = new AbortClient()

  static propTypes = {
    Stores: PropTypes.object.isRequired,
    metaxIdentifier: PropTypes.string.isRequired,
    getter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    getRefGroups: PropTypes.func,
    modifyOptionLabel: PropTypes.func,
    modifyGroupLabel: PropTypes.func,
    sortFunc: PropTypes.func,
    setter: PropTypes.func.isRequired,
    model: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    inModal: PropTypes.bool,
    isClearable: PropTypes.bool,
    isMulti: PropTypes.bool,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    getter: undefined,
    inModal: false,
    isClearable: true,
    isMulti: false,
    getRefGroups: null,
    modifyOptionLabel: translation => translation,
    modifyGroupLabel: translation => translation,
    sortFunc: null,
    placeholder: '',
  }

  state = {
    options: [],
  }

  componentDidMount = () => {
    getReferenceData(this.props.metaxIdentifier, { client: this.client })
      .then(this.resolveRefData)
      .catch(this.rejectRefData)
  }

  componentWillUnmount() {
    this.client.abort()
  }

  resolveRefData = res => {
    const list = res.data.hits.hits
    const { model, getRefGroups, Stores, sortFunc } = this.props
    const { lang } = Stores.Locale

    if (getRefGroups) {
      const groups = getRefGroups(list)
      sortGroups(model, lang, groups)
      this.setState({
        options: groups,
      })
    } else {
      const options = list.map(ref => model(ref._source.label, ref._source.uri))
      sortOptions(model, lang, options, sortFunc)
      this.setState({
        options,
      })
    }
    autoSortOptions(this, this.props.Stores.Locale, model, sortFunc)
  }

  rejectRefData = error => {
    if (isAbort(error)) {
      return
    }
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
    const {
      getter,
      setter,
      model,
      name,
      inModal,
      isClearable,
      isMulti,
      modifyGroupLabel,
      modifyOptionLabel,
      placeholder,
    } = this.props
    const { options } = this.state
    const { lang } = this.props.Stores.Locale

    const groupLabelFunc = getGroupLabel(lang)
    const optionLabelFunc = getOptionLabel(model, lang)

    const props = {
      ...this.props,
      inputId: `${name}-select`,
      attributes: { placeholder },
      isDisabled: readonly,
      value: getCurrentOption(model, options, getter),
      classNamePrefix: 'select',
      options,
      onChange: isMulti ? onChangeMulti(setter) : onChange(setter),
      isClearable,
      isMulti,
      formatGroupLabel: group => modifyGroupLabel(groupLabelFunc(group), group),
      getOptionLabel: option => modifyOptionLabel(optionLabelFunc(option), option),
      getOptionValue: getOptionValue(model),
      ariaAutocomplete: 'list',
    }

    if (inModal) {
      props.menuPlacement = 'auto'
      props.menuPosition = 'fixed'
      props.menuShouldScrollIntoView = false
    }

    if (!(props.attributes && props.attributes.placeholder)) {
      props.attributes = { ...props.attributes, placeholder }
    }

    return <Translate component={ReactSelect} {...props} />
  }
}

export default withStores(observer(Select))
