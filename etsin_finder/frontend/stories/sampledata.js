import { Component } from 'react'
import axios from 'axios'

export default class SampleData extends Component {
  state = {
    dataset: null,
  }

  componentDidMount() {
    axios.get(this.props.url).then(res => {
      const dataset = res
      this.setState({ dataset })
    })
  }

  render() {
    return this.props.children(this.state.dataset)
  }
}
