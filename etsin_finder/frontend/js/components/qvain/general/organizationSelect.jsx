import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import t from 'counterpart'
import Translate from 'react-translate-component'
import axios from 'axios'
import styled from 'styled-components'

import { inject, observer } from 'mobx-react'

import { getOrganizationSearchUrl } from '../../../stores/view/qvain.actors'
import { organizationSelectSchema } from '../utils/formValidation'
import { Input, Label } from './form'
import ValidationError from './validationError'
import { DeleteButton } from './buttons'
import { validate } from '../project/utils'

/**
 * A reusable organization select component.
 * An organization can be nested up to three levels: organization,
 * department, sub department. On all levels user can add value also
 * manually by filling a form.
 *
 * The component does not store the value of selects, state contains only
 * values of select options.
 */
class OrganizationSelect extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
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

  /**
   * Fetch top level organization options when component is mounted.
   */
  async componentDidMount() {
    const { options } = this.state
    const organization = await resolveOptions()
    this.setState({ options: { ...options, organization } })
  }

  // TODO: Causes double fetch when value changed from select
  componentWillReceiveProps(nextProps) {
    const { organization, department } = nextProps.value
    this.fetchOptions(organization || {}, department || {})
  }

  /**
   * Clear department and sub department options.
   * Sub department options will be always cleared.
   *
   * @param {*} all If all is true, also department
   * options will be cleared.
   */
  clearOptions = all => {
    const { options } = this.state
    const updatedOptions = { ...options, subDepartment: {} }
    if (all) updatedOptions.department = {}
    this.setState({ options: updatedOptions })
  }

  /**
   * Used to fetch options for department and sub department selects.
   * Top level organization options are fetched only, when component is mounted,
   * and should not be cleared.
   *
   * @param {*} organization Current value of organization select
   * @param {*} department Current value of department select
   */
  fetchOptions = async (organization = {}, department = {}) => {
    if (isEmptyObject(organization) && isEmptyObject(department)) return
    const oldOptions = this.state.options
    const options = {
      organization: { ...oldOptions.organization },
      department: { ...oldOptions.department },
      subDepartment: { ...oldOptions.subDepartment }
    }
    options.department = organization.value && !organization.formIsOpen
      ? await resolveOptions(organization.value)
      : {}
    options.subDepartment = department.value && !department.formIsOpen
     ? await resolveOptions(department.value)
     : {}
    this.setState({ options })
  }

  onOrganizationChange = selectedValue => {
    if (!selectedValue) return this.props.onChange({ organization: null, department: null, subDepartment: null })

    const { formIsOpen } = selectedValue
    const { value } = this.props
    const formIsOpenFromProps = value.organization ? value.organization.formIsOpen : false
    const updatedFormData = { ...value, organization: selectedValue }

    if (formIsOpen) this.clearOptions(true)
    else {
      updatedFormData.department = null
      updatedFormData.subDepartment = null
    }

    // If user changes from add manually to
    // select from list --> dep and sub dep needs to be cleared.
    if (formIsOpen && !formIsOpenFromProps) {
      updatedFormData.department = null
      updatedFormData.subDepartment = null
    }
    return this.props.onChange(updatedFormData)
  }

  onDepartmentChange = selectedValue => {
    const { value } = this.props
    if (!selectedValue) {
      return this.props.onChange({ ...value, department: null, subDepartment: null })
    }
    const { formIsOpen } = selectedValue

    const updatedFormData = { ...value, department: selectedValue }
    if (formIsOpen) this.clearOptions(false)
    else updatedFormData.subDepartment = null

    return this.props.onChange(updatedFormData)
  }

  onSubdepartmentChange = subDepartment => {
    const { value } = this.props
    this.props.onChange({ ...value, subDepartment })
  }

  /**
   * Validate form when organization is added manually.
   */
  onBlur = async field => {
    const formData = this.props.value
    const { name, value, email } = formData[field]
    const errors = await validate(organizationSelectSchema, { name, identifier: value, email })
    this.props.onChange({ ...formData, [field]: { ...formData[field], errors } })
  }

  render() {
    const { lang } = this.props.Stores.Locale
    const { name, inputId, value, placeholder, creatable } = this.props
    const { options } = this.state

    return (
      <SelectContainer>
        <Select
          onChange={this.onOrganizationChange}
          onBlur={() => this.onBlur('organization')}
          name={name}
          inputId={inputId}
          value={value.organization}
          options={options.organization[lang] || []}
          placeholder={placeholder.organization}
          creatable={creatable}
          allowReset={value.organization && !value.department}
        />
        <Department>
          { value.organization && (
            <Select
              onChange={this.onDepartmentChange}
              onBlur={() => this.onBlur('department')}
              name={name}
              inputId={inputId}
              value={value.department}
              options={options.department ? options.department[lang] : []}
              placeholder={placeholder.department}
              creatable={creatable}
              allowReset={value.department && !value.subDepartment}
            />
          )}
          <Department>
            { value.department && (
              <Select
                onChange={this.onSubdepartmentChange}
                onBlur={() => this.onBlur('subDepartment')}
                name={name}
                inputId={inputId}
                value={value.subDepartment}
                options={options.subDepartment ? options.subDepartment[lang] : []}
                placeholder={placeholder.department}
                creatable={creatable}
                allowReset={Boolean(value.subDepartment)}
              />
            )}
          </Department>
        </Department>
      </SelectContainer>
    )
  }
}

/**
 * Internally used select component with form for adding organization manually.
 * This is a stateless component.
 */
const CreatableSelectComponent = props => {
  /**
   * Open form if add manually is selected.
   *
   * @param {Object} option Selected option
   */
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

  const onReset = () => props.onChange(null)

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

  /**
   * Add option for adding organization manually
   * if props has creatable set to true.
   */
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

  /**
   * Select option will have an additional form is open property
   * if organization for should be visible.
   */
  const formIsOpen = () => (
    props.value
      ? props.value.formIsOpen
      : false
    )

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

  const { name, inputId, value, placeholder, allowReset } = props
  const { readonly } = props.Stores.Qvain
  return (
    <div className="row no-gutters">
      <div className="col-11">
        <Translate
          component={StyledSelect}
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
      </div>
      <div className="col-1">
        { allowReset
          ? (
            <DeleteButton
              type="button"
              onClick={onReset}
              style={{ margin: '0 0 0 .5rem', width: 38, height: 38 }}
            />
          ) : null }
      </div>
    </div>
  )
}

const StyledSelect = styled(ReactSelect)`flex-grow: 1;`

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
  allowReset: PropTypes.bool,
}

CreatableSelectComponent.defaultProps = {
  options: [],
  placeholder: null,
  creatable: true,
  value: undefined,
  allowReset: false,
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

function isEmptyObject(obj = {}) {
  return Object.getOwnPropertyNames(obj).length === 0
}

const SelectContainer = styled.div`padding-left: 1.5rem;`

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
