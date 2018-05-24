import React, { Component } from 'react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { Search } from '../../routes'
import SearchBar from '../search/searchBar'
import HeroBanner from '../general/hero'
import KeyValues from './keyValues'

export default class FrontPage extends Component {
  componentDidMount() {
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

const TextHolder = styled.div`
  max-width: 50rem;
  margin: 0 auto;
  p {
    white-space: pre-line;
  }
`
