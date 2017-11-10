import React, { Component } from 'react';
import axios from 'axios'

import ErrorBoundary from './errorBoundary'

export default class SearchBar extends Component {
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
    axios.get(`https://30.30.30.30/es/metax/dataset/_search?q=${this.state.value}:*&pretty`)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      });
    event.preventDefault();
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
