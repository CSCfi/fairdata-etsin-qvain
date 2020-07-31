import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import uuid from 'uuid/v4'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Card from '../general/card'
import OrganizationSelect from '../general/organizationSelect'
import { ErrorMessages } from './utils'
import Button from '../../general/button'
import Label from '../general/label'

import { Organization } from '../../../stores/view/qvain'


const INITIAL_STATE = {
  formData: {
    organization: undefined,
    department: undefined,
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

  onEdit = id => {
    const organizationToEdit = this.props.organizations.projectOrganizations
      .find(org => org.id === id)
    if (!organizationToEdit) return
    const { organization, department } = organizationToEdit
    this.setState({
      formData: {
        organization: { ...this.organizationToSelectValue(organization) },
        department: { ...this.organizationToSelectValue(department) }
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

  organizationToSelectValue = organization => {
    if (!organization) return null
    const { lang } = this.props.Stores.Locale
    return {
      value: organization.identifier || null,
      label: organization.name[lang] || organization.name.und,
      name: { ...organization.name }
    }
  }

  addOrganization = () => {
    const { organization, department } = this.state.formData
    // TODO: Validate
    const params = [uuid(), { identifier: organization.value, name: organization.name }]
    if (department) params.push({ identifier: department.value, name: department.name })
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
          value={formData}
          name="organization"
          inputId="organization"
        />
        <ErrorMessages errors={errors} />
        <AddOrganizationContainer>
          <Button onClick={this.addOrganization}>
            <Translate content="qvain.project.inputs.organization.addButton" />
          </Button>
        </AddOrganizationContainer>
      </Card>
    )
  }
}


const AddedOrganizations = ({ organizations = [], onRemove, onEdit, lang }) => (
  organizations.map(organization => (
    <OrganizationLabel color="#007fad" margin="0 0.5em 0.5em 0" key={organization.id}>
      <PaddedWord onClick={() => onEdit(organization.id)}>{organization.organization.name[lang] || organization.name.und }</PaddedWord>
      <FontAwesomeIcon
        onClick={() => onRemove(organization.id)}
        icon={faTimes}
        size="xs"
      />
    </OrganizationLabel>
  ))
)

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
