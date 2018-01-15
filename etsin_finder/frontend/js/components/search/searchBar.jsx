import React, { Component } from 'react'

import ErrorBoundary from '../general/errorBoundary'

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    // Handle possible empty initial query
    this.state = { query: this.props.query || '' };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.query) {
      const searchBarInput = document.getElementById('searchBarInput');
      searchBarInput.focus();
      searchBarInput.setSelectionRange(this.props.query.length, this.props.query.length);
    }
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  render() {
    return (
      <ErrorBoundary>
        <form onSubmit={e => this.props.handleSubmit(e, this.state.query)}>
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
