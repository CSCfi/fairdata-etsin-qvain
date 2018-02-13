import React, { Component } from 'react'
import FancyRoute from '../components/general/fancyRoute'
import Dataset from '../components/dataset'
import FrontPage from '../components/frontpage'
import Search from '../components/search'

export default class Content extends Component {
  render() {
    return (
      <main className="content">
        {/* eslint-disable */}
        <a ref={this.props.contentRef} tabIndex="-1" />
        {/* eslint-enable */}
        <FancyRoute exact path="/" component={FrontPage} />
        <FancyRoute exact path="/datasets/:query?" component={Search} />
        <FancyRoute path="/dataset/:identifier" component={Dataset} />
      </main>
    )
  }
}
