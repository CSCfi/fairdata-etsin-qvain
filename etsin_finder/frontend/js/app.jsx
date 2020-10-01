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
import { ThemeProvider } from 'styled-components'
import { Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import createBrowserHistory from 'history/createBrowserHistory'
import { syncHistoryWithStore } from 'mobx-react-router'

import '../locale/translations'
import { registerLocale } from 'react-datepicker'
import fi from 'date-fns/locale/fi'
import en from 'date-fns/locale/en-GB'
import Layout from './layout'

import '../fairdata-ui/footer.css'
import 'react-datepicker/dist/react-datepicker.css'

import etsinTheme from './styles/theme'
import GlobalStyle from './styles/globalStyles'
import Stores from './stores'


registerLocale('fi', fi)
registerLocale('en', en)


if (process.env.NODE_ENV === 'test') {
  console.log('We are in test')
} else if (process.env.NODE_ENV === 'development') {
  console.log('We are in development')
} else if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!')
}

/* get language from localstorage */
Stores.Locale.getLang()

// Syncing history with store
const browserHistory = createBrowserHistory()
const history = syncHistoryWithStore(browserHistory, Stores.Env.history)

export default class App extends Component {
  constructor() {
    super()
    Stores.Auth.checkLogin()
  }

  render() {
    return (
      <div className="app">
        <Provider Stores={Stores}>
          <Router history={history}>
            <ThemeProvider theme={etsinTheme}>
              <React.Fragment>
                <GlobalStyle />
                <Layout />
              </React.Fragment>
            </ThemeProvider>
          </Router>
        </Provider>
      </div>
    )
  }
}

// setup tabbing
Stores.Accessibility.initialLoad()
