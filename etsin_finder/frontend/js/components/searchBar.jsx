import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

import ErrorBoundary from './errorBoundary'

class SearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getQuery();
  }

  getQuery() {
    const query = this.props.query
    if (query) {
      this.setState({ value: query })
      const searchBarInput = document.getElementById('searchBarInput');
      searchBarInput.focus();
      searchBarInput.setSelectionRange(query.length, query.lenght);
    }
    if (this.props.results) {
      this.getData(query)
    }
  }

  // TODO: refactor all of this, atm not readable
  getData(query) {
    // Handle user search query
    let queryObject;
    if (query) {
      queryObject = {
        multi_match: {
          query,
          fields: ['title.en', 'title.fi'], // todo
        },
      }
    } else {
      // No user search query, fetch all docs
      queryObject = {
        match_all: {},
      }
    }

    this.props.loading() // loader on
    axios.post('/es/metax/dataset/_search', {
      size: 20,
      query: queryObject,
      aggregations: {
        organization: {
          terms: {
            field: 'organization_name.keyword',
          },
        },
        creator: {
          terms: {
            field: 'creator_name.keyword',
          },
        },
        field_of_science_en: {
          terms: {
            field: 'field_of_science.pref_label.en.keyword',
          },
        },
        field_of_science_fi: {
          terms: {
            field: 'field_of_science.pref_label.fi.keyword',
          },
        },
        keyword_en: {
          terms: {
            field: 'theme.label.en.keyword',
          },
        },
        keyword_fi: {
          terms: {
            field: 'theme.label.fi.keyword',
          },
        },
      },
    }, {
      auth: { // TODO obvs this must be safer
        username: 'etsin',
        password: 'test-etsin',
      },
    })
      .then((res) => {
        this.props.results(res)
        console.log(res)
        this.props.loading() // loader off
      })
      .catch((err) => {
        console.log(err)
        this.props.loading() // loader off
      });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault()
    const path = `/datasets/${this.state.value}`
    this.props.history.push(path)
    if (this.props.results) {
      this.getData(this.state.value)
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
