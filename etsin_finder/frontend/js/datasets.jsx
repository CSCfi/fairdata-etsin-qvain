import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'

import axios from 'axios'

import HeroBanner from './components/hero'
import SearchBar from './components/searchBar'
import ResultsList from './components/resultsList'

class Datasets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      loading: false,
    };

    this.getData = this.getData.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  componentWillMount() {
    this.getData(this.props.match.params.query || '');
  }

  // TODO: put this somewhere else to make this file more readable
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

    this.toggleLoading(); // loader on

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
        this.updateData(res);
        console.log(res);
        this.toggleLoading(); // loader off
      })
      .catch((err) => {
        console.log(err);
        this.toggleLoading(); // loader off
      });
  }

  handleSubmit(event, query) {
    let searchQuery = query;
    if (!query) {
      searchQuery = '';
    }
    event.preventDefault();
    const path = `/datasets/${searchQuery}`;
    this.props.history.push(path);
    this.getData(searchQuery);
  }

  updateData(results) {
    this.setState({
      results: results.data.hits.hits,
      total: results.data.hits.total,
      aggregations: results.data.aggregations,
    });
  }

  handleFilter(term, value) {
    console.log(term);
    console.log(value);
  }

  toggleLoading() {
    this.setState({
      loading: !this.state.loading,
    });
  }

  render() {
    return (
      <div>
        <HeroBanner className="hero-primary">
          <div className="container">
            <div className="text-center">
              <h1>
                <Translate content="home.title" />
              </h1>
              <SearchBar
                query={this.props.match.params.query}
                handleSubmit={this.handleSubmit}
              />
            </div>
          </div>
        </HeroBanner>
        <ResultsList
          results={this.state.results}
          aggregations={this.state.aggregations}
          total={this.state.total}
          loading={this.state.loading}
          query={this.props.match.params.query}
          handleFilter={this.handleFilter}
        />
      </div>
    );
  }
}

export default withRouter(Datasets);
