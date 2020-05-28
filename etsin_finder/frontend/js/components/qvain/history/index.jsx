import React, { Component } from 'react'
import { Section } from '../general/section/index'
import TooltipContent from './TooltipContent'
import Infrastructure from './infrastructure'

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

class History extends Component {
  render() {
    return (
      <Section {...fieldProps}>
        <Infrastructure />
      </Section>
    )
  }
}

export default History
