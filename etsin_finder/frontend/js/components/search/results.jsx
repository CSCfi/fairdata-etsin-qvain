import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import ElasticQuery from 'Stores/view/elasticquery'
import SortResults from './sortResults'
import Pagination from './pagination'
import ResultsList from './resultslist'
import ResultsAmount from './resultsAmount'
import CurrentQuery from './currentQuery'
import FilterResults from './filterResults'
import ErrorBoundary from '../general/errorBoundary'
import Loader from '../general/loader'

class Results extends Component {
  render() {
    return (
      <div className="container">
        <div className="row regular-row">
          <div className="col-lg-3">
            <ResultsAmount />
            <ErrorBoundary>
              <FilterResults />
            </ErrorBoundary>
          </div>
          <div className="col-lg-9">
            <div className="d-flex align-items-end flex-row-reverse justify-content-between">
              <SortResults />
              <CurrentQuery />
            </div>
            <Loader active={ElasticQuery.loading} margin="0.2em 0 1em" />
            <ResultsList query={this.props.query} />
          </div>
          <Pagination />
        </div>
      </div>
    )
  }
}

export default inject('Stores')(observer(Results))
