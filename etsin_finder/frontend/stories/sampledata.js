/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

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
