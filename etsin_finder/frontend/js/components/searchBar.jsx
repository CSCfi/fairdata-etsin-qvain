import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import ErrorBoundary from './errorBoundary'

class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault()
    const path = `/datasets/${this.state.value}`
    this.props.history.push(path)
  }

  render() {
    return (
      <ErrorBoundary>
        <form onSubmit={this.handleSubmit}>
          <div className="search">
            <div className="searchBar inner-addon right-addon">
              <i className="fa fa-search fa-2x" aria-hidden="true" />
              <input placeholder="Anna hakusana" value={this.state.value} onChange={this.handleChange} />
            </div>
          </div>
        </form>
      </ErrorBoundary>
    );
  }
}

export default withRouter(SearchBar)
