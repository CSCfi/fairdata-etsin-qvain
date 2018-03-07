import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Home, Search, Dataset } from '../routes'

export default class Content extends Component {
  render() {
    return (
      <main className="content">
        {/* eslint-disable */}
        <a ref={this.props.contentRef} tabIndex="-1" />
        {/* eslint-enable */}
        <Route exact path="/" component={Home} />
        <Route exact path="/datasets/:query?" component={Search} />
        <Route path="/dataset/:identifier" component={Dataset} />
      </main>
    )
  }
}
