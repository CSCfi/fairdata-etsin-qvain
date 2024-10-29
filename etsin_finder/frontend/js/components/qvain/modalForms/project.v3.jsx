import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import useScrollToTop from '@/utils/useScrollToTop'

import { FormContainer, ModalLabel, FieldGroup } from '@/components/qvain/general/V2'
import TabInput from '@/components/qvain/general/V3/tab/TabInput.v3'
import TranslationTab from '@/components/qvain/general/V3/tab/TranslationTab.v3'

import ModalInput from './generic/ModalInput.v3'
import OrganizationField from './generic/OrganizationField'

export const ProjectForm = observer(({ modal }) => {
  const ref = useScrollToTop()
  return (
    <FormContainer ref={ref}>
      <FieldGroup>
        <Translate component={ModalLabel} content="qvain.projectV2.title.project" />
        <TitleField item={modal} />
        <ModalInput item={modal} fieldName="project_identifier" />
        <OrganizationField item={modal} fieldName="participating_organizations" />
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
      <TabInput fieldName="title" item={item} language={language} isRequired />
    </TranslationTab>
  )
})

TitleField.propTypes = {
  item: PropTypes.object.isRequired,
}
