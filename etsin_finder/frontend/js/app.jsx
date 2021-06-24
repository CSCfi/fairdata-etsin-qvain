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

import React, { useState, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { Router } from 'react-router-dom'
import { syncHistoryWithStore } from 'mobx-react-router'

import '../locale/translations'
import { registerLocale } from 'react-datepicker'
import fi from 'date-fns/locale/fi'
import en from 'date-fns/locale/en-GB'
import Layout from './layout'
import browserHistory from './browserHistory'

import '../fairdata-ui/footer.css'
import '../fairdata-ui/notification.css'
import 'react-datepicker/dist/react-datepicker.css'

import etsinTheme from './styles/theme'
import GlobalStyle from './styles/globalStyles'
import Stores from './stores'
import { StoresProvider } from './stores/stores'
import extendYup from './utils/extendYup'

const { Env, Locale, Auth, Accessibility } = Stores

registerLocale('fi', fi)
registerLocale('en', en)

if (BUILD === 'test') {
  console.log('We are in test')
} else if (BUILD === 'development') {
  console.log('We are in development')
} else if (BUILD !== 'production') {
  console.log('Looks like we are in development mode!')
}

// Syncing history with store
const history = syncHistoryWithStore(browserHistory, Env.history)

const hideSpinner = () => {
  const spinner = document.getElementById('app-spinner')
  if (spinner) {
    spinner.hidden = true
  }
}

extendYup()

const App = () => {
  const [initialized, setInitialized] = useState(false)

  // Load runtime config
  const configure = async () => {
    await Env.fetchAppConfig()
    Locale.loadLang()
    hideSpinner()
    setInitialized(true)
  }

  useEffect(() => {
    Auth.checkLogin()
    configure()
  }, [])

  if (!initialized) {
    return null
  }

  return (
    <div className="app">
      <StoresProvider store={Stores}>
        <Router history={history}>
          <ThemeProvider theme={etsinTheme}>
            <>
              <GlobalStyle />
              <Layout />
            </>
          </ThemeProvider>
        </Router>
      </StoresProvider>
    </div>
  )
}

export default App

// setup tabbing
Accessibility.initialLoad()
