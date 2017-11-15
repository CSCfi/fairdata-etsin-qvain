import React, { Component } from 'react'
import axios from 'axios'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'

import HeroBanner from './components/hero'
import SearchBar from './components/searchBar'
import ListItem from './components/listItem'

class Datasets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
    }
    this.renderList = this.renderList.bind(this)
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
    axios.get(`https://30.30.30.30/es/metax/dataset/_search?q=${q}&pretty&size=100`)
      .then((res) => {
        this.setState({
          results: res.data.hits.hits,
          total: res.data.hits.total,
        })
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      });
  }

  renderList(lang) {
    // console.time()
    const list = this.state.results.map(single => (
      <ListItem
        key={single._id}
        identifier={single._id}
        item={single._source}
        lang={lang}
      />
    ), this)
    // console.timeEnd()
    return list
  }

  render() {
    const { currentLang } = this.props.Stores.Locale
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
        <div className="container">
          <div className="row regular-row">
            <div className="col-lg-3">
              <Translate className="results-amount" with={{ amount: this.state.total }} component="p" content={`results.amount.${this.state.total === 1 ? 'snglr' : 'plrl'}`} fallback="%(amount)s results" />
              <div className="content-box">
                Filtering
              </div>
            </div>
            <div className="col-lg-9">
              {this.state.results.length === 0
                ? <div>Loading</div>
                : this.renderList(currentLang)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject('Stores')(observer(Datasets))
