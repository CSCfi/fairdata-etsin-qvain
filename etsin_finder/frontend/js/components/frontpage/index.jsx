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
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Search } from '../../routes'
import SearchBar from '../search/searchBar'
import HeroBanner from '../general/hero'
import KeyValues from './keyValues'
import Accessibility from '../../stores/view/accessibility'
import Tracking from '../../utils/tracking'

export default class FrontPage extends Component {
  componentDidMount() {
    Accessibility.handleNavigation('home')
    Tracking.newPageView('Etsin | Tutkimusaineistojen hakupalvelu', this.props.location.pathname)
    // preload search page
    Search.load()
  }
  render() {
    return (
      <div className="search-page">
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
        <div className="container">
          <div className="regular-row">
            <TextHolder>
              <KeyValues />
              <Translate content="home.title1" component="h2" />
              <Translate content="home.para1" component="p" unsafe />
              <Translate content="home.title2" component="h2" />
              <Translate content="home.para2" component="p" unsafe />
            </TextHolder>
          </div>
        </div>
      </div>
    )
  }
}

FrontPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired
}

const TextHolder = styled.div`
  max-width: 50rem;
  margin: 0 auto;
  p {
    white-space: pre-line;
  }
`
