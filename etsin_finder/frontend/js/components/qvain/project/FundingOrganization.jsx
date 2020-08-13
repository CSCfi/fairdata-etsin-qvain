import React, { Component } from 'react'
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
  const onBlur = field => {
    const { formData } = props.organizations
    const { name, value, email } = formData[field]
    organizationSelectSchema.validate({ name, identifier: value, email }, { abortEarly: false })
      .then(() => {
        const updatedFormData = { ...formData[field], errors: [] }
        props.onChange({ ...formData, [field]: updatedFormData })
      })
      .catch(validationErrors => {
        const errors = {}
        validationErrors.inner.forEach(error => {
          const path = error.path.split('.')
          errors[path[0]] = error.errors
        })
        const updatedFormData = { ...formData[field], errors }
        props.onChange({ ...formData, [field]: updatedFormData })
      })
  }

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

  const addOrganization = () => {
    const { organization, department, subDepartment, id } = props.organizations.formData
    const params = [id, { identifier: organization.value, name: organization.name, email: organization.email }]
    if (department) params.push({ identifier: department.value, name: department.name, email: department.email })
    if (subDepartment) params.push({ identifier: subDepartment.value, name: subDepartment.name, email: subDepartment.email })
    if (!allOrganizationsAreValid(params)) return
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

function allOrganizationsAreValid(organizations) {
  return (
    organizations
      .filter(organization => typeof organization === 'object')
      .every(organization => organizationSelectSchema.isValidSync({ ...organization }))
  )
}

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
