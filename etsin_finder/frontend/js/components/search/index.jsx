import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'

import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import ResultsList from './resultslist'
import ElasticQuery from '../../stores/view/elasticquery'

class Search extends Component {
  initialQuery = () => {
    ElasticQuery.updateSearch(this.props.match.params.query)
    ElasticQuery.queryES()
  }
  render() {
    console.log('Render: Search page')
    if (this.props.match.params.query) {
      this.initialQuery();
    }
    return (
      <div>
        <HeroBanner className="hero-primary">
          <div className="container">
            <div className="text-center">
              <h1>
                <Translate content="home.title" />
              </h1>
              <SearchBar
                history={this.props.history}
              />
            </div>
          </div>
        </HeroBanner>
        <ResultsList
          query={this.props.match.params.query}
        />
      </div>
    );
  }
}

export default withRouter(Search);
