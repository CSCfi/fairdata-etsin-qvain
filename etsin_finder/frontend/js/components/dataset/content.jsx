import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, withRouter } from 'react-router-dom'
import styled from 'styled-components'

import Description from './description'
import Downloads from './downloads'
import Events from './events'
import Tabs from './tabs'

const MarginAfter = styled.div`
  margin-bottom: 3em;
`

class Content extends Component {
  componentWillReceiveProps(newProps) {
    console.log('content', newProps)
  }

  showEvents() {
    if (
      (this.props.dataset.research_dataset.provenance &&
        this.props.dataset.research_dataset.provenance.length > 0) ||
      (this.props.dataset.research_dataset.other_identifier &&
        this.props.dataset.research_dataset.other_identifier.length > 0) ||
      (this.props.dataset.research_dataset.relation &&
        this.props.dataset.research_dataset.relation.length > 0)
    ) {
      return true
    }
    return false
  }

  showDownloads() {
    if (
      this.props.live &&
      this.props.hasFiles[0] &&
      !this.props.dataset.data_catalog.catalog_json.harvested
    ) {
      return true
    }
    return false
  }

  render() {
    return (
      <MarginAfter className="col-lg-8">
        <Tabs
          identifier={this.props.identifier}
          showDownloads={this.showDownloads()}
          showEvents={this.showEvents()}
        />

        {/* Initial route */}
        <Route
          exact={this.showDownloads() || this.showEvents()}
          path="/dataset/:identifier"
          render={() => <Description dataset={this.props.dataset} emails={this.props.emails} />}
        />

        {/* Route to downloads */}
        {this.showDownloads() && (
          <Route exact path="/dataset/:identifier/data" component={Downloads} />
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
      </MarginAfter>
    )
  }
}

export default withRouter(Content)

Content.defaultProps = {
  hasFiles: [],
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
  live: PropTypes.bool.isRequired,
  hasFiles: PropTypes.array,
  identifier: PropTypes.string.isRequired,
}
