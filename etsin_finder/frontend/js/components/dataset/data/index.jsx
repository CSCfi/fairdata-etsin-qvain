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

import Tracking from '../../../utils/tracking'
import Accessibility from '../../../stores/view/accessibility'
import ExternalResources from './externalResources'
import IdaResources from './idaResources'
import IdaResourcesV2 from './idaResourcesV2'
import { withStores } from '../../../stores/stores'

class Data extends Component {
  componentDidMount() {
    Tracking.newPageView(
      `Dataset: ${this.props.match.params.identifier} | Data`,
      this.props.location.pathname
    )
    Accessibility.handleNavigation('data', false)

    const { DatasetQuery } = this.props.Stores
    const { downloadApiV2 } = this.props.Stores.Env
    if (downloadApiV2 && !DatasetQuery.isDraft) {
      DatasetQuery.fetchPackages()
    }
  }

  render() {
    const { metaxApiV2 } = this.props.Stores.Env

    return (
      <div id={this.props.id}>
        {metaxApiV2 && !this.props.hasRemote && <IdaResourcesV2 dataset={this.props.dataset} />}
        {!metaxApiV2 && this.props.hasFiles && <IdaResources dataset={this.props.dataset} />}
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
  hasFiles: PropTypes.bool.isRequired,
  hasRemote: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
}

export default withStores(observer(Data))
