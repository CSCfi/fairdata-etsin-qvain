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
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'

import { Dataset } from '../../routes'
import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import Results from './results'
import Tracking from '../../utils/tracking'

import { withStores } from '../../stores/stores'

class Search extends Component {
  constructor() {
    super()
    this.state = {
      initialLoad: false,
    }
  }

  componentDidMount() {
    const {
      Stores: { Accessibility },
      match,
      location,
    } = this.props

    Accessibility.handleNavigation('datasets')
    this.initialQuery()

    if (match.params.query) {
      Tracking.newPageView(`Search: ${match.params.query}`, location.pathname)
    } else {
      Tracking.newPageView('Search', location.pathname)
    }
  }

  initialQuery = () => {
    const { ElasticQuery } = this.props.Stores
    ElasticQuery.updateFromUrl(this.props.match.params.query, true)
    ElasticQuery.queryES(true).then(() => {
      this.setState({
        initialLoad: true,
      })
      // preload dataset page
      Dataset.preload()
    })
  }

  render() {
    return (
      <div className="search-page">
        <HeroBanner className="hero-primary">
          <div className="container">
            <section className="text-center">
              <Translate content="home.title" component="h1" />
              <SearchBar
                inputRef={input => {
                  this.search = input
                }}
              />
            </section>
          </div>
        </HeroBanner>
        {this.state.initialLoad && <Results />}
      </div>
    )
  }
}

Search.propTypes = {
  Stores: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

export default withStores(observer(Search))
