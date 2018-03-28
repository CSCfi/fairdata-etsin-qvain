import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Home, Search, Dataset, About, Organizations } from 'Routes'

export default class Content extends Component {
  render() {
    return (
      <main className="content">
        {/* eslint-disable */}
        <a ref={this.props.contentRef} tabIndex="-1" />
        {/* eslint-enable */}
        <Route exact path="/" component={Home} />
        <Route exact path="/datasets/:query?" component={Search} />
        <Route exact path="/about" component={About} />
        <Route exact path="/organizations" component={Organizations} />
        <Route path="/dataset/:identifier" component={Dataset} />
      </main>
    )
  }
}
