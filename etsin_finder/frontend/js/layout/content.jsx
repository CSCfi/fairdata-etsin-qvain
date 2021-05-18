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

import React, { useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Home, Search, Dataset, Qvain, QvainDatasets } from '../routes'
import ErrorPage from '../components/errorpage'

import QvainLandingPage from '../components/qvain/views/landingPage'
import { useStores } from '../utils/stores'
import LoggedInRoute from './loggedInRoute'

const Content = ({ contentRef }) => {
  const {
    Auth,
    Env: { isQvain, separateQvain, getQvainUrl },
    Matomo: { changeService },
    Accessibility,
  } = useStores()

  useEffect(() => {
    Accessibility.handleNavigation()
    if (isQvain) {
      changeService('QVAIN')
    } else {
      changeService('ETSIN')
    }
  }, [Accessibility, isQvain, changeService])

  if (Auth.initializing) return null

  const qvainPath = path => {
    if (isQvain) {
      return path || '/'
    }
    return `/qvain${path}`
  }

  return (
    <main className="content">
      <span ref={contentRef} tabIndex="-1" />
      <Switch>
        {separateQvain && <Route path="/qvain" render={redirectToQvain(isQvain, getQvainUrl)} />}
        {!isQvain && [
          <Route exact path="/" key="home" component={Home} />,
          <Route exact path="/datasets/:query?" key="search" component={Search} />,
          <Route path="/dataset/:identifier" key="dataset" component={Dataset} />,
        ]}
        <LoggedInRoute path={qvainPath('/dataset/:identifier')}>
          <Qvain />
        </LoggedInRoute>
        <LoggedInRoute exact path={qvainPath('/dataset')}>
          <Qvain />
        </LoggedInRoute>
        <LoggedInRoute exact path={qvainPath('')} notLoggedIn={<QvainLandingPage />}>
          <QvainDatasets />
        </LoggedInRoute>
        <Route render={() => <ErrorPage error={{ type: 'error' }} />} />
      </Switch>
    </main>
  )
}

Content.propTypes = {
  contentRef: PropTypes.object.isRequired,
}

export default observer(Content)

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
