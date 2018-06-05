import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import ElasticQuery from '../../stores/view/elasticquery'
import { Dataset } from '../../routes'
import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import Results from './results'

class Search extends Component {
  constructor() {
    super()
    this.state = {
      initialLoad: false,
    }
  }
  componentWillMount() {
    this.initialQuery()
  }
  componentDidMount() {
    // when searching on frontpage keep focus in input after enter
    // if (this.props.match.params.query) {
    //   this.search.focus()
    //   this.search.selectionStart = this.search.value.length
    //   this.search.selectionEnd = this.search.value.length
    // }
  }

  initialQuery = () => {
    ElasticQuery.updateFromUrl(this.props.match.params.query, this.props.history, true)
    ElasticQuery.queryES(true).then(() => {
      this.setState({
        initialLoad: true,
      })
      // preload dataset page
      Dataset.load()
    })
  }

  render() {
    return (
      <div className="search-page">
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
        {this.state.initialLoad && <Results />}
      </div>
    )
  }
}

Search.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
  }).isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(Search)
