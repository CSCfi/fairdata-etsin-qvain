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

  resetForm = () => {
    this.setState({ formData: { ...INITIAL_STATE.formData } })
  }

  addOrganization = () => {
    const { organization, department } = this.state.formData
    // TODO: Validate
    const params = [uuid(), { uri: organization.uri, name: organization.name }]
    if (department) params.push({ uri: department.uri, name: department.name })
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
          onRemove={this.props.onRemoveOrganization}
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


const AddedOrganizations = ({ organizations, onRemove, lang }) => (
  organizations.map(organization => (
    <Label color="#007fad" margin="0 0.5em 0.5em 0" key={organization.id}>
      <PaddedWord>{organization.organization.name[lang] || organization.name.und }</PaddedWord>
      <FontAwesomeIcon
        onClick={() => onRemove(organization.id)}
        icon={faTimes}
        size="xs"
      />
    </Label>
  ))
)

const AddOrganizationContainer = styled.div`
  text-align: right;
  padding-top: 1rem;
`
const PaddedWord = styled.span`
  padding-right: 10px;
`

export default inject('Stores')(observer(FundingOrganization))
