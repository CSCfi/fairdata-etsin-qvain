import React, { Component } from 'react';
import Translate from 'react-translate-component'
import SearchBar from './components/searchBar'

export default class SearchPage extends Component {
  render() {
    return (
      <div className="hero">
        <div className="container">
          <div className="text-center">
            <h1>
              <Translate content="home.title" />
            </h1>
            <SearchBar />
          </div>
        </div>
      </div>
    );
  }
}
