import React, { Component } from 'react';
import Translate from 'react-translate-component'
import SearchBar from './components/searchBar'
import HeroBanner from './components/hero'

export default class SearchPage extends Component {
  render() {
    return (
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
    );
  }
}
