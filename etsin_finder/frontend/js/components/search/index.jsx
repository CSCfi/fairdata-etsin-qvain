import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'

import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import Results from './results'
import ElasticQuery from '../../stores/view/elasticquery'
import getIdentifierFromQuery from '../../utils/getIdentifierFromQuery'

class Search extends Component {
  componentWillMount() {
    this.initialQuery()
  }

  initialQuery = () => {
    console.log('-------- performing initial query ---------')
    const identifier = getIdentifierFromQuery(this.props.match.params.query)
    if (identifier) {
      console.log('#')
    } else {
      ElasticQuery.updateFromUrl(this.props.match.params.query, this.props.history)
      ElasticQuery.queryES()
    }
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
        <Results query={this.props.match.params.query} />
      </div>
    )
  }
}

export default withRouter(Search)
