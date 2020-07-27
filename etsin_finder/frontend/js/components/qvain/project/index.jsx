import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'

import { ProjectFunderType } from '../../../stores/view/qvain'

import Select from '../general/select'
import Field from '../general/field'
import Card from '../general/card'
import { LabelLarge, Input } from '../general/form'

import TooltipContent from './TooltipContent'

const fieldProps = {
  translations: {
    title: 'qvain.project.title',
    tooltip: 'qvain.project.description',
  },
  components: {
    tooltipContent: TooltipContent,
  }
}

const Project = () => (
  <Field {...fieldProps}>
    <Card>
      <Translate component="h3" content="qvain.project.title" />
      <Translate component="p" content="qvain.project.description" />
      <ProjectForm />
    </Card>
  </Field>
)


const ProjectFormCompoent = ({ Stores }) => {
  const { Qvain } = Stores
  return (
    <>
      <LabelLarge htmlFor="titleEn">
        <Translate content="qvain.project.inputs.title.label" />
      </LabelLarge>
      <Translate component="p" content="qvain.project.inputs.title.description" />
      <Translate
        component={Input}
        value={Qvain.projectTitle.en}
        onChange={(event) => Qvain.setProjectTitle('en', event.target.value)}
        attributes={{ placeholder: 'qvain.project.inputs.titleEn.placeholder' }}
        id="titleEn"
      />
      <Translate
        component={Input}
        value={Qvain.projectTitle.fi}
        onChange={(event) => Qvain.setProjectTitle('fi', event.target.value)}
        attributes={{ placeholder: 'qvain.project.inputs.titleFi.placeholder' }}
        id="titleFi"
      />
      <LabelLarge htmlFor="identifier">
        <Translate content="qvain.project.inputs.identifier.label" />
      </LabelLarge>
      <Translate component="p" content="qvain.project.inputs.identifier.description" />
      <Translate
        component={Input}
        value={Qvain.projectIdentifier}
        onChange={(event) => Qvain.setProjectIdentifier(event.target.value)}
        attributes={{ placeholder: 'qvain.project.inputs.identifier.placeholder' }}
        id="identifier"
      />
      <LabelLarge htmlFor="fundingIdentifier">
        <Translate content="qvain.project.inputs.fundingIdentifier.label" />
      </LabelLarge>
      <Translate component="p" content="qvain.project.inputs.fundingIdentifier.description" />
      <Translate
        component={Input}
        value={Qvain.projectFundingIdentifier}
        onChange={(event) => Qvain.setProjectFundingIdentifier(event.target.value)}
        attributes={{ placeholder: 'qvain.project.inputs.fundingIdentifier.placeholder' }}
        id="fundingIdentifier"
      />
      <LabelLarge htmlFor="funderType">
        <Translate content="qvain.project.inputs.funderType.label" />
      </LabelLarge>
      <FunderTypeSelect stores={Qvain} />
    </>
  )
}

ProjectFormCompoent.propTypes = {
  Stores: PropTypes.object.isRequired,
}


const FunderTypeSelect = ({ stores }) => {
  const { projectFunderType, setProjectFunderType } = stores
  return (
    <Select
      name="funder-type"
      getter={projectFunderType}
      setter={setProjectFunderType}
      model={ProjectFunderType}
      metaxIdentifier="funder_type"
      placeholder="qvain.project.inputs.funderType.placeholder"
      noOptionsMessage="qvain.project.inputs.funderType.noOptions"
    />
  )
}

FunderTypeSelect.propTypes = {
  stores: PropTypes.object.isRequired,
}

const ProjectForm = inject('Stores')(observer(ProjectFormCompoent))

export default Project
