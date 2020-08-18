import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Card from '../general/card'
import OrganizationSelect from '../general/organizationSelect'
import { ErrorMessages, validate, validateSync, isEmptyObject, organizationToSelectValue } from './utils'
import Button from '../../general/button'
import Label from '../general/label'

import { Organization } from '../../../stores/view/qvain'
import { organizationSelectSchema } from '../utils/formValidation'


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
    const errors = await validate(organizationSelectSchema, { name, identifier: value, email })
    props.onChange({ ...formData, [field]: { ...formData[field], errors } })
  }

  /**
   * Put already added organization to form data for organization select.
   */
  const onEdit = async id => {
    const organizationToEdit = props.organizations.addedOrganizations
      .find(org => org.id === id)
    if (!organizationToEdit) return
    const { lang } = props.Stores.Locale
    const { organization, department, subDepartment } = organizationToEdit
    const departmentValue = await organizationToSelectValue(department, lang, organization ? organization.identifier : null)
    const subDepartmentValue = await organizationToSelectValue(subDepartment, lang, department ? department.identifier : null)
    props.onChange({
      organization: { ...await organizationToSelectValue(organization, lang) },
      department: departmentValue ? { ...departmentValue } : undefined,
      subDepartment: subDepartmentValue ? { ...subDepartmentValue } : undefined,
      id,
    })
  }

  const onRemove = id => props.onRemoveOrganization(id)


  /**
   * Validate all organization levels and set errors.
   * @param {Object} organizations Value from organization select
   */
  const validateAll = organizations => {
    let valid = true
    const { formData } = props.organizations
    for (const [key, value] of Object.entries(organizations)) {
      if (value) {
        const errors = validateSync(organizationSelectSchema, value)
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
    const { formData } = props.organizations
    const organization = selectValueToSchema(formData.organization)
    const department = selectValueToSchema(formData.department)
    const subDepartment = selectValueToSchema(formData.subDepartment)
    if (!validateAll({ organization, department, subDepartment })) return
    const { id } = props.organizations.formData
    const params = [id, organization]
    if (department) params.push(department)
    if (subDepartment) params.push(subDepartment)
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

function selectValueToSchema(organization) {
  if (!organization) return null
  const { name, email, value } = organization
  return { name: { ...name }, email, identifier: value }
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
