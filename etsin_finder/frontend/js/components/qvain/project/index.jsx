import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx';
import styled from 'styled-components'

import { Project as ProjectObject } from '../../../stores/view/qvain'
import { projectDetailsSchema } from '../utils/formValidation'

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
  projectForm: {
    id: null,
    titleEn: '',
    titleFi: '',
    identifier: '',
    fundingIdentifier: '',
    funderType: undefined,
    errors: [],
  },
  organizationForm: {},
}

class Project extends Component {
  state = {
    projectForm: { ...INITIAL_STATE.projectForm },
    organizationForm: { ...INITIAL_STATE.organizationForm },
  }

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  onProjectFormChange = (field, value) => {
    const { projectForm } = this.state
    projectForm[field] = value
    this.setState({ projectForm })
  }

  onOrganizationChange = () => null

  handleAddProject = event => {
    event.preventDefault()
    const { id, titleEn, titleFi, identifier, fundingIdentifier, funderType } = this.state.projectForm
    projectDetailsSchema.validate({ titleEn, titleFi, identifier, fundingIdentifier, funderType }, { abortEarly: false })
      .then(() => {
        const title = { en: titleEn, fi: titleFi }
        const project = ProjectObject(id, title, identifier, fundingIdentifier, funderType, [])
        this.props.Stores.Qvain.setProject(project)
        this.resetForm()
      })
      .catch((validationErrors) => {
        const { projectForm } = this.state
        projectForm.errors = []
        validationErrors.inner.forEach(error => {
          const { errors, path } = error
          projectForm.errors[path] = errors
        })
        this.setState({ projectForm })
      })
  }

  editProject = (id, event) => {
    if (this.props.Stores.Qvain.readonly) return
    if (event) event.preventDefault()
    const project = toJS(this.props.Stores.Qvain.projects.find(proj => proj.id === id))
    if (!project) return

    const { projectForm } = this.state
    projectForm.titleEn = project.title.en || ''
    projectForm.titleFi = project.title.fi || ''
    delete project.title

    const updatedFormData = { ...projectForm, ...project, errors: [] }
    this.setState({ projectForm: updatedFormData, projectInEdit: true })
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
      projectForm: { ...INITIAL_STATE.projectForm },
      organizationForm: { ...INITIAL_STATE.organizationForm },
      projectInEdit: false,
    })
  }

  render() {
    const { projectForm, organizationForm, projectInEdit } = this.state
    const { readonly } = this.props.Stores.Qvain
    return (
      <Field {...FIELD_PROPS}>
        <Card>
          <Translate component="h3" content="qvain.project.title" />
          <Translate component="p" content="qvain.project.description" />
          <AddedProjects editProject={this.editProject} removeProject={this.removeProject} />
          <ProjectForm onChange={this.onProjectFormChange} formData={projectForm} readonly={readonly} />
          <FundingOrganization onChange={this.onOrganizationChange} formData={organizationForm} />
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

  const renderProjectTitle = project => {
    const { fi, en } = project.title
    if (lang === 'fi' && fi) return [fi, en].filter(title => title).join(', ')
    return [en, fi].filter(title => title).join(', ')
  }

  return (
    <>
      {projects.map(project => (
        <ButtonGroup tabIndex="0" key={project.id}>
          <ButtonLabel>{renderProjectTitle(project)}</ButtonLabel>
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
