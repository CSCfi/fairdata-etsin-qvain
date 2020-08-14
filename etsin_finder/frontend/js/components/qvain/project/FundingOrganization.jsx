import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

import Card from '../general/card'
import OrganizationSelect from '../general/organizationSelect'
import { ErrorMessages } from './utils'
import Button from '../../general/button'
import Label from '../general/label'

import { Organization } from '../../../stores/view/qvain'
import { organizationSelectSchema } from '../utils/formValidation'
import { getOrganizationSearchUrl } from '../../../stores/view/qvain.actors'


const FundingOrganization = props => {
  /**
   * Validate one field of organization select form, when adding
   * an organization manually.
   * TODO: Consider refactoring this to organization select component?
   *
   * @param {Object} field
   */
  const onBlur = async field => {
    const { formData } = props.organizations
    const { name, value, email } = formData[field]
    const errors = await validate({ name, identifier: value, email })
    props.onChange({ ...formData, [field]: { ...formData[field], errors } })
  }

  /**
   * Put already added organization to form data for organization select.
   */
  const onEdit = async id => {
    const organizationToEdit = props.organizations.addedOrganizations
      .find(org => org.id === id)
    if (!organizationToEdit) return
    const { organization, department, subDepartment } = organizationToEdit
    const departmentValue = await organizationToSelectValue(department, organization ? organization.identifier : null)
    const subDepartmentValue = await organizationToSelectValue(subDepartment, department ? department.identifier : null)
    props.onChange({
      organization: { ...await organizationToSelectValue(organization) },
      department: departmentValue ? { ...departmentValue } : undefined,
      subDepartment: subDepartmentValue ? { ...subDepartmentValue } : undefined,
      id,
    })
  }

  const onRemove = id => props.onRemoveOrganization(id)

  /**
   * Convert already added and valid organization to value for select.
   * Note: We need to check if value is manually added or selected from
   * reference data. If manually added, we need to display the form.
   *
   * @param {Object} organization Organization to convert
   * @param {String || null} parentId Parent id for organization,
   * used to check if organization is manually added
   */
  const organizationToSelectValue = async (organization, parentId) => {
    if (!organization) return undefined
    const { lang } = props.Stores.Locale
    const { identifier, name, email } = organization
    const isCustomOrg = await isCustomOrganization(identifier, parentId)
    return {
      value: identifier || '',
      label: name[lang] || name.und,
      name: { ...name },
      email,
      formIsOpen: isCustomOrg,
    }
  }

  /**
   * Validate all organization levels and set errors.
   * @param {Object} organizations Value from organization select
   */
  const validateAll = organizations => {
    let valid = true
    const { formData } = props.organizations
    for (const [key, value] of Object.entries(organizations)) {
      if (value) {
        const errors = validateSync(value)
        formData[key].errors = errors
        if (!isEmptyObject(errors)) valid = false
      }
    }
    props.onChange(formData)
    return valid
  }

  /**
   * Validate organization select values (organization, department, ...). If all are valid
   * create an organization object and call parent on add organization.
   */
  const addOrganization = () => {
    const { organization, department, subDepartment, id } = props.organizations.formData
    if (!validateAll({ organization, department, subDepartment })) return
    const params = [id, { identifier: organization.value, name: organization.name, email: organization.email }]
    if (department) params.push({ identifier: department.value, name: department.name, email: department.email })
    if (subDepartment) params.push({ identifier: subDepartment.value, name: subDepartment.name, email: subDepartment.email })
    const organizationToAdd = Organization(...params)
    props.onAddOrganization(organizationToAdd)
  }

  const { errors, addedOrganizations, formData } = props.organizations
  const { lang } = props.Stores.Locale
  return (
    <Card>
      <Translate component="h3" content="qvain.project.organization.title" />
      <Translate component="p" content="qvain.project.organization.description" />
      <AddedOrganizations
        organizations={addedOrganizations}
        onRemove={onRemove}
        onEdit={onEdit}
        lang={lang}
      />
      <OrganizationSelect
        onChange={props.onChange}
        onBlur={onBlur}
        value={formData}
        name="organization"
        inputId="organization"
      />
      <ErrorMessages errors={errors} />
      <AddOrganizationContainer>
        <Button onClick={addOrganization}>
          <Translate content={formData.id
            ? 'qvain.project.inputs.organization.editButton'
            : 'qvain.project.inputs.organization.addButton'}
          />
        </Button>
      </AddOrganizationContainer>
    </Card>
  )
}

FundingOrganization.propTypes = {
  Stores: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddOrganization: PropTypes.func.isRequired,
  onRemoveOrganization: PropTypes.func.isRequired,
  organizations: PropTypes.object.isRequired, // {addedOrganizations, formData}
}


const AddedOrganizations = ({ organizations = [], onRemove, onEdit, lang }) => (
  organizations.map(organization => (
    <OrganizationLabel color="#007fad" margin="0 0.5em 0.5em 0" key={organization.id}>
      <PaddedWord onClick={() => onEdit(organization.id)}>{organization.organization.name[lang] || organization.organization.name.und }</PaddedWord>
      <FontAwesomeIcon
        onClick={() => onRemove(organization.id)}
        icon={faTimes}
        size="xs"
      />
    </OrganizationLabel>
  ))
)

/**
 * Check if given identifier can be found from reference data.
 * If not, the organization is likely manually entered.
 *
 * @param {String} identifier
 * @param {String} parentId parent organization identifier
 */
async function isCustomOrganization(identifier, parentId) {
  if (!identifier) return false
  const url = getOrganizationSearchUrl(parentId)
  const response = await axios.get(url)
  if (response.status !== 200) return null
  const { hits } = response.data.hits
  return hits.every(hit => hit._source.uri !== identifier)
}

/**
 * Validate an organization async. Returns validation errors,
 * if valid an empty array will be returned.
 */
async function validate(organization) {
  try {
    await organizationSelectSchema.validate(organization, { abortEarly: false })
    return []
  } catch (validationErrors) {
    return parseValidationErrors(validationErrors)
  }
}

/**
 * Validate an organization in sync. Returns validation errors,
 * if valid an empty array will be returned.
 */
function validateSync(organization) {
  try {
    organizationSelectSchema.validateSync(organization, { abortEarly: false })
    return []
  } catch (validationErrors) {
    return parseValidationErrors(validationErrors)
  }
}

/**
 * Parse yup validation errors to object like {field: [errors]}
 */
function parseValidationErrors(validationErrors) {
  const errors = {}
  validationErrors.inner.forEach(error => {
    const path = error.path.split('.')
    errors[path[0]] = error.errors
  })
  return errors
}

function isEmptyObject(obj = {}) {
  return Object.getOwnPropertyNames(obj).length === 0
}

const AddOrganizationContainer = styled.div`
  text-align: right;
  padding-top: 1rem;
`

const PaddedWord = styled.span`
  padding-right: 10px;
`

const OrganizationLabel = styled(Label)`
  cursor: pointer;
`

export default inject('Stores')(observer(FundingOrganization))
