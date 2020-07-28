import React from 'react'
import PropTypes from 'prop-types'

import Translate from 'react-translate-component'

import { ProjectFunderType } from '../../../stores/view/qvain'
import { LabelLarge, Input } from '../general/form'
import Select from '../general/select'
import ValidationError from '../general/validationError'


const ProjectForm = ({ onChange, formData }) => (
  <>
    <ProjectLabel
      htmlFor="titleEn"
      title="qvain.project.inputs.title.label"
      description="qvain.project.inputs.title.description"
    />
    <Translate
      component={Input}
      value={formData.titleEn}
      onChange={event => onChange(event.target.id, event.target.value)}
      attributes={{ placeholder: 'qvain.project.inputs.titleEn.placeholder' }}
      id="titleEn"
    />
    <ErrorMessages errors={formData.errors.titleEn} />
    <Translate
      component={Input}
      value={formData.titleFi}
      onChange={event => onChange(event.target.id, event.target.value)}
      attributes={{ placeholder: 'qvain.project.inputs.titleFi.placeholder' }}
      id="titleFi"
    />
    <ErrorMessages errors={formData.errors.titleFi} />
    <ProjectLabel
      htmlFor="identifier"
      title="qvain.project.inputs.identifier.label"
      description="qvain.project.inputs.identifier.description"
    />
    <Translate
      component={Input}
      value={formData.identifier}
      onChange={event => onChange(event.target.id, event.target.value)}
      attributes={{ placeholder: 'qvain.project.inputs.identifier.placeholder' }}
      id="identifier"
    />
    <ErrorMessages errors={formData.errors.identifier} />
    <ProjectLabel
      htmlFor="fundingIdentifier"
      title="qvain.project.inputs.fundingIdentifier.label"
      description="qvain.project.inputs.fundingIdentifier.description"
    />
    <Translate
      component={Input}
      value={formData.fundingIdentifier}
      onChange={event => onChange(event.target.id, event.target.value)}
      attributes={{ placeholder: 'qvain.project.inputs.fundingIdentifier.placeholder' }}
      id="fundingIdentifier"
    />
    <ErrorMessages errors={formData.errors.fundingIdentifier} />
    <ProjectLabel
      htmlFor="funderType"
      title="qvain.project.inputs.funderType.label"
    />
    <Select
      name="funder-type"
      getter={formData.funderType}
      setter={(newValue) => onChange('funderType', newValue) }
      model={ProjectFunderType}
      metaxIdentifier="funder_type"
      placeholder="qvain.project.inputs.funderType.placeholder"
      noOptionsMessage="qvain.project.inputs.funderType.noOptions"
    />
    <ErrorMessages errors={formData.errors.funderType} />
  </>
)

ProjectForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
}

const ProjectLabel = ({ htmlFor, title, description }) => (
  <>
    <LabelLarge htmlFor={htmlFor}>
      <Translate content={title} />
    </LabelLarge>
    { description &&
      <Translate component="p" content={description} /> }
  </>
)

ProjectLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
}

ProjectLabel.defaultProps = {
  description: null,
}

const ErrorMessages = ({ errors }) => {
  if (!errors.length) return null
  return (
    <ValidationError>
      { errors.map(error => error) }
    </ValidationError>
  )
}

ErrorMessages.propTypes = {
  errors: PropTypes.array,
}

ErrorMessages.defaultProps = {
  errors: []
}

export default ProjectForm
