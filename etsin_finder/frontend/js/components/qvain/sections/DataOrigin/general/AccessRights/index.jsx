import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { Title, Divider } from '@/components/qvain/general/V2'

import License from './License'
import AccessType from './AccessType'
import AccessRightsDescription from './Description'

const AccessRights = () => (
  <>
    <Translate component={Title} content="qvain.rightsAndLicenses.accessRights" />
    <FormContainer>
      <License />
      <AccessType />
      <Divider />
      <AccessRightsDescription />
    </FormContainer>
  </>
)

const FormContainer = styled.div`
  padding-left: 1rem;
`

export default AccessRights
