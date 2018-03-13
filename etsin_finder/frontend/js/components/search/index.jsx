import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'
import { Dataset } from '../../routes'

import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import Results from './results'
import ElasticQuery from '../../stores/view/elasticquery'
import getIdentifierFromQuery from '../../utils/getIdentifierFromQuery'

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
    const identifier = getIdentifierFromQuery(this.props.match.params.query)
    if (identifier) {
      this.props.history.push(`/dataset/${identifier}`)
    } else {
      ElasticQuery.updateFromUrl(this.props.match.params.query, this.props.history, true)
      ElasticQuery.queryES(true).then(() => {
        // preload load dataset page
        Dataset.load()
      })
    }
  }

  render() {
    return (
      <div>
        <HeroBanner className="hero-primary">
          <div className="container">
            <div className="text-center">
              <Translate content="home.title" component="h1" />
              <SearchBar
                inputRef={input => {
                  this.search = input
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
