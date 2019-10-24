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
// The row below should be de-commented when continuing work on the PAS dataset functionality.
// import { Checkbox, Label } from '../qvain/general/form'

export default class Search extends Component {
  constructor() {
    super()
    this.state = {
      initialLoad: false,
      includePasDatasets: ElasticQuery.includePasDatasets || false,
    }
  }

  componentDidMount() {
    Accessibility.handleNavigation('datasets')
    this.initialQuery()
    if (this.props.match.params.query) {
      Tracking.newPageView(`Search: ${this.props.match.params.query}`, this.props.location.pathname)
    } else {
      Tracking.newPageView('Search', this.props.location.pathname)
    }
  }

  handlePasCheckboxToggle = event => {
    this.setState({
      includePasDatasets: event.target.checked,
    })
    ElasticQuery.toggleIncludePasDatasets(this.state.includePasDatasets)
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
              <IncludePasDatasetsContainer>
                <IncludePasDatasetsInner>
                  <IncludePasDatasetsCheckboxContainer>
                    { /*
                    // These rows should be de-commented when continuing work on the PAS dataset functionality.
                    <Checkbox
                      id="pasCheckbox"
                      checked={this.state.includePasDatasets}
                      onChange={this.handlePasCheckboxToggle}
                    />
                    <Label
                      htmlFor="pasCheckbox"
                    >
                      <Translate content="home.includePas" />
                    </Label>
                    */ }

                  </IncludePasDatasetsCheckboxContainer>
                </IncludePasDatasetsInner>
              </IncludePasDatasetsContainer>
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

const IncludePasDatasetsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;
`

const IncludePasDatasetsInner = styled.div`
  max-width: 800px;
  width: 100%;
  position: relative;
  display: flex;
`

const IncludePasDatasetsCheckboxContainer = styled.div`
  display: flex;
  position: absolute;
  vertical-align: middle;
  right: 0;
`
