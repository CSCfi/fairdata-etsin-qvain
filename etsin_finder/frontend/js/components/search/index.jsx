import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'

import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import ResultsList from './resultslist'
import queryES from '../../utils/queryES'

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      loading: false,
    };

    this.getData = this.getData.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggleLoading = this.toggleLoading.bind(this)
    this.updateData = this.updateData.bind(this)
  }

  componentWillMount() {
    this.getData(this.props.match.params.query || '')
  }

  getData(query) {
    this.toggleLoading();
    queryES(query)
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
    this.getData(query)
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

export default withRouter(Search);
