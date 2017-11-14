import React, { Component } from 'react'
import axios from 'axios'
import Translate from 'react-translate-component'
import HeroBanner from './components/hero'
import SearchBar from './components/searchBar'
import ListItem from './components/listItem'

export default class Datasets extends Component {
  constructor(props) {
    super(props)
    this.state = { results: [] }
  }

  componentDidMount() {
    this.getData(this.props.match.params.query)
  }

  componentWillReceiveProps(newProps) {
    this.getData(newProps.match.params.query)
  }

  getData(query) {
    axios.get(`https://30.30.30.30/es/metax/dataset/_search?q=${query}&pretty`)
      .then((res) => {
        console.log(res)
        this.setState({
          results: res.data.hits.hits,
        })
      })
      .catch((err) => {
        console.log(err)
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
        <div className="container">
          <div className="row regular-row">
            <div className="col-3">
              Sidebar
              <div className="content-box">
                Filtering
              </div>
            </div>
            <div className="col-9">
              {this.state.results.length === 0
                ? <div>Empty</div>
                : this.state.results.map(single => (
                  <ListItem key={single._id} item={single._source} />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
