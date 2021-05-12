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

import Accessibility from '../../../stores/view/accessibility'
import ExternalResources from './externalResources'
import IdaResourcesV2 from './idaResourcesV2'
import { withStores } from '../../../stores/stores'

class Data extends Component {
  componentDidMount() {
    const {
      DatasetQuery,
      Matomo: { recordEvent },
    } = this.props.Stores

    Accessibility.handleNavigation('data', false)

    if (!DatasetQuery.isDraft && !this.props.hasRemote) {
      DatasetQuery.fetchPackages()
    }

    recordEvent(`DATA / ${this.props.match?.params?.identifier}`)
  }

  render() {
    return (
      <div id={this.props.id}>
        {!this.props.hasRemote && <IdaResourcesV2 dataset={this.props.dataset} />}
        {this.props.hasRemote && <ExternalResources />}
      </div>
    )
  }
}

Data.propTypes = {
  Stores: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      identifier: PropTypes.string,
    }),
  }).isRequired,
  hasRemote: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
}

export default withStores(observer(Data))
