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
import { Home, Search, Dataset, Qvain, QvainDatasets } from '../routes'
import ErrorPage from '../components/errorpage'
import QvainLogin from '../components/qvain/main/qvainLogin'
import QvainLandingPage from '../components/qvain/landingPage'

class Content extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    contentRef: PropTypes.object.isRequired,
  }

  render() {
    const { Auth, Env } = this.props.Stores
    if (Auth.initializing) return null

    const { isQvain, separateQvain, getQvainUrl } = Env
    const qvainPath = path => {
      if (isQvain) {
        return path || '/'
      }
      return `/qvain${path}`
    }

    return (
      <main className="content">
        <span ref={this.props.contentRef} tabIndex="-1" />
        <Switch>
          {separateQvain && <Route path="/qvain" render={redirectToQvain(isQvain, getQvainUrl)} />}
          {!isQvain && [
            <Route exact path="/" key="home" component={Home} />,
            <Route exact path="/datasets/:query?" key="search" component={Search} />,
            <Route path="/dataset/:identifier" key="dataset" component={Dataset} />,
          ]}
          <Route
            path={qvainPath('/dataset/:identifier')}
            render={renderIfLoggedIn(renderQvain, Auth)}
          />
          <Route exact path={qvainPath('/dataset')} render={renderIfLoggedIn(renderQvain, Auth)} />
          <Route
            exact
            path={qvainPath('')}
            render={renderIfLoggedIn(renderQvainDatasets, Auth, renderQvainLandingPage)}
          />
          <Route render={() => <ErrorPage error={{ type: 'error' }} />} />
        </Switch>
      </main>
    )
  }
}

export default inject('Stores')(observer(Content))

const redirectToQvain = (isQvain, getQvainUrl) => props => {
  // redirect /qvain to the new qvain app url
  const path = props.location.pathname.replace(/^\/qvain/, '')
  if (isQvain) {
    // already in qvain, just remove /qvain from path
    return <Redirect to={path} />
  }
  // not in qvain, redirect to qvain domain
  const url = getQvainUrl(path)
  window.location.replace(url)
  return ''
}

// Restrict access to Qvain Light
// Since I couldn't get Private Routes to work, here's a workaround

const renderQvain = props => <Qvain {...props} />
const renderQvainDatasets = props => <QvainDatasets {...props} />
const renderQvainLandingPage = props => <QvainLandingPage {...props} />

const renderIfLoggedIn = (renderFunc, Auth, redirect) => props => {
  // Rendered components (login button view and the actual component we want to render)
  const login = redirect ? redirect(props) : <QvainLogin redirectPath={props.location.pathname} />
  const actual = renderFunc(props)

  // render the actual if logged in
  // if not, check from backend
  // if backend tells that it has no logged in users, force user to travel to login site

  if (!allowAccess(Auth)) {
    Auth.checkLogin().then(() => {
      if (!allowAccess(Auth)) {
        return login
      }
      return actual
    })
    return login
  }
  return actual
}

const allowAccess = Auth => (Auth || {}).cscUserLogged
