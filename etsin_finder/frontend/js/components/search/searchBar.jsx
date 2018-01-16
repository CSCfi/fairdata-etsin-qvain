import React, { Component } from 'react'

import ErrorBoundary from '../general/errorBoundary'
import ElasticQuery from '../../stores/view/elasticquery'

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    // Handle possible empty initial query
    this.state = { query: ElasticQuery.search || '' };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // if (this.props.query) {
    //   const searchBarInput = document.getElementById('searchBarInput');
    //   searchBarInput.focus();
    //   searchBarInput.setSelectionRange(this.props.query.length, this.props.query.length);
    // }
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault()
    ElasticQuery.updateSearch(this.state.query)
    const path = `/datasets/${this.state.query}`
    this.props.history.push(path)
    ElasticQuery.queryES()
  }

  render() {
    return (
      <ErrorBoundary>
        <form onSubmit={e => this.handleSubmit(e)}>
          <div className="search">
            <div className="searchBar inner-addon right-addon">
              <i className="fa fa-search fa-2x" aria-hidden="true" />
              <input id="searchBarInput" placeholder="Anna hakusana" value={this.state.query} onChange={this.handleChange} />
            </div>
          </div>
        </form>
      </ErrorBoundary>
    );
  }
}
