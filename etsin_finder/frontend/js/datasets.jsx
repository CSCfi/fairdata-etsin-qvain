import React, { Component } from 'react'
import Translate from 'react-translate-component'

import HeroBanner from './components/hero'
import SearchBar from './components/searchBar'
import ResultsList from './components/resultsList'
import Pagination from './components/pagination'
import searchQuery from './utils/searchQuery'

export default class Datasets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      loading: false,
      pageNum: 1,
      resSize: 50,
      query: this.props.match.params.query,
    }
    this.getData = this.getData.bind(this)
    this.updateQuery = this.updateQuery.bind(this)
    this.updatePage = this.updatePage.bind(this)
    this.toggleLoading = this.toggleLoading.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    this.toggleLoading()
    console.log('getData')
    searchQuery(this.state.query, this.state.resSize, this.state.pageNum)
      .then((res) => {
        console.log('got data')
        this.setState({
          results: res.data.hits.hits,
          total: res.data.hits.total,
        }, () => (
          this.toggleLoading() // loader off
        ))
      })
      .catch((err) => {
        console.log(err)
        this.toggleLoading() // loader off
      })
  }

  updateQuery(query) {
    this.setState({ query }, () => {
      this.getData()
    })
  }

  updatePage(page) {
    this.setState({
      pageNum: page,
    }, () => {
      this.getData()
    })
  }

  toggleLoading() {
    this.setState({
      loading: !this.state.loading,
    })
  }

  render() {
    console.log('---- datasets render ----')
    return (
      <div>
        <HeroBanner className="hero-primary">
          <div className="container">
            <div className="text-center">
              <h1>
                <Translate content="home.title" />
              </h1>
              <SearchBar
                query={this.state.query}
                page={this.state.pageNum}
                updateQuery={this.updateQuery}
              />
            </div>
          </div>
        </HeroBanner>
        {/* <ResultsList
          results={this.state.results}
          total={this.state.total}
          loading={this.state.loading}
          query={this.state.query}
        /> */}
        <Pagination
          total={this.state.total}
          perPage={this.state.resSize}
          currentPage={this.state.pageNum}
          updatePage={this.updatePage}
        />
      </div>
    );
  }
}
