import React from 'react'
import Field from '../general/field'
import tooltipContent from './tooltipContent'
import Spatial from './spatial'

const translations = {
    title: 'qvain.temporalAndSpatial.title',
    tooltip: 'qvain.temporalAndSpatial.tooltip',
  }

  const components = {
    tooltipContent,
  }

  const fieldProps = {
    translations,
    components,
  }

const TemporalAndSpatial = () => (
  <Field {...fieldProps}>
    <Spatial />
  </Field>
)

export default TemporalAndSpatial
