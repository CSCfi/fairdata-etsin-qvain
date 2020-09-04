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
import { Route, Switch, Redirect } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Auth from '../stores/domain/auth'
import { Home, Search, Dataset, Qvain, QvainDatasets } from '../routes'
import ErrorPage from '../components/errorpage'
import QvainLogin from '../components/qvain/main/qvainLogin'
import QvainLandingPage from '../components/qvain/landingPage'

// import { Home, Search, Dataset, Qvain, QvainDatasets } from '../routes'
// import ErrorPage from '../components/errorpage'
// import Auth from '../stores/domain/auth'
// import Env from '../stores/domain/env'
// import QvainLogin from '../components/qvain/qvainLogin'
class Content extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    contentRef: PropTypes.object.isRequired,
  }

  render() {
    const { Auth: StoresAuth } = this.props.Stores
    return (
      <main className="content">
        <span ref={this.props.contentRef} tabIndex="-1" />
        <Switch>
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route exact path="/datasets/:query?" render={props => <Search {...props} />} />
          <Route path="/dataset/:identifier" render={props => <Dataset {...props} />} />
          <Route path="/qvain/dataset/:identifier" render={renderIfLoggedIn(renderQvain)} />
          <Route path="/qvain/dataset" render={renderIfLoggedIn(renderQvain)} />
          <Route path="/qvain/list" render={renderIfLoggedIn(renderQvainDatasets)} />
          <Route path="/qvain">
            {StoresAuth.cscUserLogged ? <Redirect to="qvain/list" /> : <QvainLandingPage />}
          </Route>
          <Route render={() => <ErrorPage error={{ type: 'error' }} />} />
        </Switch>
      </main>
    )
  }
}

export default inject('Stores')(observer(Content))

// Restrict access to Qvain Light
// Since I couldn't get Private Routes to work, here's a workaround

const renderQvain = props => <Qvain {...props} />
const renderQvainDatasets = props => <QvainDatasets {...props} />

const renderIfLoggedIn = renderFunc => props => {
  // Rendered components (login button view and the actual component we want to render)
  const login = <QvainLogin redirectPath={props.location.pathName} />
  const actual = renderFunc(props)

  // render the actual if logged in
  // if not, check from backend
  // if backend tells that it has no logged in users, force user to travel to login site
  if (!allowAccess()) {
    Auth.checkLogin().then(() => {
      if (!allowAccess()) {
        window.location = `/sso?relay=${props.location.pathname}`
        return login
      }
      return actual
    })
    window.location = `/sso?relay=${props.location.pathname}`
    return login
  }
  return actual
}

const allowAccess = () => Auth.cscUserLogged
