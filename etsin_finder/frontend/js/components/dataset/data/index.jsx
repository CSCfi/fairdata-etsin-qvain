{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Tracking from '../../../utils/tracking'
import Accessibility from '../../../stores/view/accessibility'
import ExternalResources from './externalResources'
import IdaResources from './idaResources'

export default class Data extends Component {
  componentDidMount() {
    Tracking.newPageView(
      `Dataset: ${this.props.match.params.identifier} | Data`,
      this.props.location.pathname
    )
    Accessibility.handleNavigation('data', false)
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      identifier: PropTypes.string,
    }),
  }).isRequired,
  hasFiles: PropTypes.bool.isRequired,
  hasRemote: PropTypes.bool.isRequired,
}
