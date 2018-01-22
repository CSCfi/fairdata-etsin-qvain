import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'

import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import ResultsList from './resultslist'
import ElasticQuery from '../../stores/view/elasticquery'

class Search extends Component {
  componentWillMount() {
    this.initialQuery()
  }

  initialQuery = () => {
    console.log('-------- performing initial query ---------')
    ElasticQuery.updateFromUrl(this.props.match.params.query)
    ElasticQuery.queryES()
  }


  render() {
    console.log('Render: Search page')
    return (
      <div>
        <HeroBanner className="hero-primary">
          <div className="container">
            <div className="text-center">
              <h1>
                <Translate content="home.title" />
              </h1>
              <SearchBar />
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
