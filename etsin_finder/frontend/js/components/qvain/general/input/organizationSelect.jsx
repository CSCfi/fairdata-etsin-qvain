import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'
import t from 'counterpart'
import Translate from 'react-translate-component'
import axios from 'axios'
import styled from 'styled-components'

import { inject, observer } from 'mobx-react'

import { getOrganizationSearchUrl } from '../../../../stores/view/qvain.actors'
import { organizationSelectSchema } from '../../utils/formValidation'
import { Input, Label } from '../modal/form'
import ValidationError from '../errors/validationError'
import { DeleteButton } from '../buttons'
import { validate } from '../../project/utils'

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
    creatable: PropTypes.bool,
  }

  static defaultProps = {
    placeholder: {
      organization: 'qvain.select.placeholder',
      department: 'qvain.select.placeholder',
    },
    creatable: true,
    value: undefined,
  }

  state = {
    options: {
      organization: {},
      department: {},
      subDepartment: {},
    },
  }

  /**
   * Fetch top level organization options when component is mounted.
   */
  async componentDidMount() {
    const { options } = this.state
    const organization = await resolveOptions()
    this.setState({ options: { ...options, organization } })
  }

  /**
   * Fetch new select values for different levels of organization select, if values
   * changed from previous props.
   *
   * @param {Object} prevProps Previous props
   */
  componentDidUpdate(prevProps) {
    const didOrganizationChnage = this.didValueChange('organization', prevProps)
    const didDepartmentChnage = this.didValueChange('department', prevProps)
    if (didOrganizationChnage || didDepartmentChnage) {
      const { organization, department } = this.props.value
      this.fetchOptions(
        didOrganizationChnage ? organization || {} : {},
        didDepartmentChnage ? department || {} : {}
      )
    }
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
   * Top level organization options are fetched only once, when component,
   * is mounted and should not be cleared.
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
      subDepartment: { ...oldOptions.subDepartment },
    }
    if (organization.value && !organization.formIsOpen) {
      options.department = await resolveOptions(organization.value)
    } else if (organization.formIsOpen) options.department = {}

    options.subDepartment =
      department.value && !department.formIsOpen ? await resolveOptions(department.value) : {}
    this.setState({ options })
  }

  /**
   * Update organization from top level organization select.
   * This method handles also updating the department and
   * subdepartment select values. If form is not open, clear
   * department and subdepartment values always when organization changes.
   */
  onOrganizationChange = selectedValue => {
    if (!selectedValue) {
      return this.props.onChange({ organization: null, department: null, subDepartment: null })
    }

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

  /**
   * Update department value. If form is is not open, clear the
   * subdepartment value.
   */
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

  /**
   * Return true if value of given key is changed from current props.
   * @param {String} key one of: ["organization", "department", "subdepartment"]
   * @param {Object} prevProps Previous props
   */
  didValueChange = (key, prevProps) => {
    const prev = prevProps.value && prevProps.value[key] ? prevProps.value[key].value : undefined
    const current =
      this.props.value && this.props.value[key] ? this.props.value[key].value : undefined
    return prev !== current
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
          value={value.organization === undefined ? null : value.organization}
          options={options.organization[lang] || []}
          placeholder={placeholder.organization}
          creatable={creatable}
          allowReset={value.organization && !value.department}
        />
        <Department>
          {value.organization && (
            <Select
              onChange={this.onDepartmentChange}
              onBlur={() => this.onBlur('department')}
              name={name}
              inputId={inputId}
              value={value.department === undefined ? null : value.department}
              options={options.department ? options.department[lang] : []}
              placeholder={placeholder.department}
              creatable={creatable}
              allowReset={value.department && !value.subDepartment}
            />
          )}
          <Department>
            {value.department && (
              <Select
                onChange={this.onSubdepartmentChange}
                onBlur={() => this.onBlur('subDepartment')}
                name={name}
                inputId={inputId}
                value={value.subDepartment === undefined ? null : value.subDepartment}
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
const CreatableSelectComponent = ({
  Stores,
  onChange,
  onBlur,
  value,
  options,
  placeholder,
  name,
  inputId,
  creatable,
  allowReset,
}) => {
  /**
   * Open form if add manually is selected.
   *
   * @param {Object} option Selected option
   */
  const onSelectChange = option => {
    if (option.value === 'create') {
      onChange({
        value: '',
        name: { und: '' },
        label: t('qvain.organizationSelect.label.addNew'),
        email: '',
        formIsOpen: true,
      })
    } else onChange({ ...option, formIsOpen: false })
  }

  const onReset = () => onChange(null)

  /**
   * Craft payload for onChange, based on organization form.
   */
  const onFormChange = event => {
    const newValue = event.target.value
    const newName = event.target.name
    const payload = { ...value } || { label: undefined, name: undefined, value: undefined }
    switch (newName) {
      case 'name': {
        payload.name = { und: newValue }
        payload.label = newValue
        break
      }
      case 'email': {
        payload.email = newValue
        break
      }
      case 'identifier': {
        payload.value = newValue
        break
      }
      default:
        break
    }
    onChange(payload)
  }

  /**
   * Add option for adding organization manually
   * if props has creatable set to true.
   */
  const getOptions = () => {
    if (!creatable) return options
    return [
      {
        label: t('qvain.organizationSelect.label.addNew'),
        options: [{ value: 'create', label: t('qvain.organizationSelect.label.addNew') }],
      },
      {
        label: t(placeholder),
        options,
      },
    ]
  }

  /**
   * Select option will have an additional form is open property
   * if organization for should be visible.
   */
  const formIsOpen = () => (value ? value.formIsOpen : false)

  const renderForm = () => {
    if (!formIsOpen()) return null
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

  const { readonly } = Stores.Qvain
  return (
    <div className="row no-gutters">
      <div className="col-11">
        <Translate
          component={StyledSelect}
          name={name}
          inputId={inputId}
          isDisabled={readonly}
          onChange={onSelectChange}
          value={value}
          className="basic-single"
          classNamePrefix="select"
          options={getOptions()}
          attributes={{ placeholder }}
        />
        {renderForm()}
      </div>
      <div className="col-1">
        {allowReset ? (
          <DeleteButton
            type="button"
            onClick={onReset}
            style={{ margin: '0 0 0 .5rem', width: 38, height: 38 }}
          />
        ) : null}
      </div>
    </div>
  )
}

const StyledSelect = styled(ReactSelect)`
  flex-grow: 1;
`

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
  return <ValidationError>{errors.map(error => error)}</ValidationError>
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
    },
  }
}

function isEmptyObject(obj = {}) {
  return Object.getOwnPropertyNames(obj).length === 0
}

const SelectContainer = styled.div`
  padding-left: 1.5rem;
`

const Department = styled.div`
  margin-left: 1rem;
  margin-top: 0.5rem;
`

const AddOptionContainer = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem;

  input {
    margin: 0 0 0.25rem 0;
  }

  p {
    margin-bottom: 0;
    margin-left: 0.4rem;
    font-size: 0.9rem;
  }

  label {
    margin-top: 0.15rem;
    padding: 0;
  }
`

export default inject('Stores')(observer(OrganizationSelect))
