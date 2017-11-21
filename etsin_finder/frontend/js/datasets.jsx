import React, { Component } from 'react'
import Translate from 'react-translate-component'

import HeroBanner from './components/hero'
import SearchBar from './components/searchBar'
import ResultsList from './components/resultsList'

export default class Datasets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      loading: false,
    }
    this.updateData = this.updateData.bind(this)
    this.toggleLoading = this.toggleLoading.bind(this)
  }

  updateData(results) {
    this.setState({
      results: results.data.hits.hits,
      total: results.data.hits.total,
    })
  }

  toggleLoading() {
    this.setState({
      loading: !this.state.loading,
    })
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
                loading={this.toggleLoading}
                results={this.updateData}
              />
            </div>
          </div>
        </HeroBanner>
        <ResultsList
          results={this.state.results}
          total={this.state.total}
          loading={this.state.loading}
          query={this.props.match.params.query}
        />
      </div>
    );
  }
}
