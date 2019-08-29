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
import styled from 'styled-components'

import ElasticQuery from '../../stores/view/elasticquery'
import Accessibility from '../../stores/view/accessibility'
import { Dataset } from '../../routes'
import HeroBanner from '../general/hero'
import SearchBar from './searchBar'
import Results from './results'
import Tracking from '../../utils/tracking'
import { Checkbox } from '../qvain/general/form';

export default class Search extends Component {
  constructor() {
    super()
    this.state = {
      initialLoad: false,
      pasCheckboxChecked: false,
    }
  }

  componentWillMount() {
    this.initialQuery()
  }

  componentDidMount() {
    Accessibility.handleNavigation('datasets')
    if (this.props.match.params.query) {
      Tracking.newPageView(`Search: ${this.props.match.params.query}`, this.props.location.pathname)
    } else {
      Tracking.newPageView('Search', this.props.location.pathname)
    }
  }

  // Set 'Include Fairdata PAS datasets' to false, upon exit page
  componentWillUnmount() {
    ElasticQuery.setIncludePasDatasetsToFalse()
  }

  handlePasCheckboxChange = event => {
    this.setState({
      pasCheckboxChecked: event.target.checked,
    })
    ElasticQuery.toggleIncludePasDatasets(this.state.pasCheckboxChecked)
  }

  initialQuery = () => {
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
              <PasContainer>
                <Checkbox
                  checked={this.state.pasCheckboxChecked}
                  onChange={this.handlePasCheckboxChange}
                />
                <Translate content="home.includePas" />
              </PasContainer>
            </section>
          </div>
        </HeroBanner>
        {this.state.initialLoad && <Results />}
      </div>
    )
  }
}

Search.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      query: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

const PasContainer = styled.div`
  padding-top: 10px;
  text-align: right;
  right: 0;
  max-width: 953px;
`
