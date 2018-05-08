import React, { Component } from 'react'
import Translate from 'react-translate-component'

import { Search } from '../../routes'
import SearchBar from '../search/searchBar'
import HeroBanner from '../general/hero'

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
          <div className="text-center regular-row">
            <h2>Frontpage / Searchpage</h2>
          </div>
        </div>
      </div>
    )
  }
}
