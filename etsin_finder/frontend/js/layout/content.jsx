import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Home, Search, Dataset, About } from '../routes'
import Announcer from '../components/general/announcer'
import ErrorPage from '../components/errorpage'

export default class Content extends Component {
  static propTypes = {
    contentRef: PropTypes.func.isRequired,
  }
  render() {
    return (
      <main className="content">
        <Announcer />
        <span ref={this.props.contentRef} tabIndex="-1" />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/datasets/:query?" component={Search} />
          <Route exact path="/about" component={About} />
          <Route path="/dataset/:identifier" component={Dataset} />
          <Route render={() => <ErrorPage error={{ type: 'error' }} />} />
        </Switch>
      </main>
    )
  }
}
