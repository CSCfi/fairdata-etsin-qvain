import React, { Component } from 'react'
import ErrorBoundary from '../general/errorBoundary'
import SortResults from './sortResults'
import Loader from '../general/loader'
import Pagination from './pagination'
import ResultsList from './resultslist'
import ResultsAmount from './resultsAmount'
import CurrentQuery from './currentQuery'
import FilterResults from './filterResults'

export default class Results extends Component {
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
            <Loader />
            <ResultsList query={this.props.query} />
          </div>
          <Pagination />
        </div>
      </div>
    )
  }
}
