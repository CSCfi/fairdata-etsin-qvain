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


const INITIAL_STATE = {
  formData: {
    organization: undefined,
    department: undefined,
    subDepartment: undefined,
    errors: {},
  },
}

class FundingOrganization extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    onAddOrganization: PropTypes.func.isRequired,
    onRemoveOrganization: PropTypes.func.isRequired,
    organizations: PropTypes.object.isRequired,
  }

  state = {
    formData: { ...INITIAL_STATE.formData }
  }

  onChange = value => {
    const { formData } = this.state
    this.setState({ formData: { ...formData, ...value } })
  }

  onBlur = field => {
    const { formData } = this.state
    const { name, value, email } = formData[field]
    organizationSelectSchema.validate({ name, identifier: value, email }, { abortEarly: false })
      .then(() => {
        const updatedFormData = { ...formData[field], errors: [] }
        this.setState({ formData: { ...formData, [field]: updatedFormData } })
      })
      .catch(validationErrors => {
        const errors = {}
        validationErrors.inner.forEach(error => {
          const path = error.path.split('.')
          errors[path[0]] = error.errors
        })
        const updatedFormData = { ...formData[field], errors }
        this.setState({ formData: { ...formData, [field]: updatedFormData } })
      })
  }

  onEdit = async id => {
    const organizationToEdit = this.props.organizations.projectOrganizations
      .find(org => org.id === id)
    if (!organizationToEdit) return
    const { organization, department, subDepartment } = organizationToEdit
    const departmentValue = await this.organizationToSelectValue(department, organization ? organization.identifier : null)
    const subDepartmentValue = await this.organizationToSelectValue(subDepartment, department ? department.identifier : null)
    this.setState({
      formData: {
        organization: { ...await this.organizationToSelectValue(organization) },
        department: departmentValue ? { ...departmentValue } : undefined,
        subDepartment: subDepartmentValue ? { ...subDepartmentValue } : undefined,
        id,
      }
    })
  }

  onRemove = id => {
    this.resetForm()
    this.props.onRemoveOrganization(id)
  }

  resetForm = () => {
    this.setState({ formData: { ...INITIAL_STATE.formData } })
  }

  organizationToSelectValue = async (organization, parentId) => {
    if (!organization) return undefined
    const { lang } = this.props.Stores.Locale
    const { identifier, name, email } = organization
    const isCustomOrg = await isCustomOrganization(identifier, parentId)
    return {
      value: identifier || '',
      label: name[lang] || name.und,
      name: { ...name },
      email: email || '',
      formIsOpen: isCustomOrg,
    }
  }

  addOrganization = () => {
    const { organization, department, subDepartment, id } = this.state.formData
    const params = [id, { identifier: organization.value, name: organization.name }]
    if (department) params.push({ identifier: department.value, name: department.name })
    if (subDepartment) params.push({ identifier: subDepartment.value, name: subDepartment.name })
    if (!allOrganizationsAreValid(params)) return
    const organizationToAdd = Organization(...params)
    this.props.onAddOrganization(organizationToAdd)
    this.resetForm()
  }

  render() {
    const { formData } = this.state
    const { errors, projectOrganizations } = this.props.organizations
    const { lang } = this.props.Stores.Locale
    return (
      <Card>
        <Translate component="h3" content="qvain.project.organization.title" />
        <Translate component="p" content="qvain.project.organization.description" />
        <AddedOrganizations
          organizations={projectOrganizations}
          onRemove={this.onRemove}
          onEdit={this.onEdit}
          lang={lang}
        />
        <OrganizationSelect
          onChange={this.onChange}
          onBlur={this.onBlur}
          value={formData}
          name="organization"
          inputId="organization"
        />
        <ErrorMessages errors={errors} />
        <AddOrganizationContainer>
          <Button onClick={this.addOrganization}>
            <Translate content={formData.id
              ? 'qvain.project.inputs.organization.editButton'
              : 'qvain.project.inputs.organization.addButton'}
            />
          </Button>
        </AddOrganizationContainer>
      </Card>
    )
  }
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
