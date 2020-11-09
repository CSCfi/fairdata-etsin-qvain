import React from 'react'
import { Section } from '../../general/section/index'
import TooltipContent from './TooltipContent'
import RelatedResource from './relatedResource'
import Infrastructure from './infrastructure'
import Provenance from './provenance'

const translations = {
  title: 'qvain.history.title',
  tooltip: 'qvain.history.tooltip',
}

const components = {
  tooltipContent: TooltipContent,
}

const fieldProps = {
  translations,
  components,
}

const History = () => (
  <Section {...fieldProps}>
    <RelatedResource />
    <Infrastructure />
    <Provenance />
  </Section>
)

export default History
