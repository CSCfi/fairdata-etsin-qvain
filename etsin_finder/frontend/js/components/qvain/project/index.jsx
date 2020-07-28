import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import styled from 'styled-components'

import { Project as ProjectObject } from '../../../stores/view/qvain'

import Field from '../general/field'
import Card from '../general/card'
import Button from '../../general/button'
import { ButtonGroup, ButtonLabel, EditButton, ButtonContainer, DeleteButton } from '../general/buttons'
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
  projectForm: {
    titleEn: '',
    titleFi: '',
    identifier: '',
    fundingIdentifier: '',
    funderType: undefined,
  },
  organizationForm: {},
}

class Project extends Component {
  state = { ...INITIAL_STATE }

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  onChange = (field, value) => {
    const { projectForm } = this.state
    projectForm[field] = value
    this.setState({ projectForm })
  }

  handleAddProject = () => {
    const { titleEn, titleFi, identifier, fundingIdentifier, funderType } = this.state.projectForm
    const title = { en: titleEn, fi: titleFi }
    const project = ProjectObject(title, identifier, fundingIdentifier, funderType, [])
    this.props.Stores.Qvain.setProject(project)
    this.resetForm()
  }

  resetForm() {
    this.setState({ ...INITIAL_STATE })
  }


  render() {
    const { projectForm, organizationForm } = this.state
    return (
      <Field {...FIELD_PROPS}>
        <Card>
          <Translate component="h3" content="qvain.project.title" />
          <Translate component="p" content="qvain.project.description" />
          <AddedProjects />
          <ProjectForm onChange={this.onChange} formData={projectForm} />
          <FundingOrganization onChange={this.onChange} formData={organizationForm} />
          <AddLanguageContainer>
            <Button onClick={this.handleAddProject}>
              <Translate content="qvain.project.addButton" />
            </Button>
          </AddLanguageContainer>
        </Card>
      </Field>
    )
  }
}

const AddedProjectsComponent = ({ Stores }) => {
  // TODO: Implement edit project
  // TODO: Figure out how to display title with translations
  const { lang } = Stores.Locale
  const { removeProject, projects } = Stores.Qvain
  return (
    <>
      {projects.map(project => (
        <ButtonGroup tabIndex="0" key={project.identifier}>
          <ButtonLabel>{project.title.en}</ButtonLabel>
          <ButtonContainer>
            <EditButton aria-label="Edit" />
            <DeleteButton aria-label="Remove" onClick={() => removeProject(project.identifier)} />
          </ButtonContainer>
        </ButtonGroup>
      ))}
    </>
  )
}

AddedProjectsComponent.propTypes = {
  Stores: PropTypes.object.isRequired,
}

const AddedProjects = inject('Stores')(observer(AddedProjectsComponent))

const PaddedWord = styled.span`
  padding-right: 10px;
`

const AddLanguageContainer = styled.div`
  text-align: right;
  padding-top: 1rem;
`

export default inject('Stores')(observer(Project))
