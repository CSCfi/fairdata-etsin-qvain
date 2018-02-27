import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'

import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import Results from './results'
import ElasticQuery from '../../stores/view/elasticquery'

class Search extends Component {
  componentWillMount() {
    this.initialQuery()
  }
  componentDidMount() {
    // when searching on frontpage keep focus in input after enter
    if (this.props.match.params.query) {
      this.search.focus()
      this.search.selectionStart = this.search.value.length
      this.search.selectionEnd = this.search.value.length
    }
  }

  initialQuery = () => {
    console.log('-------- performing initial query ---------')
    ElasticQuery.updateFromUrl(this.props.match.params.query, this.props.history)
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
              <SearchBar
                inputRef={input => {
                  this.search = input
                  window.searchInput = this.search
                }}
              />
            </div>
          </div>
        </HeroBanner>
        <Results query={this.props.match.params.query} />
      </div>
    )
  }
}

export default withRouter(Search)
