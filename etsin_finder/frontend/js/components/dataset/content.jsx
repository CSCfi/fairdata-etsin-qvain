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
import { Route, withRouter } from 'react-router-dom'
import styled from 'styled-components'

import access from '../../stores/view/access'
import Description from './description'
import Data from './data'
import Events from './events'
import Tabs from './tabs'
import Maps from './maps'

const MarginAfter = styled.div`
  margin-bottom: 3em;
`

class Content extends Component {
  showEvents() {
    return (
      (this.props.dataset.research_dataset.provenance !== undefined &&
        this.props.dataset.research_dataset.provenance.length > 0) ||
      (this.props.dataset.research_dataset.other_identifier !== undefined &&
        this.props.dataset.research_dataset.other_identifier.length > 0) ||
      (this.props.dataset.research_dataset.relation !== undefined &&
        this.props.dataset.research_dataset.relation.length > 0)
    )
  }

  showData() {
    // Hide data tab if
    // - it doesn't contain files or remote files
    // - the dataset is harvested
    // - the access_rights allow it
    // - the dataset in removed or deprecated

    if (
      (!this.props.hasFiles && !this.props.hasRemote) ||
      this.props.harvested ||
      this.props.isRemoved ||
      this.props.isDeprecated
    ) {
      return false
    }
    if (this.props.hasFiles) {
      return access.restrictions.allowDataIda
    } else if (this.props.hasRemote) {
      return access.restrictions.allowDataRemote
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
    return (
      <MarginAfter className="col-lg-8">
        <Tabs
          identifier={this.props.identifier}
          location={this.props.location}
          showData={this.showData()}
          showEvents={this.showEvents()}
          showMaps={this.showMaps()}
        />

        {/* Initial route */}
        <Route
          exact={this.showData() || this.showEvents()}
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
                provenance={this.props.dataset.research_dataset.provenance}
                other_identifier={this.props.dataset.research_dataset.other_identifier}
                relation={this.props.dataset.research_dataset.relation}
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
      </MarginAfter>
    )
  }
}

export default withRouter(Content)

Content.defaultProps = {
  harvested: false,
  cumulative: false,
}

Content.propTypes = {
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
  isRemoved: PropTypes.bool.isRequired,
  isDeprecated: PropTypes.bool.isRequired,
}
