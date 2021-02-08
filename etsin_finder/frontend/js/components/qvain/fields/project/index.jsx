import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'

import { Project as ProjectObject } from '../../../../stores/view/qvain/qvain.project'
import { projectSchema } from '../../utils/formValidation'

import { withFieldErrorBoundary } from '../../general/errors/fieldErrorBoundary'
import { Section } from '../../general/section'
import Card from '../../general/card'
import {
  ButtonGroup,
  ButtonLabel,
  EditButton,
  ButtonContainer,
  CancelButton,
  DeleteButton,
  SaveButton,
} from '../../general/buttons'

import TooltipContent from './TooltipContent'
import ProjectForm from './ProjectForm'
import FundingOrganization from './FundingOrganization'
import FundingAgency from './FundingAgency'
import { Expand } from './utils'
import { withStores } from '../../utils/stores'

const FIELD_PROPS = {
  translations: {
    title: 'qvain.project.title',
    tooltip: 'qvain.project.description',
  },
  components: {
    tooltipContent: TooltipContent,
  },
}

const INITIAL_STATE = {
  projectInEdit: false,
  id: null,
  details: {
    titleEn: '',
    titleFi: '',
    identifier: '',
    fundingIdentifier: '',
    funderType: null,
    errors: {},
  },
  organizations: { addedOrganizations: [], formData: {}, errors: [] },
  fundingAgencies: {
    formData: {
      id: null,
      organization: {},
      contributorTypeForm: { errors: {} },
      errors: [],
      contributorTypes: [],
    },
    addedFundingAgencies: [],
  },
}

class Project extends Component {
  state = {
    id: null,
    projectInEdit: false,
    details: { ...INITIAL_STATE.details },
    organizations: { ...INITIAL_STATE.organizations },
    fundingAgencies: { ...INITIAL_STATE.fundingAgencies },
  }

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  onProjectFormChange = (field, value) => {
    const { details } = this.state
    details[field] = value
    this.setState({ details })
  }

  onOrganizationFormChange = value => {
    const { organizations } = this.state
    this.setState({ organizations: { ...organizations, formData: value } })
  }

  onAddOrganization = organization => {
    const { organizations } = this.state
    const oldProjectOrganizations = organizations.addedOrganizations.filter(
      org => org.id !== organization.id
    )
    const newProjectOrganizations = oldProjectOrganizations.concat([organization])
    this.setState({
      organizations: {
        ...organizations,
        addedOrganizations: newProjectOrganizations,
        formData: {},
      },
    })
  }

  onRemoveOrganization = id => {
    const { organizations } = this.state
    const updatedProjectOrganizations = organizations.addedOrganizations.filter(
      organization => organization.id !== id
    )
    this.setState({
      organizations: {
        ...organizations,
        addedOrganizations: updatedProjectOrganizations,
        formData: {},
      },
    })
  }

  onFundingAgencyChange = value => {
    const { fundingAgencies } = this.state
    this.setState({ fundingAgencies: { ...fundingAgencies, formData: value } })
  }

  onAddFundingAgency = newFundingAgency => {
    const { fundingAgencies } = this.state
    const oldFundingAgencies = fundingAgencies.addedFundingAgencies.filter(
      agency => agency.id !== newFundingAgency.id
    )
    const addedFundingAgencies = oldFundingAgencies.concat([newFundingAgency])
    this.setState({
      fundingAgencies: {
        addedFundingAgencies,
        formData: { ...INITIAL_STATE.fundingAgencies.formData },
      },
    })
  }

  onRemoveFundingAgency = id => {
    const { fundingAgencies } = this.state
    const addedFundingAgencies = fundingAgencies.addedFundingAgencies.filter(
      agency => agency.id !== id
    )
    this.setState({
      fundingAgencies: {
        ...fundingAgencies,
        addedFundingAgencies,
      },
    })
  }

  handleAddProject = event => {
    event.preventDefault()
    const { id, details, organizations, fundingAgencies } = this.state

    // If organizations or funding agencies are present in the state,
    // we assume that those are validated already. We validate only the amount of added objects.
    projectSchema
      .validate(
        {
          details,
          organizations: organizations.addedOrganizations,
          fundingAgencies: fundingAgencies.addedFundingAgencies,
        },
        { abortEarly: false }
      )
      .then(() => {
        const { titleEn, titleFi, identifier, fundingIdentifier, funderType } = details
        const title = { en: titleEn, fi: titleFi }
        const project = ProjectObject(
          id,
          title,
          identifier,
          fundingIdentifier,
          funderType,
          organizations.addedOrganizations,
          fundingAgencies.addedFundingAgencies
        )
        this.props.Stores.Qvain.Projects.setProject(project)
        this.resetForm()
      })
      .catch(validationErrors => {
        const parsedErrors = { details: {}, organizations: {}, fundingAgencies: {} }
        console.error(validationErrors)
        validationErrors.inner.forEach(error => {
          const { errors, path } = error
          const paths = path.split('.')
          if (paths.length === 1) parsedErrors[paths[0]] = errors
          else parsedErrors[paths[0]][paths[1]] = errors
        })
        this.setState({
          details: { ...details, errors: parsedErrors.details },
          organizations: {
            ...organizations,
            formData: { ...organizations.formData, errors: parsedErrors.organizations },
          },
          fundingAgencies: { ...fundingAgencies, errors: parsedErrors.fundingAgencies },
        })
      })
  }

  editProject = (id, event) => {
    if (event) event.preventDefault()
    const project = toJS(this.props.Stores.Qvain.Projects.projects.find(proj => proj.id === id))
    if (!project) return

    const { details, organizations, fundingAgencies } = project

    details.titleEn = details.title.en
    details.titleFi = details.title.fi
    delete details.title

    this.setState({
      id,
      details: { ...INITIAL_STATE.details, ...details },
      organizations: { ...INITIAL_STATE.organizations, addedOrganizations: [...organizations] },
      fundingAgencies: {
        ...INITIAL_STATE.fundingAgencies,
        addedFundingAgencies: [...fundingAgencies],
      },
      projectInEdit: true,
    })
  }

  removeProject = (id, event) => {
    if (event) event.preventDefault()
    if (this.props.Stores.Qvain.Projects.readonly) return
    if (id === this.state.id) this.resetForm()
    this.props.Stores.Qvain.Projects.removeProject(id)
  }

  resetForm = event => {
    if (event) event.preventDefault()
    this.setState({
      id: INITIAL_STATE.id,
      details: { ...INITIAL_STATE.details },
      organizations: { ...INITIAL_STATE.organizations },
      projectInEdit: false,
      fundingAgencies: { ...INITIAL_STATE.fundingAgencies },
    })
  }

  render() {
    const { details, organizations, projectInEdit, fundingAgencies } = this.state
    const { readonly } = this.props.Stores.Qvain.Projects
    return (
      <Section {...FIELD_PROPS}>
        <Card>
          <Translate component="h3" content="qvain.project.title" />
          <Translate component="p" content="qvain.project.description" />
          <AddedProjects editProject={this.editProject} removeProject={this.removeProject} />
          <ProjectForm onChange={this.onProjectFormChange} formData={details} readonly={readonly} />
          <FundingOrganization
            onChange={this.onOrganizationFormChange}
            onAddOrganization={this.onAddOrganization}
            onRemoveOrganization={this.onRemoveOrganization}
            organizations={organizations}
          />
          <Expand title={<Translate component="h3" content="qvain.project.fundingAgency.title" />}>
            <FundingAgency
              onChange={this.onFundingAgencyChange}
              onAdd={this.onAddFundingAgency}
              onRemove={this.onRemoveFundingAgency}
              value={fundingAgencies}
            />
          </Expand>
          <Actions>
            <Translate
              component={CancelButton}
              onClick={this.resetForm}
              content="qvain.files.external.form.cancel.label"
            />
            <Translate
              component={SaveButton}
              onClick={this.handleAddProject}
              content={projectInEdit ? 'qvain.project.editButton' : 'qvain.project.addButton'}
              disabled={readonly}
            />
          </Actions>
        </Card>
      </Section>
    )
  }
}

const AddedProjectsComponent = ({ Stores, editProject, removeProject }) => {
  const { lang } = Stores.Locale
  const { projects, readonly } = Stores.Qvain.Projects

  const renderProjectTitle = details => {
    const { fi, en } = details.title
    if (lang === 'fi' && fi) return [fi, en].filter(title => title).join(', ')
    return [en, fi].filter(title => title).join(', ')
  }

  return projects.map(project => (
    <ButtonGroup tabIndex="0" key={project.id}>
      <ButtonLabel>{renderProjectTitle(project.details)}</ButtonLabel>
      <ProjectActions>
        <EditButton onClick={event => editProject(project.id, event)} />
        {!readonly && <DeleteButton onClick={event => removeProject(project.id, event)} />}
      </ProjectActions>
    </ButtonGroup>
  ))
}

AddedProjectsComponent.propTypes = {
  Stores: PropTypes.object.isRequired,
  editProject: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
}

const AddedProjects = withStores(observer(AddedProjectsComponent))

const Actions = styled.div`
  margin-top: 1.5rem;
  button {
    margin-right: 0.5rem;
  }
`

const ProjectActions = styled(ButtonContainer)``

export default withFieldErrorBoundary(withStores(observer(Project)), 'qvain.project.title')
