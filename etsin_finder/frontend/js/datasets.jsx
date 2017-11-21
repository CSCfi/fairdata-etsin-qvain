import React, { Component } from 'react'
import axios from 'axios'
import Translate from 'react-translate-component'

import HeroBanner from './components/hero'
import SearchBar from './components/searchBar'
import ResultsList from './components/resultsList'

export default class Datasets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
    }
  }

  componentDidMount() {
    this.getData(this.props.match.params.query)
  }

  componentWillReceiveProps(newProps) {
    this.getData(newProps.match.params.query)
  }

  getData(query) {
    let q = query;
    if (!query) {
      q = '*.*'
    }
    this.setState({ loading: true })
    axios.get(`https://30.30.30.30/es/metax/dataset/_search?q=${q}&pretty&size=100`)
      .then((res) => {
        this.setState({
          results: res.data.hits.hits,
          total: res.data.hits.total,
        })
        console.log(res)
        this.setState({ loading: false })
      })
      .catch((err) => {
        console.log(err)
        this.setState({ loading: false })
      });
  }

  render() {
    return (
      <div>
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
        <ResultsList
          results={this.state.results}
          total={this.state.total}
          loading={this.state.loading}
          query={this.props.match.params.query}
        />
      </div>
    );
  }
}
