import React, { Component } from 'react'
import Field from '../general/field'
import TooltipContent from './TooltipContent'
import Infrastructure from './infrastructure'

const translations = {
  title: 'qvain.history.title',
  tooltip: 'qvain.history.tooltip',
}

const components = {
  TooltipContent,
}

const fieldProps = {
  translations,
  components,
}

class History extends Component {
  render() {
    return (
      <Field {...fieldProps}>
        <Infrastructure />
      </Field>
    )
  }
}

export default History
