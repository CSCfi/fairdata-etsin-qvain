import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import useScrollToTop from '@/utils/useScrollToTop'

import { FormContainer, ModalLabel, FieldGroup, Title } from '@/components/qvain/general/V2'
import TabInput from '@/components/qvain/general/V3/tab/TabInput.v3'
import TranslationTab from '@/components/qvain/general/V3/tab/TranslationTab.v3'

import ModalInput from './generic/ModalInput.v3'
import OrganizationsField from './generic/List/OrganizationsField'
import OrganizationSelect from './generic/OrganizationSelect.v3'
import ModalReferenceInputV3 from './generic/ModalReferenceInput.v3'

export const ProjectForm = observer(({ modal }) => {
  const ref = useScrollToTop()
  return (
    <FormContainer ref={ref}>
      <FieldGroup>
        <Translate component={ModalLabel} content="qvain.project.modal.section.title.project" />
        <TitleField item={modal} />
        <ModalInput
          item={modal}
          fieldName="project_identifier"
          changeCallback={modal.controller.setHasChanged}
        />
        <OrganizationsField
          item={modal}
          fieldName="participating_organizations"
          changeCallback={modal.controller.setHasChanged}
        />
      </FieldGroup>
      <FieldGroup>
        <Funding item={modal} />
      </FieldGroup>
    </FormContainer>
  )
})

ProjectForm.propTypes = {
  modal: PropTypes.object.isRequired,
}

const TitleField = observer(({ item }) => {
  const [language, setLanguage] = useState('en')

  return (
    <TranslationTab language={language} setLanguage={setLanguage}>
      <TabInput
        fieldName="title"
        item={item}
        language={language}
        changeCallback={item.controller.setHasChanged}
        isRequired
      />
    </TranslationTab>
  )
})

TitleField.propTypes = {
  item: PropTypes.object.isRequired,
}

const Funding = observer(({ item }) => (
  <>
    <Translate component={ModalLabel} content="qvain.project.modal.section.title.funding" />
    <Fund item={item.funding} project={item} />
  </>
))

Funding.propTypes = {
  item: PropTypes.object.isRequired,
}

const Fund = observer(({ item, project }) => (
  <>
    <ModalReferenceInputV3
      item={item.funder}
      fieldName="funder_type"
      changeCallback={project.controller.setHasChanged}
    />
    <Translate
      htmlFor="funder-org"
      content={`${item.funder.organization.translationPath}.label`}
      component={Title}
    />
    <OrganizationSelect
      id="funder-org"
      item={item.funder.organization}
      changeCallback={project.controller.setHasChanged}
    />
    <ModalInput
      item={item}
      fieldName="funding_identifier"
      changeCallback={project.controller.setHasChanged}
    />
  </>
))

Fund.propTypes = {
  item: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
}
