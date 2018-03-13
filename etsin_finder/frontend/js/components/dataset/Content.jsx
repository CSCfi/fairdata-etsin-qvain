import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import Description from './description'
import Downloads from './downloads'
import Identifier from './data/identifier'
import ErrorBoundary from '../general/errorBoundary'
import Tabs from './tabs'

const MarginAfter = styled.div`
  margin-bottom: 3em;
`

export default class Content extends Component {
  constructor() {
    super()

    this.goBack = this.goBack.bind(this)
  }

  // goes back to previous page, which might be outside
  goBack() {
    this.props.history.goBack()
  }

  render() {
    return (
      <MarginAfter className="col-lg-8">
        <button className="btn btn-transparent nopadding btn-back" onClick={this.goBack}>
          <span aria-hidden>{'< '}</span>
          {'Go back'}
        </button>
        <ErrorBoundary>
          {this.props.dataset.data_catalog.catalog_json.harvested || !this.props.hasFiles ? null : (
            <Tabs identifier={this.props.match.params.identifier} live={this.props.live} />
          )}
        </ErrorBoundary>
        <ErrorBoundary>
          <Route
            exact
            path="/dataset/:identifier"
            render={() => <Description dataset={this.props.dataset} emails={this.props.emails} />}
          />
        </ErrorBoundary>
        {this.props.live ? (
          <ErrorBoundary>
            {this.props.dataset.data_catalog.catalog_json.harvested ? (
              <Identifier idn={this.props.dataset.research_dataset.preferred_identifier} button>
                <Translate content="dataset.data_location" fallback="this is fallback" />
              </Identifier>
            ) : (
              <Route exact path="/dataset/:identifier/data" component={Downloads} />
            )}
          </ErrorBoundary>
        ) : null}
      </MarginAfter>
    )
  }
}

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
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}
