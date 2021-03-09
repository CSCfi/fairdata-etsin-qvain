import React from 'react'
import { observer } from 'mobx-react'

import { withFieldErrorBoundary } from '../../../general/errors/fieldErrorBoundary'
import Field from '../../../general/section/field'
import SpatialFieldContent from './SpatialFieldContent'

const brief = {
  title: 'qvain.temporalAndSpatial.spatial.title',
  description: 'qvain.temporalAndSpatial.spatial.description',
}

const Spatial = () => (
  <Field brief={brief}>
    <SpatialFieldContent />
  </Field>
)

export default withFieldErrorBoundary(observer(Spatial), brief.title)
