import React, { Component } from 'react'
import axios from 'axios'

export default class Datasets extends Component {
  constructor(props) {
    super(props)
    this.state = { results: [] }
    axios.get(`https://30.30.30.30/es/metax/dataset/_search?q=${this.props.match.params.query}&pretty`)
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
    if (this.state.results.length === 0) {
      return <div>Empty</div>
    }
    return (
      <div>
        {this.state.results.map(single => (
          <div key={single._id}>
            {single._source.title.en}
          </div>
        ))}
      </div>
    );
  }
}
