import React, { Component } from 'react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import Accessibility from '../../../stores/view/accessibility'
import TableHeader from './tableHeader'

export default class ExternalResources extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    Accessibility.setNavText('Navigated to Data tab')
  }

  render() {
    return (
      <div className="dataset-downloads">
        <TableHeader />
        <Table />
      </div>
    )
  }
}
