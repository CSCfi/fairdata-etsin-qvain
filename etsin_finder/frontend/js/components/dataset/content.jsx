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
    return (
      (this.props.hasFiles || this.props.hasRemote) && !this.props.harvested && access.accessDataTab
    )
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
          showData={this.showData()}
          showEvents={this.showEvents()}
          showMaps={this.showMaps()}
        />

        {/* Initial route */}
        <Route
          exact={this.showData() || this.showEvents()}
          path="/dataset/:identifier"
          render={() => (
            <Description
              dataset={this.props.dataset}
              emails={this.props.emails}
              harvested={this.props.harvested}
              cumulative={this.props.cumulative}
            />
          )}
        />

        {/* Route to downloads */}
        {this.showData() && (
          <Route
            exact
            path="/dataset/:identifier/data"
            render={() => <Data hasRemote={this.props.hasRemote} hasFiles={this.props.hasFiles} />}
          />
        )}

        {/* Route to Events */}
        {this.showEvents() && (
          <Route
            exact
            path="/dataset/:identifier/events"
            render={() => (
              <Events
                provenance={this.props.dataset.research_dataset.provenance}
                other_identifier={this.props.dataset.research_dataset.other_identifier}
                relation={this.props.dataset.research_dataset.relation}
              />
            )}
          />
        )}

        {/* Route to Maps */}
        {this.showMaps() && (
          <Route
            exact
            path="/dataset/:identifier/maps"
            render={() => <Maps spatial={this.props.dataset.research_dataset.spatial} />}
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
}
