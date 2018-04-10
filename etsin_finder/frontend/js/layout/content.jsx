import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Home, Search, Dataset, About } from 'Routes'
import ErrorPage from '../components/errorpage'

export default class Content extends Component {
  render() {
    return (
      <main className="content">
        {/* eslint-disable */}
        <a ref={this.props.contentRef} tabIndex="-1" />
        {/* eslint-enable */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/datasets/:query?" component={Search} />
          <Route exact path="/about" component={About} />
          {/* <Route exact path="/organizations" component={Organizations} /> */}
          <Route path="/dataset/:identifier" component={Dataset} />
          <Route render={() => <ErrorPage error={{ type: 'error' }} />} />
        </Switch>
      </main>
    )
  }
}
