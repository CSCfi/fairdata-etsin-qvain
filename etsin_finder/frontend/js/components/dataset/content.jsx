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
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import Description from './description'
import Data from './data'
import Events from './events'
import Tabs from './tabs'
import Maps from './maps'
import { withStores } from '@/stores/stores'

const MarginAfter = styled.div`
  margin-bottom: 3em;
`

class Content extends Component {
  deletedVersionsExists = () => {
    let deletedVersion = false

    if (
      this.props.dataset.dataset_version_set !== undefined &&
      this.props.dataset.dataset_version_set.length > 0
    ) {
      for (let i = 0; i < this.props.dataset.dataset_version_set.length; i += 1) {
        if (this.props.dataset.dataset_version_set[i].date_removed !== undefined) {
          deletedVersion = true
        }
      }
    }
    return deletedVersion
  }

  versionsExists = () => {
    const versions = this.props.dataset.dataset_version_set || []
    const identifier = this.props.dataset.identifier
    return versions.some(version => !version.removed && version.identifier !== identifier)
  }

  showEvents() {
    return (
      this.deletedVersionsExists() ||
      this.versionsExists() ||
      (this.props.dataset.research_dataset.provenance !== undefined &&
        this.props.dataset.research_dataset.provenance.length > 0) ||
      this.props.dataset.date_deprecated !== undefined ||
      (this.props.dataset.research_dataset.other_identifier !== undefined &&
        this.props.dataset.research_dataset.other_identifier.length > 0) ||
      (this.props.dataset.research_dataset.relation !== undefined &&
        this.props.dataset.research_dataset.relation.length > 0) ||
      this.props.dataset.preservation_dataset_origin_version !== undefined
    )
  }

  showData() {
    // Hide data tab if
    // - it doesn't contain files or remote files
    // - the access_rights disallow it
    // - the dataset in removed or deprecated
    const {
      DatasetQuery: {
        results: { removed, deprecated },
      },
    } = this.props.Stores

    const { Access } = this.props.Stores
    if ((!this.props.hasFiles && !this.props.hasRemote) || removed || deprecated) {
      return false
    }

    if (this.props.hasFiles) {
      return Access.restrictions.allowDataIda
    }
    if (this.props.hasRemote) {
      return Access.restrictions.allowDataRemote
    }
    return false
  }

  showMaps() {
    if (this.props.dataset.research_dataset.spatial) {
      return true
    }
    return false
  }

  render() {
    let query = ''
    const params = new URLSearchParams(this.props.location.search)
    if (params.get('preview') === '1') {
      query = '?preview=1'
    }

    return (
      <MarginAfter className="col-lg-8">
        <Tabs
          identifier={this.props.identifier}
          location={this.props.location}
          showData={this.showData()}
          showEvents={this.showEvents()}
          showMaps={this.showMaps()}
        />

        <Switch>
          {/* Initial route */}
          <Route
            exact
            path="/dataset/:identifier"
            render={props => (
              <Description
                id="tab-description"
                aria-labelledby="tab-for-description"
                role="tabpanel"
                dataset={this.props.dataset}
                emails={this.props.emails}
                harvested={this.props.harvested}
                cumulative={this.props.cumulative}
                {...props}
              />
            )}
          />

          {/* Route to downloads */}
          {this.showData() && (
            <Route
              exact
              path="/dataset/:identifier/data"
              render={props => (
                <Data
                  id="tab-data"
                  aria-labelledby="tab-for-data"
                  role="tabpanel"
                  hasRemote={this.props.hasRemote}
                  hasFiles={this.props.hasFiles}
                  {...props}
                />
              )}
            />
          )}

          {/* Route to Events */}
          {this.showEvents() && (
            <Route
              exact
              path="/dataset/:identifier/events"
              render={props => (
                <Events
                  id="tab-events"
                  aria-labelledby="tab-for-events"
                  role="tabpanel"
                  dataset={this.props.dataset}
                  versionTitles={this.props.versionTitles}
                  {...props}
                />
              )}
            />
          )}

          {/* Route to Maps */}
          {this.showMaps() && (
            <Route
              exact
              path="/dataset/:identifier/maps"
              render={props => (
                <Maps
                  id="tab-maps"
                  aria-labelledby="tab-for-maps"
                  role="tabpanel"
                  spatial={this.props.dataset.research_dataset.spatial}
                  {...props}
                />
              )}
            />
          )}

          <Route>
            <Redirect to={`/dataset/${this.props.identifier}${query}`} />
          </Route>
        </Switch>
      </MarginAfter>
    )
  }
}

export default withStores(withRouter(observer(Content)))

Content.defaultProps = {
  harvested: false,
  cumulative: false,
  versionTitles: undefined,
}

Content.propTypes = {
  Stores: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired,
  emails: PropTypes.shape({
    CONTRIBUTOR: PropTypes.bool,
    CREATOR: PropTypes.bool,
    CURATOR: PropTypes.bool,
    PUBLISHER: PropTypes.bool,
    RIGHTS_HOLDER: PropTypes.bool,
  }).isRequired,
  harvested: PropTypes.bool,
  cumulative: PropTypes.bool,
  hasFiles: PropTypes.bool.isRequired,
  hasRemote: PropTypes.bool.isRequired,
  identifier: PropTypes.string.isRequired,
  versionTitles: PropTypes.object,
}
