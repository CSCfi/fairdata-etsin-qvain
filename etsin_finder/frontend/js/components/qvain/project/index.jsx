import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx';
import styled from 'styled-components'

import { Project as ProjectObject } from '../../../stores/view/qvain'
import { projectSchema } from '../utils/formValidation'

import Field from '../general/field'
import Card from '../general/card'
import { ButtonGroup, ButtonLabel, EditButton, ButtonContainer, CancelButton, DeleteButton, SaveButton } from '../general/buttons'

import TooltipContent from './TooltipContent'
import ProjectForm from './ProjectForm'
import FundingOrganization from './FundingOrganization'

const FIELD_PROPS = {
  translations: {
    title: 'qvain.project.title',
    tooltip: 'qvain.project.description',
  },
  components: {
    tooltipContent: TooltipContent,
  }
}

const INITIAL_STATE = {
  projectInEdit: false,
  id: null,
  details: {
    titleEn: '',
    titleFi: '',
    identifier: '',
    fundingIdentifier: '',
    funderType: undefined,
    errors: {},
  },
  organizations: {
    addedOrganizations: [],
    formData: {}, // {organization: {value, name, ...}, department, subDepartment}
    errors: [],
  },
}

class Project extends Component {
  state = {
    id: null,
    projectInEdit: false,
    details: { ...INITIAL_STATE.details },
    organizations: { ...INITIAL_STATE.organizations },
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
    const oldProjectOrganizations = organizations.addedOrganizations.filter(org => org.id !== organization.id)
    const newProjectOrganizations = oldProjectOrganizations.concat([organization])
    this.setState({
      organizations: { ...organizations, addedOrganizations: newProjectOrganizations, formData: {} }
    })
  }

  onRemoveOrganization = id => {
    const { organizations } = this.state
    const updatedProjectOrganizations = organizations.addedOrganizations
      .filter(organization => organization.id !== id)
    this.setState({
      organizations: { ...organizations, addedOrganizations: updatedProjectOrganizations, formData: {} }
    })
  }

  handleAddProject = event => {
    event.preventDefault()
    const { id, details, organizations } = this.state

    projectSchema.validate({ details, organizations: organizations.addedOrganizations }, { abortEarly: false })
      .then(() => {
        const { titleEn, titleFi, identifier, fundingIdentifier, funderType } = details
        const { addedOrganizations } = organizations
        const title = { en: titleEn, fi: titleFi }
        const project = ProjectObject(id, title, identifier, fundingIdentifier, funderType, addedOrganizations)
        this.props.Stores.Qvain.setProject(project)
        this.resetForm()
      })
      .catch(validationErrors => {
        const parsedErrors = { details: {}, organizations: {} }
        validationErrors.inner.forEach(error => {
          const { errors, path } = error
          const paths = path.split('.')
          if (paths.length === 1) parsedErrors[paths[0]] = errors
          else parsedErrors[paths[0]][paths[1]] = errors
        })
        this.setState({
          details: { ...details, errors: parsedErrors.details },
          organizations: { ...organizations, errors: parsedErrors.organizations },
        })
      })
  }

  editProject = (id, event) => {
    if (this.props.Stores.Qvain.readonly) return
    if (event) event.preventDefault()
    const project = toJS(this.props.Stores.Qvain.projects.find(proj => proj.id === id))
    if (!project) return

    const { details, organizations } = project

    details.titleEn = details.title.en
    details.titleFi = details.title.fi
    delete details.title

    this.setState({
      id,
      details: { ...INITIAL_STATE.details, ...details },
      organizations: { ...INITIAL_STATE.organizations, addedOrganizations: [...organizations] },
      projectInEdit: true,
    })
  }

  removeProject = (id, event) => {
    if (this.props.Stores.Qvain.readonly) return
    if (event) event.preventDefault()
    this.resetForm()
    this.props.Stores.Qvain.removeProject(id)
  }

  resetForm = event => {
    if (event) event.preventDefault()
    this.setState({
      details: { ...INITIAL_STATE.details },
      organizations: { ...INITIAL_STATE.organizations },
      projectInEdit: false,
    })
  }

  render() {
    const { details, organizations, projectInEdit } = this.state
    const { readonly } = this.props.Stores.Qvain
    return (
      <Field {...FIELD_PROPS}>
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
      </Field>
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
            <EditButton aria-label="Edit" onClick={(event) => editProject(project.id, event)} />
            <DeleteButton aria-label="Remove" onClick={(event) => removeProject(project.id, event)} />
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
    margin-right: .5rem;
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
  }
}`

export default inject('Stores')(observer(Project))
