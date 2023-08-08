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
import { observer } from 'mobx-react'

import ExternalResources from './externalResources'
import IdaResources from './idaResources'
import { withStores } from '@/stores/stores'

class Data extends Component {
  componentDidMount() {
    const {
      Matomo: { recordEvent },
      Accessibility,
    } = this.props.Stores

    Accessibility.handleNavigation('data', false)
    recordEvent(`DATA / ${this.props.match?.params?.identifier}`)
  }

  render() {
    const {
      Etsin: {
        EtsinDataset: { hasRemoteResources },
      },
    } = this.props.Stores

    return (
      <div className="tabContent" id={this.props.id}>
        {!hasRemoteResources && <IdaResources />}
        {hasRemoteResources && <ExternalResources />}
      </div>
    )
  }
}

Data.propTypes = {
  Stores: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      identifier: PropTypes.string,
    }),
  }).isRequired,
  id: PropTypes.string.isRequired,
}

export default withStores(observer(Data))
