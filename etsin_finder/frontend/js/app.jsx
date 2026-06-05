import { useState, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { observer } from 'mobx-react'

import { registerLocale } from 'react-datepicker'
import { fi, enGB as en } from 'date-fns/locale'

import EnvClass from '@/stores/domain/env'
import { buildStores } from '@/stores'
import { StoresProvider } from '@/stores/stores'
import Layout from './layout'

import '../fairdata-ui/footer.css'
import 'react-datepicker/dist/react-datepicker.css'

import { getThemeByApp } from './styles/theme'
import GlobalStyle from './styles/globalStyles'
// NOTE: The react-helmet-async dependency (also used by the HeadLinks
// component via Helmet and in dataset-related tests) can likely be removed
// when upgrading to a newer React major version.
import { HelmetProvider } from 'react-helmet-async'

let Env = new EnvClass()

if (import.meta.hot && import.meta.env.MODE === 'development') {
  // Keep Env instance across HMR updates to avoid the configuration
  // fetch that would cause the entire app component to reload.
  if (import.meta.hot.data.Env) {
    const prototype = Object.getPrototypeOf(Env)
    Env = import.meta.hot.data.Env
    Object.setPrototypeOf(Env, prototype)
  }
  import.meta.hot.data.Env = Env // Persist reference to Env across HMR updates
}

registerLocale('fi', fi)
registerLocale('en', en)

if (import.meta.env.MODE === 'test') {
  console.log('We are in test')
} else if (import.meta.env.MODE === 'development') {
  console.log('We are in development')
} else if (import.meta.env.MODE !== 'production') {
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
    if (import.meta.hot && import.meta.env.MODE === 'development') {
      if (Env.appConfigLoaded) {
        // Already configured, no need to configure again
        setInitialized(true)
        return
      }
    }
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

  // Wrap App with HelmetProvider to provide head management support
  // for the HeadLinks component using react-helmet-async.
  return (
    <HelmetProvider>
      <div className="app">
        <StoresProvider store={stores}>
          <ThemeProvider theme={getThemeByApp(Env.app)}>
            <>
              <GlobalStyle />
              <Layout />
            </>
          </ThemeProvider>
        </StoresProvider>
      </div>
    </HelmetProvider>
  )
}

const router = createBrowserRouter([
  // match everything with "*"
  { path: '*', element: <App /> },
])
Env.history.syncWithRouter(router)

const RoutedApp = () => <RouterProvider router={router} />

export default observer(RoutedApp)
