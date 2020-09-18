import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import styled from 'styled-components'

import { Project as ProjectObject } from '../../../stores/view/qvain'
import { projectSchema } from '../utils/formValidation'

import { Section } from '../general/section'
import Card from '../general/card'
import {
  ButtonGroup,
  ButtonLabel,
  EditButton,
  ButtonContainer,
  CancelButton,
  DeleteButton,
  SaveButton,
} from '../general/buttons'

import TooltipContent from './TooltipContent'
import ProjectForm from './ProjectForm'
import FundingOrganization from './FundingOrganization'
import FundingAgency from './FundingAgency'
import { Expand } from './utils'

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
      errors: {},
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
        this.props.Stores.Qvain.setProject(project)
        this.resetForm()
      })
      .catch(validationErrors => {
        const parsedErrors = { details: {}, organizations: {}, fundingAgencies: {} }
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
    if (this.props.Stores.Qvain.readonly) return
    if (event) event.preventDefault()
    const project = toJS(this.props.Stores.Qvain.projects.find(proj => proj.id === id))
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
    if (this.props.Stores.Qvain.readonly) return
    if (event) event.preventDefault()
    if (id === this.state.id) this.resetForm()
    this.props.Stores.Qvain.removeProject(id)
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
    const { readonly } = this.props.Stores.Qvain
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
            />
          </Actions>
        </Card>
      </Section>
    )
  }
}

const AddedProjectsComponent = ({ Stores, editProject, removeProject }) => {
  const { lang } = Stores.Locale
  const { projects, readonly } = Stores.Qvain

  const renderProjectTitle = details => {
    const { fi, en } = details.title
    if (lang === 'fi' && fi) return [fi, en].filter(title => title).join(', ')
    return [en, fi].filter(title => title).join(', ')
  }

  return (
    <>
      {projects.map(project => (
        <ButtonGroup tabIndex="0" key={project.id}>
          <ButtonLabel>{renderProjectTitle(project.details)}</ButtonLabel>
          <ProjectActions disabled={readonly}>
            <EditButton aria-label="Edit" onClick={event => editProject(project.id, event)} />
            <DeleteButton aria-label="Remove" onClick={event => removeProject(project.id, event)} />
          </ProjectActions>
        </ButtonGroup>
      ))}
    </>
  )
}

AddedProjectsComponent.propTypes = {
  Stores: PropTypes.object.isRequired,
  editProject: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
}

const AddedProjects = inject('Stores')(observer(AddedProjectsComponent))

const Actions = styled.div`
  margin-top: 1.5rem;
  button {
    margin-right: 0.5rem;
  }
`

const ProjectActions = styled(ButtonContainer)`
  ${({ disabled }) => {
    if (disabled) {
      return `
        button {
          opacity: .7;
          cursor: not-allowed;
        }
      `
    }
    return null
  }}
`

export default inject('Stores')(observer(Project))
