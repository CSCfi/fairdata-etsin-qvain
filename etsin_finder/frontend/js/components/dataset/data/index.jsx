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
import translate from 'counterpart'

import Accessibility from '../../../stores/view/accessibility'
import ExternalResources from './externalResources'
import IdaResources from './idaResources'

export default class Data extends Component {
  state = {}

  componentDidMount() {
    Accessibility.setNavText(translate('nav.announcer.dataTab'))
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
