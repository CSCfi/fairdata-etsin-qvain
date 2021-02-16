import React from 'react'
import InfrastructureSelection from './InfrastructureSelection'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import { Field } from '../../../general/section'

const brief = {
  title: 'qvain.history.infrastructure.title',
  description: 'qvain.history.infrastructure.description',
}

const Infrastructure = () => (
  <Field brief={brief} labelFor="infrastructure-select">
    <InfrastructureSelection />
  </Field>
)

export default withFieldErrorBoundary(Infrastructure, brief.title)
