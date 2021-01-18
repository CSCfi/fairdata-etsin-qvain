import React from 'react'
import InfrastructureSelection from './InfrastructureSelection'
import { Field } from '../../../general/section'

const brief = {
  title: 'qvain.history.infrastructure.title',
  description: 'qvain.history.infrastructure.description',
}

export default () => (
  <Field brief={brief} labelFor="infrastructure-select">
    <InfrastructureSelection />
  </Field>
)
