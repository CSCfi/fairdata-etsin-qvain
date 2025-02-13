import React from 'react'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'
import { FormContainer, ModalLabel, FieldGroup } from '@/components/qvain/general/V2'
import FunderTypeSelect from './FunderTypeSelect'
import FunderOrganizationSelect from './FunderOrganizationSelect'
import ModalInput from '@/components/qvain/general/V2/ModalInput'

import NameField from './NameField'
import OrganizationField from './OrganizationField'
import useScrollToTop from '@/utils/useScrollToTop'

const Form = ({ Field }) => {
  const ref = useScrollToTop()
  return (
    <FormContainer ref={ref}>
      <FieldGroup>
        <Translate component={ModalLabel} content="qvain.projectV2.title.project" />
        <NameField />
        <ModalInput Field={Field} datum="identifier" translationsRoot="qvain.projectV2" />
        <OrganizationField />
      </FieldGroup>
      <FieldGroup>
        <Translate component={ModalLabel} content={'qvain.projectV2.title.funding'} />
        <FunderOrganizationSelect />
        <FunderTypeSelect />
        <ModalInput Field={Field} datum="fundingIdentifier" translationsRoot="qvain.projectV2" />
      </FieldGroup>
    </FormContainer>
  )
}

Form.propTypes = {
  Field: PropTypes.object.isRequired,
}

export default Form
