import React from 'react'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'

import useScrollOnTop from '@/utils/useScrollToTop'
import { FormContainer, FieldGroup } from '@/components/qvain/general/V2'

import ResourcesSearchField from './ResourceSearchField'
import PublicationDetails from './PublicationDetails'

const Form = ({ Field }) => {
  const ref = useScrollOnTop()
  return (
    <FormContainer ref={ref}>
      <FieldGroup>
        <Translate content="qvain.publications.publications.infoText" />
        <ResourcesSearchField />
      </FieldGroup>
      <PublicationDetails Field={Field} />
    </FormContainer>
  )
}

Form.propTypes = {
  Field: PropTypes.object.isRequired,
}

export default Form
