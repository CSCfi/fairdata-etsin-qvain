import React from 'react'
import { Section } from '../general/section/index'
import tooltipContent from './tooltipContent'
import Spatial from './spatial'
import Temporal from './temporal'

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
  <Section {...fieldProps}>
    <Spatial />
    <Temporal />
  </Section>
    )

export default TemporalAndSpatial
