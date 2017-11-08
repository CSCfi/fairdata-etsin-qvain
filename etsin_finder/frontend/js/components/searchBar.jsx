import React, { Component } from 'react';
import ErrorBoundary from './errorBoundary'

export default class SearchBar extends Component {
  render() {
    return (
      <ErrorBoundary>
        <div className="search">
          <div className="searchBar inner-addon right-addon">
            <i className="fa fa-search fa-2x" aria-hidden="true" />
            <input placeholder="Anna hakusana" />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
