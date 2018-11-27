{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Home, Search, Dataset } from '../routes'
import ErrorPage from '../components/errorpage'

export default class Content extends Component {
  static propTypes = {
    contentRef: PropTypes.object.isRequired,
  }
  render() {
    return (
      <main className="content">
        <span ref={this.props.contentRef} tabIndex="-1" />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/datasets/:query?" component={Search} />
          <Route path="/dataset/:identifier" component={Dataset} />
          <Route render={() => <ErrorPage error={{ type: 'error' }} />} />
        </Switch>
      </main>
    )
  }
}
