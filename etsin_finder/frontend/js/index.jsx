import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import App from './app'

class Index extends Component {
  render() {
    return <App />
  }
}

ReactDOM.render(<Index />, document.getElementById('content'));
