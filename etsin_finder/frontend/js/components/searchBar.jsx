import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import ErrorBoundary from './errorBoundary'

class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getQuery = this.getQuery.bind(this)
  }

  componentDidMount() {
    this.getQuery();
  }

  getQuery() {
    const query = this.props.query
    if (query) { // runs only on datasets page, where query is predefined
      this.setState({ value: query })
      const searchBarInput = document.getElementById('searchBarInput');
      searchBarInput.focus();
      searchBarInput.setSelectionRange(query.length, query.lenght);
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault()
    const path = `/datasets/${this.state.value}`
    this.props.history.push(path)
    if (this.props.updateQuery) {
      this.props.updateQuery(this.state.value)
    }
  }

  render() {
    return (
      <ErrorBoundary>
        <form onSubmit={this.handleSubmit}>
          <div className="search">
            <div className="searchBar inner-addon right-addon">
              <i className="fa fa-search fa-2x" aria-hidden="true" />
              <input id="searchBarInput" placeholder="Anna hakusana" value={this.state.value} onChange={this.handleChange} />
            </div>
          </div>
        </form>
      </ErrorBoundary>
    );
  }
}

export default withRouter(SearchBar)
