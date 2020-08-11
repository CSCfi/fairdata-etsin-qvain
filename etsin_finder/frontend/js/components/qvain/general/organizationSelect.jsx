import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import t from 'counterpart'
import Translate from 'react-translate-component'
import axios from 'axios'
import styled from 'styled-components'

import { inject, observer } from 'mobx-react'

import { getOrganizationSearchUrl } from '../../../stores/view/qvain.actors'
import { Input, Label } from './form'
import ValidationError from './validationError'


class OrganizationSelect extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    value: PropTypes.object,
    name: PropTypes.string.isRequired,
    inputId: PropTypes.string.isRequired,
    placeholder: PropTypes.object,
    noOptionsMessage: PropTypes.string,
    creatable: PropTypes.bool,
  }

  static defaultProps = {
    placeholder: {
      organization: 'qvain.select.placeholder',
      department: 'qvain.select.placeholder',
    },
    creatable: true,
    noOptionsMessage: null,
    value: undefined,
  }

  state = {
    options: {
      organization: {},
      department: {},
      subDepartment: {},
    }
  }

  componentDidMount() {
    this.fetchOptions()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value.organization || !nextProps.value.organization) return
    const { organization, department } = nextProps.value
    this.fetchOptions(organization.value || null, department ? department.value : null)
  }

  fetchAllOptions = async (parentId, departmentParentId) => {
    await this.fetchOptions(parentId, departmentParentId)
  }

  clearOptions = () => {
    const { options } = this.state
    this.setState({
      options: { ...options, department: {}, subDepartment: {} }
    })
  }

  fetchOptions = async (parentId, departmentParentId) => {
    const organization = await resolveOptions()
    const department = parentId ? await resolveOptions(parentId) : undefined
    const subDepartment = parentId && departmentParentId ? await resolveOptions(departmentParentId) : undefined
    const options = { organization, department, subDepartment }
    this.setState({ options })
  }

  onOrganizationChange = value => {
    const { formIsOpen } = value
    const updatedFormData = { organization: value }

    if (formIsOpen) this.clearOptions()
    else {
      this.fetchOptions(value.value)
      updatedFormData.department = null
      updatedFormData.subDepartment = null
    }
    this.props.onChange(updatedFormData)
  }

  onDepartmentChange = value => {
    const { organization } = this.props.value
    const { formIsOpen } = value

    const updatedFormData = { department: value }
    if (formIsOpen) this.clearOptions()
    else {
      this.fetchOptions(organization.value, value.value)
      updatedFormData.subDepartment = null
    }
    this.props.onChange(updatedFormData)
  }

  onSubdepartmentChange = value => {
    this.props.onChange({ subDepartment: value })
  }

  render() {
    const { lang } = this.props.Stores.Locale
    const { name, inputId, value, placeholder, creatable } = this.props
    const { options } = this.state

    return (
      <>
        <Select
          onChange={this.onOrganizationChange}
          onBlur={() => this.props.onBlur('organization')}
          name={name}
          inputId={inputId}
          value={value.organization}
          options={options.organization[lang] || []}
          placeholder={placeholder.organization}
          creatable={creatable}
        />
        <Department>
          { value.organization && (
            <Select
              onChange={this.onDepartmentChange}
              onBlur={() => this.props.onBlur('department')}
              name={name}
              inputId={inputId}
              value={value.department}
              options={options.department ? options.department[lang] : []}
              placeholder={placeholder.department}
              creatable={creatable}
            />
          )}
          <Department>
            { value.department && (
              <Select
                onChange={this.onSubdepartmentChange}
                onBlur={() => this.props.onBlur('subDepartment')}
                name={name}
                inputId={inputId}
                value={value.subDepartment}
                options={options.subDepartment ? options.subDepartment[lang] : []}
                placeholder={placeholder.department}
                creatable={creatable}
              />
            )}
          </Department>
        </Department>
      </>
    )
  }
}

const CreatableSelectComponent = props => {
  const onChange = option => {
    if (option.value === 'create') {
      props.onChange({
        value: '',
        name: { und: '' },
        label: t('qvain.organizationSelect.label.addNew'),
        email: '',
        formIsOpen: true,
      })
    } else props.onChange({ ...option, formIsOpen: false })
  }

  const onFormChange = event => {
    const { name, value } = event.target
    const payload = { ...props.value } || { label: undefined, name: undefined, value: undefined }
    switch (name) {
      case 'name': {
        payload.name = { und: value }
        payload.label = value
        break
      }
      case 'email': {
        payload.email = value
        break
      }
      case 'identifier': {
        payload.value = value
        break
      }
      default: break
    }
    props.onChange(payload)
  }

  const getOptions = () => {
    const { creatable, placeholder, options } = props
    if (!creatable) return options
    return [{
      label: t('qvain.organizationSelect.label.addNew'),
      options: [{ value: 'create', label: t('qvain.organizationSelect.label.addNew') }],
    }, {
      label: t(placeholder),
      options
    }]
  }

  const formIsOpen = () => props.value && props.value.formIsOpen

  const renderForm = () => {
    if (!formIsOpen()) return null
    const { value, onBlur } = props
    const errors = value.errors || {}
    return (
      <AddOptionContainer>
        <Label htmlForm="name">
          <Translate content="qvain.organizationSelect.label.name" />
        </Label>
        <Translate
          component={Input}
          value={value ? value.name.und : ''}
          onChange={onFormChange}
          onBlur={onBlur}
          attributes={{ placeholder: 'qvain.organizationSelect.placeholder.name' }}
          name="name"
          id="name"
        />
        <ErrorMessage errors={errors.name || []} />
        <Label htmlForm="name">
          <Translate content="qvain.organizationSelect.label.email" />
        </Label>
        <Translate
          component={Input}
          value={value ? value.email : ''}
          onChange={onFormChange}
          onBlur={onBlur}
          attributes={{ placeholder: 'qvain.organizationSelect.placeholder.email' }}
          name="email"
        />
        <ErrorMessage errors={errors.email || []} />
        <Label htmlForm="name">
          <Translate content="qvain.organizationSelect.label.identifier" />
        </Label>
        <Translate
          component={Input}
          value={value ? value.value : ''}
          onChange={onFormChange}
          onBlur={onBlur}
          attributes={{ placeholder: 'qvain.organizationSelect.placeholder.identifier' }}
          name="identifier"
        />
        <ErrorMessage errors={errors.identifier || []} />
      </AddOptionContainer>
    )
  }

  const { name, inputId, value, placeholder } = props
  const { readonly } = props.Stores.Qvain
  return (
    <>
      <Translate
        component={ReactSelect}
        name={name}
        inputId={inputId}
        isDisabled={readonly}
        onChange={onChange}
        value={value}
        className="basic-single"
        classNamePrefix="select"
        options={getOptions()}
        attributes={{ placeholder }}
      />
      { renderForm() }
    </>
  )
}

CreatableSelectComponent.propTypes = {
  Stores: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.object,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  creatable: PropTypes.bool,
}

CreatableSelectComponent.defaultProps = {
  options: [],
  placeholder: null,
  creatable: true,
  value: undefined,
}

const Select = inject('Stores')(observer(CreatableSelectComponent))

const ErrorMessage = ({ errors }) => {
  if (!errors || !errors.length) return null
  return (
    <ValidationError>
      { errors.map(error => error) }
    </ValidationError>
  )
}

ErrorMessage.propTypes = {
  errors: PropTypes.array.isRequired,
}


async function resolveOptions(parentId) {
  const url = getOrganizationSearchUrl(parentId)
  const response = await axios.get(url)
  if (response.status !== 200) return null
  const { hits } = response.data.hits
  return parseOptions(hits)
}

function parseOptions(hits) {
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

const AddOptionContainer = styled.div`
  margin-top: .5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: .5rem;

  input {
    margin: 0 0 .25rem 0;
  }

  p {
    margin-bottom: 0;
    margin-left: .4rem;
    font-size: .9rem;
  }

  label {
    margin-top: .15rem;
    padding: 0;
  }
`

export default inject('Stores')(observer(OrganizationSelect))
