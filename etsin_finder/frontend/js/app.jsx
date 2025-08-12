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

import { useState, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { observer } from 'mobx-react'

import { registerLocale } from 'react-datepicker'
import { fi, enGB as en } from 'date-fns/locale'

import EnvClass from '@/stores/domain/env'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import Layout from './layout'

import '../fairdata-ui/footer.css'
import 'react-datepicker/dist/react-datepicker.css'
import './utils/extendYup'
import './utils/extendPromise'

import etsinTheme from './styles/theme'
import GlobalStyle from './styles/globalStyles'

const Env = new EnvClass()

registerLocale('fi', fi)
registerLocale('en', en)

if (BUILD === 'test') {
  console.log('We are in test')
} else if (BUILD === 'development') {
  console.log('We are in development')
} else if (BUILD !== 'production') {
  console.log('Looks like we are in development mode!')
}

const hideSpinner = () => {
  const spinner = document.getElementById('app-spinner')
  if (spinner) {
    spinner.hidden = true
  }
}

const App = () => {
  const [initialized, setInitialized] = useState(false)
  const [stores, setStores] = useState()

  // setup tabbing

  // Load runtime config
  const configure = async () => {
    await Env.fetchAppConfig()
    const Stores = buildStores({ Env })
    setStores(Stores)
    const { Accessibility, Auth, Locale } = Stores
    Auth.enableRequestInterceptors()
    Auth.checkLogin()
    Accessibility.initialLoad()
    if (
      Env?.Flags.flagEnabled('PERMISSIONS.WRITE_LOCK') &&
      !Env?.Flags.flagEnabled('QVAIN.METAX_V3.FRONTEND')
    ) {
      Stores.Qvain.Lock.enable()
    }
    Locale.loadLang()
    hideSpinner()
    setInitialized(true)
  }

  useEffect(() => {
    configure()
  }, [])

  if (!initialized || !Env.appConfigLoaded) {
    return null
  }

  return (
    <div className="app">
      <StoresProvider store={stores}>
        <ThemeProvider theme={etsinTheme}>
          <>
            <GlobalStyle />
            <Layout />
          </>
        </ThemeProvider>
      </StoresProvider>
    </div>
  )
}

const router = createBrowserRouter([
  // match everything with "*"
  { path: '*', element: <App /> },
])
Env.history.syncWithRouter(router)

const RoutedApp = () => <RouterProvider router={router} />

export default observer(RoutedApp)
