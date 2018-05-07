import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Accessibility from '../../../stores/view/accessibility'
import ExternalResources from './externalResources'
import IdaResources from './idaResources'

export default class Data extends Component {
  state = {}

  componentDidMount() {
    Accessibility.setNavText('Navigated to Data tab')
  }

  render() {
    return (
      <div>
        {this.props.hasFiles && <IdaResources />}
        {this.props.hasRemote && <ExternalResources />}
      </div>
    )
  }
}

Data.propTypes = {
  hasFiles: PropTypes.bool.isRequired,
  hasRemote: PropTypes.bool.isRequired,
}
