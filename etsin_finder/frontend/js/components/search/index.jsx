{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import ElasticQuery from '../../stores/view/elasticquery'
import { Dataset } from '../../routes'
import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import Results from './results'
import Tracking from '../../utils/tracking'

export default class Search extends Component {
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
    if (this.props.match.params.query) {
      Tracking.newPageView(`Search: ${this.props.match.params.query}`, this.props.location.pathname)
    } else {
      Tracking.newPageView('Search', this.props.location.pathname)
    }
    // when searching on frontpage keep focus in input after enter
    // if (this.props.match.params.query) {
    //   this.search.focus()
    //   this.search.selectionStart = this.search.value.length
    //   this.search.selectionEnd = this.search.value.length
    // }
  }

  initialQuery = () => {
    ElasticQuery.updateFromUrl(this.props.match.params.query, true)
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
}
