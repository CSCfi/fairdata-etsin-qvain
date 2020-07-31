import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import Translate from 'react-translate-component'
import axios from 'axios'
import styled from 'styled-components'

import { inject, observer } from 'mobx-react'

import { getOrganizationSearchUrl } from '../../../stores/view/qvain.actors'


class OrganizationSelect extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
    name: PropTypes.string.isRequired,
    inputId: PropTypes.string.isRequired,
    placeholder: PropTypes.object,
    noOptionsMessage: PropTypes.string,
  }

  static defaultProps = {
    placeholder: {
      organization: 'qvain.select.placeholder',
      department: 'qvain.select.placeholder',
    },
    noOptionsMessage: null,
    value: undefined,
  }

  state = {
    options: {
      organization: {},
      department: {},
    }
  }

  componentDidMount() {
    this.fetchOptions()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value.organization || !nextProps.value.organization) return
    const { organization } = nextProps.value
    this.fetchAllOptions(organization.value)
  }

  fetchAllOptions = async (parentId) => {
    await this.fetchOptions()
    await this.fetchOptions(parentId)
  }

  fetchOptions = async (parentId) => {
    const url = getOrganizationSearchUrl(parentId)
    const response = await axios.get(url)
    if (response.status !== 200) return
    const { hits } = response.data.hits
    const resolvedOptions = resolveOptions(hits)
    const optionsFromState = this.state.options
    const options = parentId
      ? { ...optionsFromState, department: resolvedOptions }
      : { organization: resolvedOptions, department: {} }
    this.setState({ options })
  }

  onOrganizationChange = value => {
    this.fetchOptions(value.value)
    this.props.onChange({
      organization: value,
      department: null,
    })
  }

  onDepartmentChange = value => {
    this.props.onChange({ department: value })
  }


  render() {
    const { readonly } = this.props.Stores.Qvain
    const { lang } = this.props.Stores.Locale
    const { name, inputId, value, placeholder } = this.props
    const { options } = this.state

    return (
      // TODO: DRY
      <>
        <Translate
          component={ReactSelect}
          name={name}
          inputId={inputId}
          isDisabled={readonly}
          onChange={this.onOrganizationChange}
          value={value.organization}
          className="basic-single"
          classNamePrefix="select"
          options={options.organization[lang] || {}}
          attributes={{ placeholder: placeholder.organization }}
        />
        <Department>
          { value.organization && (
            <Translate
              component={ReactSelect}
              name={name}
              inputId={inputId}
              isDisabled={readonly}
              onChange={this.onDepartmentChange}
              value={value.department}
              className="basic-single"
              classNamePrefix="select"
              options={options.department[lang] || {}}
              attributes={{ placeholder: placeholder.department }}
            />
          ) }
        </Department>
      </>
    )
  }
}

function resolveOptions(hits) {
  return {
    en: hits.map(hit => getOption(hit, 'en')),
    fi: hits.map(hit => getOption(hit, 'fi')),
  }
}

function getOption(hit, language) {
  return {
    value: hit._source.uri,
    label: hit._source.label[language] || hit._source.label.und,
    name: {
      en: hit._source.label.en || hit._source.label.und,
      fi: hit._source.label.fi || hit._source.label.und,
      und: hit._source.label.und,
    }
  }
}

const Department = styled.div`
  margin-left: 1rem;
  margin-top: .5rem;
`

export default inject('Stores')(observer(OrganizationSelect))
