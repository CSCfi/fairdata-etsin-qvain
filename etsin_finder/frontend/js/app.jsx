import React, { Component } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { ThemeProvider } from 'styled-components'

import SkipToContent from './components/general/skipToContent'
import Layout from './layout'
import etsinTheme from './styles/theme'
import './styles/globalStyles'
import Stores from './stores'

if (process.env.NODE_ENV === 'test') {
  console.log('We are in test')
} else if (process.env.NODE_ENV === 'development') {
  console.log('We are in development')
} else if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!')
}

/* get language from localstorage */
const storedLang = localStorage.getItem('lang')
if (storedLang) {
  Stores.Locale.setLang(storedLang)
}

export default class App extends Component {
  constructor() {
    super()
    this.focusContent = this.focusContent.bind(this)
    Stores.Auth.checkLogin()
  }

  focusContent() {
    this.content.focus()
  }

  render() {
    return (
      <div className="app">
        <Provider Stores={Stores}>
          <Router history={Stores.history}>
            <ThemeProvider theme={etsinTheme}>
              <React.Fragment>
                <SkipToContent callback={this.focusContent} />
                <Layout
                  contentRef={content => {
                    this.content = content
                  }}
                />
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
