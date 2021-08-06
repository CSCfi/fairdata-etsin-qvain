import React from 'react'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Field from '../../../general/section/field'
import TemporalFieldContent from './temporalFieldContent'

export const brief = {
  title: 'qvain.temporalAndSpatial.temporal.title',
  description: 'qvain.temporalAndSpatial.temporal.description',
}

const Temporal = () => (
  <Field brief={brief}>
    <TemporalFieldContent />
  </Field>
)

export default withFieldErrorBoundary(observer(Temporal), brief.title)
